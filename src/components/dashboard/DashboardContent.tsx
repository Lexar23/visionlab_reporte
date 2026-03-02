"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReportData } from "@/types/report";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { DataDisplay } from "@/components/dashboard/DataDisplay";
import { ReworkManager } from "@/components/dashboard/ReworkManager";
import { Filter, Calendar, RefreshCw, LayoutDashboard, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardContentProps {
    initialData: ReportData[];
}

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];

export function DashboardContent({ initialData }: DashboardContentProps) {
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState<string>("2024");
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsRefreshing(true);
            router.refresh();
            setTimeout(() => setIsRefreshing(false), 800);
        }, 15000); // Polling slightly slower to be less intrusive
        return () => clearInterval(interval);
    }, [router]);

    const years = useMemo(() => {
        const yrs = Array.from(new Set(initialData.map(d => d.fecha.getFullYear().toString())));
        return yrs.sort((a, b) => b.localeCompare(a));
    }, [initialData]);

    const stats = useMemo(() => {
        const currentYear = selectedYear === "all" ? Array.from(years)[0] : selectedYear;
        const previousYear = (parseInt(currentYear) - 1).toString();

        const currentYearData = initialData.filter(d => d.fecha.getFullYear().toString() === currentYear);
        const previousYearData = initialData.filter(d => d.fecha.getFullYear().toString() === previousYear);

        const fData = initialData.filter(d => {
            const matchesYear = selectedYear === "all" || d.fecha.getFullYear().toString() === selectedYear;
            const matchesMonth = selectedMonth === "all" || d.fecha.getMonth().toString() === selectedMonth;
            return matchesYear && matchesMonth;
        });

        const comparison = MONTH_NAMES.map((month, idx) => {
            const curVal = currentYearData
                .filter(d => d.fecha.getMonth() === idx && !d.retrabajo)
                .reduce((acc, d) => acc + d.total, 0);
            const prevVal = previousYearData
                .filter(d => d.fecha.getMonth() === idx && !d.retrabajo)
                .reduce((acc, d) => acc + d.total, 0);

            const growth = prevVal > 0 ? ((curVal - prevVal) / prevVal) * 100 : 0;
            const meta = prevVal > 0 ? prevVal * 1.15 : (curVal > 0 ? curVal * 1.1 : 1200000);

            return { mes: month, current: curVal, previous: prevVal, growth, meta };
        });

        const optoStats: Record<string, { total: number, qty: number }> = {};
        fData.forEach(d => {
            const name = d.optometra || 'Desconocido';
            if (!optoStats[name]) optoStats[name] = { total: 0, qty: 0 };
            if (!d.retrabajo) optoStats[name].total += d.total;
            optoStats[name].qty += d.cantidad;
        });

        const sortedOptos = Object.entries(optoStats)
            .filter(([name]) => name !== 'N/A' && name !== 'Desconocido' && name !== 'undefined' && name.trim() !== '')
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        const designStats: Record<string, number> = {};
        fData.forEach(d => {
            const design = d.servicioArticulo || 'N/D';
            if (design !== 'N/A' && design !== 'N/D') {
                designStats[design] = (designStats[design] || 0) + (d.cantidad || 1);
            }
        });
        const designDist = Object.entries(designStats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);

        const branchSalesMap: Record<string, number> = {};
        fData.forEach(d => {
            const branch = d.sucursal || 'N/A';
            if (!d.retrabajo) {
                branchSalesMap[branch] = (branchSalesMap[branch] || 0) + d.total;
            }
        });

        const branchStatsArr = Object.entries(branchSalesMap)
            .map(([name, total]) => ({ sucursal: name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 8);

        const totalRecords = fData.length;
        const reworksCount = fData.filter(d => d.retrabajo).length;
        const goodCount = totalRecords - reworksCount;

        const qualityRatios = [
            { name: 'Lentes Buenos', value: goodCount },
            { name: 'Retrabajos', value: reworksCount }
        ];

        const bestBranch = branchStatsArr[0]?.sucursal || 'N/A';

        return {
            filteredData: fData,
            salesByMonthComparison: comparison,
            topOptometrasTotal: sortedOptos,
            topOptometrasQty: [...sortedOptos].sort((a, b) => b.qty - a.qty),
            designDistribution: designDist,
            sucursalLider: bestBranch,
            salesByBranch: branchStatsArr,
            qualityRatios,
            currentYear,
            previousYear
        };
    }, [initialData, selectedYear, selectedMonth, years]);

    const {
        filteredData,
        salesByMonthComparison,
        topOptometrasTotal,
        topOptometrasQty,
        designDistribution,
        sucursalLider,
        salesByBranch,
        qualityRatios,
        currentYear,
        previousYear
    } = stats;

    return (
        <div className="flex flex-col lg:flex-row gap-8 bg-[#f8fafc] dark:bg-slate-950 p-4 md:p-8 min-h-screen">

            {/* Sidebar-style Filters */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full lg:w-72 space-y-4"
            >
                <div className="p-6 bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2rem] sticky top-24 shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <LayoutDashboard className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-black uppercase tracking-tighter text-sm">Filtros</span>
                        </div>
                        <AnimatePresence>
                            {isRefreshing && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Selección de Año
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {years.map(y => (
                                    <button
                                        key={y}
                                        onClick={() => setSelectedYear(y)}
                                        className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all border ${selectedYear === y
                                            ? 'bg-primary border-primary/20 text-white shadow-xl shadow-primary/30 scale-[1.02]'
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {y}
                                        <ChevronRight className={`w-3 h-3 transition-transform ${selectedYear === y ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] flex items-center gap-2">
                                <Filter className="w-3 h-3" /> Selección de Mes
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setSelectedMonth("all")}
                                    className={`col-span-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedMonth === "all"
                                        ? 'bg-emerald-500 border-emerald-500/20 text-white shadow-xl shadow-emerald-500/20'
                                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Resumen Anual
                                </button>
                                {MONTH_NAMES.map((m, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedMonth(i.toString())}
                                        className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${selectedMonth === i.toString()
                                            ? 'bg-primary dark:bg-white border-primary dark:border-white text-white dark:text-slate-950 scale-[1.02] shadow-lg'
                                            : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                        <div className="rounded-2xl bg-gradient-to-br from-primary/10 dark:from-primary/20 to-transparent p-4 border border-primary/10">
                            <p className="text-[10px] text-primary font-black uppercase mb-1">Status del Sistema</p>
                            <p className="text-slate-900 dark:text-white text-xs font-bold flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                Conectado al Reporte
                            </p>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 space-y-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <StatsCards
                        totalVentas={filteredData.filter(d => !d.retrabajo).reduce((acc, d) => acc + d.total, 0)}
                        totalFacturas={filteredData.length}
                        retrabajos={filteredData.filter(d => d.retrabajo).length}
                        sucursalMasActiva={sucursalLider}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <ChartsSection
                        salesByBranch={salesByBranch}
                        qualityRatios={qualityRatios}
                        salesByMonth={salesByMonthComparison}
                        statusDistribution={[]}
                        topOptometrasTotal={topOptometrasTotal}
                        topOptometrasQty={topOptometrasQty}
                        designDistribution={designDistribution}
                        currentYear={currentYear}
                        previousYear={previousYear}
                    />
                </motion.div>
            </main>
        </div>
    );
}
