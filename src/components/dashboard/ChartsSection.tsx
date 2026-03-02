"use client";

import { Card } from "@/components/ui";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { motion } from "framer-motion";

interface ChartsProps {
    salesByBranch: { sucursal: string; total: number }[];
    salesByMonth: { mes: string; current: number; previous: number; growth: number; meta: number }[];
    statusDistribution: { name: string; value: number }[];
    topOptometrasTotal: { name: string; total: number }[];
    topOptometrasQty: { name: string; qty: number }[];
    designDistribution: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'];

export function ChartsSection({
    salesByBranch,
    salesByMonth,
    topOptometrasTotal,
    topOptometrasQty,
    designDistribution
}: ChartsProps) {
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

    return (
        <div className="grid grid-cols-12 gap-6 mt-8">

            {/* SECTION 1: Monto de los meses (Comparison Table) */}
            <div className="col-span-12 h-[520px]">
                {/* ... existing table code ... */}
                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/5 h-full flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 grid grid-cols-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
                        <span className="text-left">Mes Fiscal</span>
                        <span>Ventas 2024</span>
                        <span>Ventas 2025</span>
                        <span>Crecimiento</span>
                        <span>Meta ¢</span>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {salesByMonth.map((row, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="grid grid-cols-5 text-center p-4 text-xs group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02]"
                            >
                                <span className="text-left font-black text-slate-400 group-hover:text-primary transition-colors">{row.mes}</span>
                                <span className="font-medium text-slate-500 italic">¢{row.previous.toLocaleString()}</span>
                                <span className="font-black text-white bg-white/5 rounded-lg py-1 px-2 border border-white/5">¢{row.current.toLocaleString()}</span>
                                <span className={`font-black flex items-center justify-center gap-1 ${row.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {row.growth >= 0 ? '↑' : '↓'} {Math.abs(row.growth).toFixed(1)}%
                                </span>
                                <span className="text-slate-600 font-medium">¢{row.meta.toLocaleString()}</span>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* SECTION 2: 3-Column Pie Charts Row */}
            <div className="col-span-12 lg:col-span-4 h-[500px]">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/5 h-full flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-white text-sm font-black uppercase tracking-widest italic text-center">Lentes por diseño</h3>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sortedDesigns}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={75}
                                        paddingAngle={5}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        stroke="none"
                                        label={false}
                                    >
                                        {sortedDesigns.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                        itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full px-4 mt-6">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                {sortedDesigns.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[9px] font-black text-white/50 uppercase truncate leading-none">{item.name}</span>
                                            <span className="text-[11px] font-black text-white truncate mt-1">{item.value} UNDS</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-span-12 lg:col-span-4 h-[500px]">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/5 h-full flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-white text-sm font-black uppercase tracking-widest italic text-center">Porcentaje de Vendedores</h3>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sortedOptos}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={75}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="total"
                                        stroke="none"
                                        label={false}
                                    >
                                        {sortedOptos.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full px-4 mt-6">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                {sortedOptos.map((item, index) => {
                                    const percent = ((item.total / totalOptos) * 100).toFixed(0);
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[9px] font-black text-white/50 uppercase truncate leading-none">{item.name}</span>
                                                <span className="text-[11px] font-black text-emerald-400 leading-none mt-1">{percent}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-span-12 lg:col-span-4 h-[500px]">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/5 h-full flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-white text-sm font-black uppercase tracking-widest italic text-center">Ventas por Sucursal</h3>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sortedBranches}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={75}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="total"
                                        stroke="none"
                                        label={false}
                                    >
                                        {sortedBranches.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full px-4 mt-6">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                {sortedBranches.map((item, index) => {
                                    const percent = ((item.total / totalBranches) * 100).toFixed(0);
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[9px] font-black text-white/50 uppercase truncate leading-none">{shortenName(item.sucursal)}</span>
                                                <span className="text-[11px] font-black text-blue-400 leading-none mt-1">{percent}%</span>
                                            </div>
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
                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-full">
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
                                style={{ fill: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                            />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                            <Bar
                                dataKey="qty"
                                fill="#3b82f6"
                                radius={[0, 20, 20, 0]}
                                barSize={12}
                                background={{ fill: 'rgba(255,255,255,0.03)', radius: 20 }}
                                label={{ position: 'right', fill: '#fff', fontSize: 12, fontWeight: '900', offset: 15 }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* FOOTER STATS: Big Impact Numbers */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 py-10 px-12 bg-gradient-to-br from-slate-900/80 to-slate-950 border border-white/5 rounded-[3rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.1)] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-12">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Monto Bruto Anualizado</p>
                    <p className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic drop-shadow-2xl">
                        ¢ {salesByMonth.reduce((acc, curr) => acc + curr.current, 0).toLocaleString()}
                    </p>
                </div>

                <div className="text-center md:text-right pt-8 md:pt-0 md:pl-12 flex flex-col justify-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Piezas Consignadas</p>
                    <div className="flex items-baseline justify-center md:justify-end gap-3">
                        <span className="text-3xl lg:text-4xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            {topOptometrasQty.reduce((acc, curr) => acc + curr.qty, 0)}
                        </span>
                        <span className="text-emerald-500/50 font-black text-xl italic uppercase">UNID</span>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
