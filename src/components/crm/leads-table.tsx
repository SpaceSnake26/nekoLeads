"use client";

import React from 'react';
import { Lead } from '@/types/crm';
import { StatusBadge } from './status-badge';
import {
    MapPin,
    Phone,
    Globe,
    MoreHorizontal,
    ExternalLink,
    MessageSquare,
    Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadsTableProps {
    leads: Lead[];
    loading: boolean;
    onViewLead: (lead: Lead) => void;
}

export function LeadsTable({ leads, loading, onViewLead }: LeadsTableProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Loading CRM data...</p>
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center px-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                    <Users className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No leads found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
                    Try adjusting your filters or run a new scan to populate your CRM.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/10 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pharmacy & Location</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tags</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {leads.map((lead) => (
                            <tr
                                key={lead.id}
                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all cursor-pointer group"
                                onClick={() => onViewLead(lead)}
                            >
                                <td className="px-6 py-5">
                                    <div>
                                        <span className="block font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {lead.pharmacy_name}
                                        </span>
                                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 mt-1.5 font-medium">
                                            <MapPin size={12} className="mr-1 text-slate-400" />
                                            {lead.city}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <StatusBadge status={lead.status} />
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1.5">
                                        {lead.email ? (
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <Mail size={14} className="mr-2 text-slate-400" />
                                                {lead.email}
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-xs italic text-slate-400">
                                                No email
                                            </div>
                                        )}
                                        {lead.phone && (
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <Phone size={14} className="mr-2 text-slate-400" />
                                                {lead.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center space-x-2">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm",
                                            (lead.overall_score || 0) >= 8 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                                                (lead.overall_score || 0) >= 5 ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" :
                                                    "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                        )}>
                                            {lead.overall_score || '0'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                        {lead.tags && lead.tags.length > 0 ? (
                                            lead.tags.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-slate-400">No tags</span>
                                        )}
                                        {lead.tags && lead.tags.length > 2 && (
                                            <span className="text-[10px] text-slate-400 font-medium">+{lead.tags.length - 2} more</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500" title="Edit Lead">
                                            <MoreHorizontal size={18} />
                                        </button>
                                        <a
                                            href={lead.website_url}
                                            target="_blank"
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-purple-600"
                                            title="Open Website"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import { Users, Mail } from 'lucide-react';
