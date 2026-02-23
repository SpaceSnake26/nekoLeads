import React from 'react';
import { cn } from '@/lib/utils';
import { LeadStatus } from '@/types/crm';

const statusStyles: Record<LeadStatus, string> = {
    NEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    CONTACTED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    REPLIED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    QUALIFIED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    WON: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    LOST: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export function StatusBadge({ status }: { status: LeadStatus }) {
    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase",
            statusStyles[status] || 'bg-slate-100 text-slate-700'
        )}>
            {status}
        </span>
    );
}
