import { Card } from "@/components/ui";
import { TrendingUp, FileText, CheckCircle, AlertTriangle } from "lucide-react";

interface StatsProps {
    totalVentas: number;
    totalFacturas: number;
    retrabajos: number;
    sucursalMasActiva: string;
}

export function StatsCards({ totalVentas, totalFacturas, retrabajos, sucursalMasActiva }: StatsProps) {
    const stats = [
        {
            label: "Ventas Totales",
            value: new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(totalVentas),
            icon: TrendingUp,
            color: "text-blue-400",
            bg: "bg-blue-400/5",
            border: "border-blue-400/20"
        },
        {
            label: "Facturas Emitidas",
            value: totalFacturas,
            icon: FileText,
            color: "text-purple-400",
            bg: "bg-purple-400/5",
            border: "border-purple-400/20"
        },
        {
            label: "Retrabajos",
            value: retrabajos,
            icon: AlertTriangle,
            color: "text-rose-400",
            bg: "bg-rose-400/5",
            border: "border-rose-400/20"
        },
        {
            label: "Sucursal Líder",
            value: sucursalMasActiva,
            icon: CheckCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-400/5",
            border: "border-emerald-400/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
                <Card key={i} className={`bg-slate-900/60 backdrop-blur border ${stat.border} p-3 rounded-2xl transition-all hover:scale-[1.02] hover:bg-slate-800/50`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5 truncate">{stat.label}</p>
                            <h3 className="text-base font-black text-white truncate">{stat.value}</h3>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
