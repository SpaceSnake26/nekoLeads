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
    Mail,
    Users,
    FileText
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
                        <tr className="bg-slate-50 dark:bg-slate-800/10 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-4 py-4 whitespace-nowrap">Pharmacy Name</th>
                            <th className="px-4 py-4 whitespace-nowrap">Location</th>
                            <th className="px-4 py-4 whitespace-nowrap">Source</th>
                            <th className="px-4 py-4 whitespace-nowrap">Scan Date</th>
                            <th className="px-4 py-4 whitespace-nowrap">Status</th>
                            <th className="px-4 py-4 whitespace-nowrap">e-mail</th>
                            <th className="px-4 py-4 whitespace-nowrap">phone</th>
                            <th className="px-4 py-4 whitespace-nowrap">Has Site?</th>
                            <th className="px-4 py-4 whitespace-nowrap">Has Shop?</th>
                            <th className="px-4 py-4 whitespace-nowrap">Score</th>
                            <th className="px-4 py-4 whitespace-nowrap">Notes</th>
                            <th className="px-4 py-4 text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {leads.map((lead) => (
                            <tr
                                key={lead.id}
                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all cursor-pointer group"
                                onClick={() => onViewLead(lead)}
                            >
                                <td className="px-4 py-4 font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 max-w-[200px] truncate" title={lead.pharmacy_name}>
                                    {lead.pharmacy_name}
                                </td>

                                <td className="px-4 py-4 text-slate-500 dark:text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                                    <MapPin size={14} className="text-slate-400 shrink-0" />
                                    <span className="truncate max-w-[120px]" title={lead.city}>{lead.city || 'N/A'}</span>
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className={cn(
                                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                        lead.source === 'local.ch'
                                            ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                            : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                    )}>
                                        {lead.source === 'local.ch' ? 'local.ch' : 'GMaps'}
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs font-medium">
                                    {lead.last_scanned ? new Date(lead.last_scanned).toLocaleDateString() : (
                                        <span className="italic">N/A</span>
                                    )}
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap">
                                    <StatusBadge status={lead.status} />
                                </td>

                                <td className="px-4 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                    {lead.email ? (
                                        <span className="flex items-center gap-1.5">
                                            <Mail size={14} className="text-slate-400" />
                                            <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} className="hover:underline hover:text-purple-500 truncate max-w-[150px]" title={lead.email}>
                                                {lead.email}
                                            </a>
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 italic text-xs">No email</span>
                                    )}
                                </td>

                                <td className="px-4 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono text-xs">
                                    {lead.phone ? (
                                        <span className="flex items-center gap-1.5">
                                            <Phone size={14} className="text-slate-400" />
                                            {lead.phone}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 italic text-xs font-sans">No phone</span>
                                    )}
                                </td>

                                <td className="px-4 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium text-xs">
                                    {lead.website_url ? (
                                        <a href={lead.website_url} target="_blank" onClick={e => e.stopPropagation()} className="text-blue-500 hover:underline flex items-center gap-1">
                                            Yes <Globe size={12} />
                                        </a>
                                    ) : (
                                        <span className="text-slate-400 italic">No</span>
                                    )}
                                </td>

                                <td className="px-4 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium text-xs">
                                    {lead.has_webshop ? (
                                        <span className="text-emerald-500">Yes</span>
                                    ) : (
                                        <span className="text-slate-400 italic">No</span>
                                    )}
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm",
                                        (lead.overall_score || 0) >= 8 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                                            (lead.overall_score || 0) >= 5 ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" :
                                                "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                    )}>
                                        {lead.overall_score || '0'}
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-xs max-w-[150px]">
                                    {lead.notes ? (
                                        <div className="flex items-start gap-1.5 truncate" title={lead.notes}>
                                            <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                            <span className="truncate">{lead.notes}</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">No notes</span>
                                    )}
                                </td>

                                <td className="px-4 py-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors" title="Edit Lead">
                                            <MoreHorizontal size={18} />
                                        </button>
                                        <a
                                            href={lead.website_url || '#'}
                                            target={lead.website_url ? "_blank" : "_self"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!lead.website_url) e.preventDefault();
                                            }}
                                            className={cn(
                                                "p-2 rounded-lg transition-colors",
                                                lead.website_url
                                                    ? "hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600"
                                                    : "opacity-50 cursor-not-allowed text-slate-400"
                                            )}
                                            title={lead.website_url ? "Open Website" : "No Website Given"}
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
