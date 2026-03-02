"use client";

import { useState, useEffect } from "react";
import { Card, cn } from "@/components/ui";
import { useTheme } from "next-themes";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { motion } from "framer-motion";

interface ChartsProps {
    salesByBranch: { sucursal: string; total: number }[];
    qualityRatios: { name: string; value: number }[];
    salesByMonth: { mes: string; current: number; previous: number; growth: number }[];
    statusDistribution: { name: string; value: number }[];
    topOptometrasTotal: { name: string; total: number }[];
    topOptometrasQty: { name: string; qty: number }[];
    designDistribution: { name: string; value: number }[];
    currentYear: string;
    previousYear: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'];
const QUALITY_COLORS = ['#10b981', '#ef4444']; // Emerald for Good, Rose for Reworks

export function ChartsSection({
    salesByBranch,
    qualityRatios,
    salesByMonth,
    topOptometrasTotal,
    topOptometrasQty,
    designDistribution,
    currentYear,
    previousYear
}: ChartsProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";
    const chartTextColor = isDark ? "#64748b" : "#475569";
    const chartGridColor = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)";
    const tooltipBg = isDark ? "#0f172a" : "#ffffff";
    const tooltipBorder = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";
    const cardBg = "bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-white/5";
    const textLabel = "text-slate-500 dark:text-slate-400";
    const textMain = "text-slate-900 dark:text-white";

