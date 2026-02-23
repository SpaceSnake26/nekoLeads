"use client";

import React, { useState, useEffect } from 'react';
import {
    FileText,
    Settings,
    ExternalLink,
    Download,
    MessageSquare,
    Clock,
    User,
    Share2,
    Copy,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/crm/status-badge';

export default function SurveysAdminPage() {
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        fetchResponses();
    }, []);

    const fetchResponses = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/surveys/responses');
            const data = await res.json();
            if (Array.isArray(data)) setResponses(data);
        } catch (err) {
            console.error('Fetch responses error:', err);
        } finally {
            setLoading(false);
        }
    };

    const surveyUrl = typeof window !== 'undefined' ? `${window.location.origin}/surveys/default` : '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(surveyUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                        Surveys & Responses
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Manage your digital audits and view submissions from pharmacies.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        {copySuccess ? <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={16} /> Copied!</span> : <><Copy size={18} /> Public URL</>}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">
                        <Settings size={18} />
                        Configure Survey
                    </button>
                </div>
            </div>

            {/* Survey Settings Summary Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-500/10">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20">
                        <FileText size={48} className="text-white" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h2 className="text-xl font-bold">Standard Digitization Audit (MVP)</h2>
                        <p className="text-purple-100 text-sm max-w-md">
                            Active Survey: <strong>5 Digital Maturity Questions</strong>.
                            Includes tracking for Webshops, AI usage, and IT management.
                        </p>
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase opacity-60">Total Submissions</span>
                                <span className="text-2xl font-black">{responses.length}</span>
                            </div>
                            <div className="h-8 w-[1px] bg-white/20" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase opacity-60">Avg. Completion Time</span>
                                <span className="text-2xl font-black">1.8m</span>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0">
                        <Link href="/surveys/default" target="_blank" className="bg-white/20 hover:bg-white/30 backdrop-blur-lg px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm">
                            Preview Public Page <ExternalLink size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Response List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Latest Submissions</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/10 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pharmacy</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Respondent</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / IT</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Webshop / AI</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={5} className="py-20 text-center"><RefreshCw className="animate-spin mx-auto text-purple-500" /></td></tr>
                            ) : responses.length === 0 ? (
                                <tr><td colSpan={5} className="py-20 text-center text-slate-400">No responses yet. Send the survey link to your leads!</td></tr>
                            ) : responses.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors uppercase text-xs">
                                                {r.leads?.pharmacy_name || r.pharmacy_name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">{r.leads?.city || 'Manual entry'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500"><User size={14} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{r.contact_name}</span>
                                                <span className="text-[10px] text-slate-400">{r.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400">SATISFACTION:</span>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map(n => <div key={n} className={cn("w-2 h-2 rounded-full mr-0.5", r.website_satisfaction >= n ? "bg-purple-500" : "bg-slate-200 dark:bg-slate-700")} />)}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">MGT: {r.it_management.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-2">
                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase", r.webshop_status === 'Yes' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                                                Webshop: {r.webshop_status}
                                            </span>
                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase", r.ai_usage !== 'None' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500")}>
                                                AI: {r.ai_usage}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono italic whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
