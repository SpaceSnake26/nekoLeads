"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Mail,
    FileText,
    ChevronLeft,
    ChevronRight,
    Database,
    CheckCircle2,
    Settings,
    Briefcase,
    Receipt,
    Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModuleSwitcher } from '@/components/layout/module-switcher';

const leadsSidebarItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads CRM', href: '/leads', icon: Users },
    { name: 'Mailing', href: '/mailing', icon: Mail },
    { name: 'Surveys', href: '/surveys', icon: FileText },
    { name: 'Audits', href: '/audits', icon: CheckCircle2 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

const erpSidebarItems = [
    { name: 'Projects Board', href: '/erp/projects', icon: Briefcase },
    { name: 'Expenses Tracker', href: '/erp/expenses', icon: Wallet },
    { name: 'Invoices', href: '/erp/invoices', icon: Receipt },
    { name: 'Settings', href: '/erp/settings', icon: Settings },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const isERP = pathname.startsWith('/erp');
    const sidebarItems = isERP ? erpSidebarItems : leadsSidebarItems;

    return (
        <aside
            className={cn(
                "flex flex-col h-screen transition-all duration-300 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 z-20",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 mb-4">
                <ModuleSwitcher collapsed={collapsed} />
                
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 z-10",
                        collapsed ? "absolute right-0 translate-x-1/2 top-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm" : ""
                    )}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    // Strict match for Dashboard / to avoid it lighting up for /leads etc.
                    const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center p-3 rounded-xl transition-colors group",
                                isActive
                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon size={22} className={cn(
                                "min-w-[22px]",
                                isActive ? "text-purple-600 dark:text-purple-400" : "group-hover:text-blue-500"
                            )} />
                            {!collapsed && <span className="ml-4 truncate">{item.name}</span>}
                            {isActive && !collapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className={cn(
                    "flex items-center text-slate-400 text-xs uppercase tracking-wider",
                    collapsed ? "justify-center" : "px-2 mb-2"
                )}>
                    {!collapsed ? "Connected to" : ""}
                </div>
                {!collapsed ? (
                    <div className="flex items-center px-2 text-slate-500 dark:text-slate-300">
                        <Database size={16} className="text-green-500 mr-2" />
                        <span className="text-sm font-medium">Supabase Cloud</span>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Database size={16} className="text-green-500" />
                    </div>
                )}
            </div>
        </aside>
    );
}
