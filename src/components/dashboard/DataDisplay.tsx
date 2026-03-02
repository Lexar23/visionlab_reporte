"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/ui";
import { Search, Hammer, AlertCircle } from "lucide-react";
import { ReportData } from "@/types/report";

interface TableProps {
    data: ReportData[];
}

export function DataDisplay({ data }: TableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyRework, setShowOnlyRework] = useState(false);

    const filteredData = data.filter(item => {
        const matchesSearch = item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sucursal.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRework = showOnlyRework ? item.retrabajo : true;
        return matchesSearch && matchesRework;
    });

    return (
        <div className="mt-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <h3 className="text-xl font-black text-white italic">Detalle de Operaciones</h3>
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar cliente, factura o sucursal..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowOnlyRework(!showOnlyRework)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${showOnlyRework
                                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xl shadow-amber-500/20'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-amber-500/50 hover:text-amber-500'
                            }`}
                    >
                        <Hammer className="w-4 h-4" />
                        <span className="hidden sm:inline">Solo Retrabajos</span>
                    </button>
                </div>
            </div>

            <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Factura</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Cliente</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Sucursal</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Fecha</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Total</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Calidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredData.length > 0 ? filteredData.slice(0, 100).map((item, i) => (
                                <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5 font-bold text-slate-300">{item.factura}</td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{item.cliente}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{item.servicioArticulo}</p>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-400 font-medium">{item.sucursal}</td>
                                    <td className="px-6 py-5 text-sm text-slate-500 font-mono">{item.fecha.toLocaleDateString('es-CR')}</td>
                                    <td className="px-6 py-5 text-sm font-black text-white">
                                        {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(item.total)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant={item.estado.toLowerCase().includes('anulada') ? 'danger' : 'success'}>
                                            {item.estado}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {item.retrabajo ? (
                                            <div className="flex justify-center">
                                                <div className="bg-rose-500/10 text-rose-500 p-2 rounded-xl border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                                    <AlertCircle className="w-4 h-4" />
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-800">—</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-slate-600 font-bold uppercase tracking-widest">
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
