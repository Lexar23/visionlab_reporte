"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Hammer, FileBarChart2 } from "lucide-react";
import { cn } from "@/components/ui";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Facturas", href: "/facturas", icon: FileText },
    { name: "Retrabajos", href: "/retrabajos", icon: Hammer },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-primary p-1.5 rounded-xl group-hover:scale-110 transition-transform shadow-xl shadow-primary/30 ring-2 ring-primary/20">
                        <FileBarChart2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-white">
                        REPORTE<span className="text-primary italic">IA</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all",
                                    isActive
                                        ? "text-white bg-slate-800 border border-white/10 shadow-lg"
                                        : "text-slate-500 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", isActive ? "text-primary shadow-sm shadow-primary/50" : "text-slate-600")} />
                                <span className="hidden md:inline">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
