"use client";

import { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import { Search, Hammer, AlertCircle } from "lucide-react";
import { ReportData } from "@/types/report";

interface TableProps {
    data: ReportData[];
}

export function DataDisplay({ data }: TableProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyRework, setShowOnlyRework] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="mt-8 h-96 animate-pulse bg-slate-900/50 rounded-3xl" />;

    const filteredData = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = item.cliente.toLowerCase().includes(searchLower) ||
            item.factura.toLowerCase().includes(searchLower) ||
            item.sucursal.toLowerCase().includes(searchLower) ||
            item.servicioArticulo.toLowerCase().includes(searchLower) ||
            (item.ordenProduccion && item.ordenProduccion.toLowerCase().includes(searchLower));
        const matchesRework = showOnlyRework ? item.retrabajo : true;
        return matchesSearch && matchesRework;
    });

    const totalReworksCount = filteredData.filter(item => item.retrabajo).length;

    return (
        <div className="mt-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">Detalle de Operaciones</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Registros de producción y facturación</p>
                </div>
                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar cliente, factura, orden o servicio..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowOnlyRework(!showOnlyRework)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border ${showOnlyRework
                            ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-rose-500/50 hover:text-rose-600 dark:hover:text-rose-400'
                            }`}
                    >
                        <Hammer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Solo Retrabajos</span>
                    </button>
                </div>
            </div>

            <Card className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="w-full overflow-hidden">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-white/5">
                                <th className="w-[18%] md:w-[12%] px-2 md:px-6 py-4 text-[8px] md:text-[10px] font-black uppercase tracking-tight text-slate-500">Fact.</th>
                                <th className="hidden xl:table-cell w-[10%] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Orden</th>
                                <th className="w-[45%] md:w-[25%] px-2 md:px-6 py-4 text-[8px] md:text-[10px] font-black uppercase tracking-tight text-slate-500">Cliente</th>
                                <th className="hidden lg:table-cell w-[15%] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Servicio</th>
                                <th className="hidden md:table-cell w-[8%] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Cant</th>
                                <th className="hidden lg:table-cell w-[12%] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Sucu.</th>
                                <th className="w-[12%] md:w-[10%] px-1 md:px-6 py-4 text-[8px] md:text-[10px] font-black uppercase tracking-tight text-slate-500 text-center">QC</th>
                                <th className="w-[25%] md:w-[18%] px-2 md:px-6 py-4 text-[8px] md:text-[10px] font-black uppercase tracking-tight text-slate-500 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.02]">
                            {filteredData.length > 0 ? filteredData.slice(0, 100).map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-2 md:px-6 py-3 font-black text-slate-600 dark:text-slate-300 text-[10px] md:text-sm truncate">
                                        #{item.factura}
                                    </td>
                                    <td className="hidden xl:table-cell px-6 py-3">
                                        <span className="text-[10px] font-black text-primary bg-primary/5 py-0.5 px-2 rounded-lg border border-primary/10">
                                            {item.ordenProduccion || '—'}
                                        </span>
                                    </td>
                                    <td className="px-2 md:px-6 py-3">
                                        <p className="text-[10px] md:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{item.cliente}</p>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase lg:hidden truncate">{item.sucursal}</p>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-3">
                                        <span className="text-[9px] font-black py-0.5 px-2 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 uppercase truncate">
                                            {item.servicioArticulo}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-3 text-center">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-white border border-slate-100 dark:border-white/5">
                                            {item.cantidad}
                                        </span>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-3">
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase truncate">{item.sucursal}</p>
                                    </td>
                                    <td className="px-1 md:px-6 py-3 text-center">
                                        {item.retrabajo ? (
                                            <div className="flex justify-center">
                                                <div className="p-1 md:px-3 md:py-1.5 bg-rose-500/10 text-rose-500 rounded-lg border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                                    <AlertCircle className="w-3 h-3" />
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-200 dark:text-slate-800 font-black">—</span>
                                        )}
                                    </td>
                                    <td className="px-2 md:px-6 py-3 text-[10px] md:text-xs font-black text-slate-900 dark:text-white italic text-right truncate">
                                        ¢{item.total.toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                                        No se encontraron registros...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
