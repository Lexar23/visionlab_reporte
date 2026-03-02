"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center pointer-events-none opacity-50">
                <Sun className="h-4 w-4" />
            </button>
        )
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="group relative w-10 h-10 rounded-xl bg-slate-900/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary/50 dark:hover:border-primary/50"
            aria-label="Toggle theme"
        >
            <div className="relative w-4 h-4 overflow-hidden">
                <Sun className={`absolute h-4 w-4 text-orange-400 transition-all duration-500 ${isDark ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'}`} />
                <Moon className={`absolute h-4 w-4 text-primary transition-all duration-500 ${isDark ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`} />
            </div>
        </button>
    )
}