    const shortenName = (name: string) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length <= 2) return name;
        return `${parts[0]} ${parts[1]}`;
    };

    const sortedDesigns = [...designDistribution]
        .sort((a, b) => b.value - a.value);

    const sortedOptos = [...topOptometrasTotal]
        .sort((a, b) => b.total - a.total)
        .slice(0, 8)
        .map(item => ({ ...item, name: shortenName(item.name) }));

    const sortedBranches = [...salesByBranch]
        .sort((a, b) => b.total - a.total)
        .slice(0, 8);

    const totalOptos = sortedOptos.reduce((acc, curr) => acc + curr.total, 0);
    const totalBranches = sortedBranches.reduce((acc, curr) => acc + curr.total, 0);
    const totalProduction = qualityRatios.reduce((acc, curr) => acc + curr.value, 0);

    if (!isMounted) return <div className="grid grid-cols-12 gap-6 mt-8 h-[500px] animate-pulse bg-slate-900/10 rounded-[2.5rem]" />;

    return (
        <div className="grid grid-cols-12 gap-6 mt-8">

            {/* SECTION 1: Comparison Table */}
            <div className="col-span-12">
                <Card className={cn(cardBg, "flex flex-col shadow-2xl overflow-hidden rounded-[2.5rem]")}>
                    <div className="p-6 border-b border-slate-200 dark:border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 italic">Comparativa Mensual de Ventas</h3>
                    </div>
                    <div className="w-full">
                        <div className="px-4 md:px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5 grid grid-cols-4 text-[9px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest text-slate-500 text-center items-center">
                            <span className="text-left font-black">Mes</span>
                            <span className="truncate px-1">Ventas {previousYear.slice(-2)}'</span>
                            <span className="truncate px-1">Ventas {currentYear.slice(-2)}'</span>
                            <span className="truncate">Crec.</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                            {salesByMonth.map((row, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="grid grid-cols-4 text-center p-3 md:p-4 text-[10px] md:text-xs group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors border-b border-slate-100 dark:border-white/[0.02] items-center"
                                >
                                    <span className="text-left font-black text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors truncate">{row.mes}</span>
                                    <span className="font-medium text-slate-400 dark:text-slate-500 italic truncate tracking-tighter md:tracking-normal">¢{row.previous.toLocaleString()}</span>
                                    <div className="flex justify-center overflow-hidden">
                                        <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 rounded-lg py-1 px-1.5 md:px-3 border border-slate-200 dark:border-white/5 truncate tracking-tighter md:tracking-normal">
                                            ¢{row.current.toLocaleString()}
                                        </span>
                                    </div>
                                    <span className={`font-black flex items-center justify-center gap-0.5 md:gap-1 ${row.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'} text-[9px] md:text-xs`}>
                                        {row.growth >= 0 ? '↑' : '↓'}{Math.abs(row.growth).toFixed(0)}%
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* GRID OF 4 PIE CHARTS */}

            {/* 1. Lentes por diseño */}
            <div className="col-span-12 lg:col-span-6 min-h-[450px] lg:h-[500px]">
                <Card className={cn(cardBg, "h-full flex flex-col shadow-2xl overflow-hidden rounded-[2.5rem]")}>
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-white/5">
                        <h3 className={cn(textMain, "text-sm font-black uppercase tracking-widest italic text-center")}>Lentes por diseño</h3>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center justify-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sortedDesigns}
                                        cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                                        paddingAngle={5} startAngle={90} endAngle={-270}
                                        dataKey="value" stroke="none" label={false}
                                    >
                                        {sortedDesigns.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '16px' }}
                                        itemStyle={{ color: isDark ? '#fff' : '#000', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full px-4 mt-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {sortedDesigns.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] font-black text-slate-500 dark:text-white/50 uppercase truncate leading-none">{item.name}</span>
                                            <span className={cn(textMain, "text-xs font-black truncate mt-1")}>{item.value} UNDS</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 2. Porcentaje de Vendedores */}
            <div className="col-span-12 lg:col-span-6 min-h-[450px] lg:h-[500px]">
                <Card className={cn(cardBg, "h-full flex flex-col shadow-2xl overflow-hidden rounded-[2.5rem]")}>
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-white/5">
                        <h3 className={cn(textMain, "text-sm font-black uppercase tracking-widest italic text-center")}>Porcentaje de Vendedores</h3>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center justify-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sortedOptos}
                                        cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                                        startAngle={90} endAngle={-270} dataKey="total"
                                        stroke="none" label={false}
                                    >
                                        {sortedOptos.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px' }}
                                        itemStyle={{ color: isDark ? '#fff' : '#000', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full px-4 mt-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {sortedOptos.map((item, index) => {
                                    const percent = ((item.total / totalOptos) * 100).toFixed(0);
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[10px] font-black text-slate-500 dark:text-white/50 uppercase truncate leading-none">{item.name}</span>
                                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 leading-none mt-1">{percent}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 3. Ventas por Sucursal */}
            <div className="col-span-12 lg:col-span-6 min-h-[450px] lg:h-[500px]">
                <Card className={cn(cardBg, "h-full flex flex-col shadow-2xl overflow-hidden rounded-[2.5rem]")}>
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-white/5">
                        <h3 className={cn(textMain, "text-sm font-black uppercase tracking-widest italic text-center")}>Ventas por Sucursal</h3>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center justify-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sortedBranches}
                                        cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                                        startAngle={90} endAngle={-270} dataKey="total"
                                        stroke="none" label={false}
                                    >
                                        {sortedBranches.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px' }}
                                        itemStyle={{ color: isDark ? '#fff' : '#000', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full px-4 mt-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {sortedBranches.map((item, index) => {
                                    const percent = ((item.total / totalBranches) * 100).toFixed(0);
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[10px] font-black text-slate-500 dark:text-white/50 uppercase truncate leading-none">{shortenName(item.sucursal)}</span>
                                                <span className="text-xs font-black text-blue-600 dark:text-blue-400 leading-none mt-1">{percent}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 4. Calidad del Laboratorio (Buenos vs Retrabajos) */}
            <div className="col-span-12 lg:col-span-6 min-h-[450px] lg:h-[500px]">
                <Card className={cn(cardBg, "h-full flex flex-col shadow-2xl overflow-hidden rounded-[2.5rem]")}>
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-white/5">
                        <h3 className={cn(textMain, "text-sm font-black uppercase tracking-widest italic text-center")}>Calidad del Laboratorio</h3>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center justify-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={qualityRatios}
                                        cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                                        paddingAngle={5} startAngle={90} endAngle={-270}
                                        dataKey="value" stroke="none" label={false}
                                    >
                                        {qualityRatios.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={QUALITY_COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px' }}
                                        itemStyle={{ color: isDark ? '#fff' : '#000', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full px-4 mt-8">
                            <div className="grid grid-cols-2 gap-8">
                                {qualityRatios.map((item, index) => {
                                    const percent = totalProduction > 0 ? ((item.value / totalProduction) * 100).toFixed(1) : 0;
                                    const isRework = item.name === 'Retrabajos';
                                    return (
                                        <div key={index} className="flex flex-col items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: QUALITY_COLORS[index] }} />
                                                <span className="text-[10px] font-black text-slate-500 dark:text-white/70 uppercase tracking-tighter">{item.name}</span>
                                            </div>
                                            <span className={`text-2xl font-black ${isRework ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'} tracking-tighter`}>
                                                {item.value}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">{percent}% del Total</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* SECTION 3: Lentes solicitados (Horizontal Bar) */}
            <div className="col-span-12 h-[400px]">
                <Card className={cn(cardBg, "rounded-[2.5rem] p-8 shadow-2xl h-full")}>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 text-center italic">Piezas Solicitadas por Profesional</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={topOptometrasQty} layout="vertical" margin={{ left: 60, right: 40 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                width={120}
                                style={{ fill: chartTextColor, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                            />
                            <Tooltip
                                cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px' }}
                                itemStyle={{ color: isDark ? '#fff' : '#000', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}
                            />
                            <Bar
                                dataKey="qty"
                                fill="#3b82f6"
                                radius={[0, 20, 20, 0]}
                                barSize={12}
                                background={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', radius: 20 }}
                                label={{ position: 'right', fill: isDark ? '#fff' : '#000', fontSize: 12, fontWeight: '900', offset: 15 }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* FOOTER STATS: Big Impact Numbers */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-8 md:py-10 px-6 md:px-12 bg-gradient-to-br from-white dark:from-slate-900/80 to-slate-50 dark:to-slate-950 border border-slate-200 dark:border-white/5 rounded-[2rem] md:rounded-[3rem] shadow-xl dark:shadow-[0_0_50px_-12px_rgba(59,130,246,0.1)] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5 pb-8 md:pb-0 md:pr-12">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Monto Bruto Anualizado</p>
                    <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic drop-shadow-2xl">
                        ¢ {salesByMonth.reduce((acc, curr) => acc + curr.current, 0).toLocaleString()}
                    </p>
                </div>

                <div className="text-center md:text-right pt-8 md:pt-0 md:pl-12 flex flex-col justify-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Piezas Consignadas</p>
                    <div className="flex items-baseline justify-center md:justify-end gap-3">
                        <span className="text-3xl lg:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            {topOptometrasQty.reduce((acc, curr) => acc + curr.qty, 0)}
                        </span>
                        <span className="text-emerald-500/50 font-black text-xl italic uppercase">UNID</span>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
