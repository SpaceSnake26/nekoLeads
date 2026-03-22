"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Bell, Search, User } from 'lucide-react';

export function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center space-x-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Universal search..."
                        className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 rounded-xl text-sm transition-all w-64"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                    aria-label="Toggle Dark Mode"
                >
                    {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
                </button>

                <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all border border-transparent">
                    <Bell size={20} />
                </button>

                <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-700 mx-2" />

                <button className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                        JD
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-xs font-semibold dark:text-slate-200">John Doe</p>
                        <p className="text-[10px] text-slate-500">Administrator</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
