"use client";

import React, { useState, useEffect } from 'react';
import { Lead } from '@/types/crm';
import { EMAIL_TEMPLATES, interpolateTemplate } from '@/lib/email-templates';
import {
    Mail,
    Users,
    CheckSquare,
    Square,
    Copy,
    Download,
    ExternalLink,
    ChevronRight,
    Eye,
    Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/crm/status-badge';
import Papa from 'papaparse';

export default function MailingPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [activeTemplate, setActiveTemplate] = useState(EMAIL_TEMPLATES[0]);
    const [previewLead, setPreviewLead] = useState<Lead | null>(null);
    const [copyBodySuccess, setCopyBodySuccess] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads?status=NEW'); // Default to target new leads
            const data = await res.json();
            if (Array.isArray(data)) {
                setLeads(data);
                if (data.length > 0) setPreviewLead(data[0]);
            }
        } catch (err) {
            console.error('Fetch mailing leads error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === leads.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(leads.map(l => l.id)));
    };

    const getInterpolated = (lead: Lead) => {
        const surveyUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/surveys/default?lead_id=${lead.id}`
            : '';

        const data = {
            pharmacy_name: lead.pharmacy_name,
            city: lead.city,
            contact_name: lead.contact_name || 'Sehr geehrtes Apotheken-Team',
            survey_link: surveyUrl,
            website_url: lead.website_url
        };

        return {
            subject: interpolateTemplate(activeTemplate.subject, data),
            body: interpolateTemplate(activeTemplate.body, data)
        };
    };

    const handleExport = () => {
        const selectedLeads = leads.filter(l => selectedIds.has(l.id));
        const csvData = selectedLeads.map(l => {
            const email = getInterpolated(l);
            return {
                'Pharmacy Name': l.pharmacy_name,
                'Contact Name': l.contact_name || '',
                'Email': l.email || '',
                'Subject': email.subject,
                'Body': email.body,
                'Survey Link': `${window.location.origin}/surveys/default?lead_id=${l.id}`
            };
        });
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `outreach_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                        Outreach Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Generate personalized audits and cold emails for your pharmacy leads.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        disabled={selectedIds.size === 0}
                        onClick={handleExport}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                    >
                        <Download size={18} />
                        Export Selected ({selectedIds.size})
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left: Lead Selection */}
                <div className="xl:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={toggleSelectAll} className="text-purple-600 focus:outline-none">
                                    {selectedIds.size === leads.length && leads.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                                </button>
                                <span className="text-sm font-bold dark:text-slate-200">Select Leads for Outreach</span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{leads.length} Target Prospects</span>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <div className="p-20 text-center"><RefreshCw className="animate-spin mx-auto text-purple-500" /></div>
                            ) : leads.length === 0 ? (
                                <div className="p-20 text-center text-slate-400 font-medium">No leads currently in 'NEW' status. Use the Scanner to add more.</div>
                            ) : leads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className={cn(
                                        "p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all cursor-pointer",
                                        previewLead?.id === lead.id ? "bg-purple-50/50 dark:bg-purple-900/10" : ""
                                    )}
                                    onClick={() => setPreviewLead(lead)}
                                >
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleSelect(lead.id); }}
                                            className={cn(
                                                "transition-colors",
                                                selectedIds.has(lead.id) ? "text-purple-600" : "text-slate-300 group-hover:text-slate-400"
                                            )}
                                        >
                                            {selectedIds.has(lead.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                        </button>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{lead.pharmacy_name}</span>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase">{lead.city}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{lead.overall_score}/10</span>
                                        </div>
                                        <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-purple-500">
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Template & Preview */}
                <div className="xl:col-span-5 space-y-6 sticky top-24">
                    {/* Template Selector */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Type size={14} /> Outreach Template
                        </h3>
                        <div className="space-y-2">
                            {EMAIL_TEMPLATES.map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => setActiveTemplate(tpl)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group",
                                        activeTemplate.id === tpl.id
                                            ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20"
                                            : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-300 hover:border-slate-200"
                                    )}
                                >
                                    <span className="text-sm font-bold">{tpl.name}</span>
                                    <ChevronRight size={18} className={cn("transition-transform", activeTemplate.id === tpl.id ? "rotate-90" : "group-hover:translate-x-1")} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    {previewLead && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[500px]">
                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Personalized Preview</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded">
                                        {previewLead.pharmacy_name.split(' ')[0]}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Subject</p>
                                    <p className="text-sm font-bold dark:text-slate-100">{getInterpolated(previewLead).subject}</p>
                                </div>
                                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Message Body</p>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed font-medium">
                                        {getInterpolated(previewLead).body}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex gap-3">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(getInterpolated(previewLead).body);
                                        setCopyBodySuccess(true);
                                        setTimeout(() => setCopyBodySuccess(false), 2000);
                                    }}
                                    className={cn(
                                        "flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95",
                                        copyBodySuccess
                                            ? "bg-slate-800 dark:bg-slate-950 text-emerald-400"
                                            : "bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white"
                                    )}
                                >
                                    {copyBodySuccess ? (
                                        <>
                                            <CheckSquare size={14} /> Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} /> Copy Body
                                        </>
                                    )}
                                </button>
                                <Link
                                    href={`mailto:${previewLead.email || ''}?subject=${encodeURIComponent(getInterpolated(previewLead).subject)}&body=${encodeURIComponent(getInterpolated(previewLead).body)}`}
                                    className="flex-1 bg-purple-600 text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                                >
                                    <Mail size={14} /> Open Client
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
