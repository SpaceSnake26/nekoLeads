"use client";

import React, { useState } from 'react';
import { Lead, LeadStatus } from '@/types/crm';
import { StatusBadge } from './status-badge';
import {
    X,
    MapPin,
    Globe,
    Phone,
    Mail,
    Calendar,
    Save,
    Trash2,
    ExternalLink,
    MessageSquare,
    Tag as TagIcon,
    CheckCircle2,
    AlertCircle,
    Copy,
    Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadDetailProps {
    lead: Lead;
    onClose: () => void;
    onUpdate: (updatedLead: Lead) => void;
}

export function LeadDetail({ lead, onClose, onUpdate }: LeadDetailProps) {
    const [status, setStatus] = useState<LeadStatus>(lead.status);
    const [notes, setNotes] = useState(lead.notes || '');
    const [isSaving, setIsSaving] = useState(false);
    const [copySurveySuccess, setCopySurveySuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/leads/${lead.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, notes })
            });
            if (res.ok) {
                const updated = await res.json();
                onUpdate(updated);
            }
        } catch (err) {
            console.error('Update lead error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const surveyUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/surveys/default?lead_id=${lead.id}`
        : '';

    const handleCopySurvey = () => {
        navigator.clipboard.writeText(surveyUrl);
        setCopySurveySuccess(true);
        setTimeout(() => setCopySurveySuccess(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold dark:text-slate-100">{lead.pharmacy_name}</h2>
                            <div className="flex items-center text-xs text-slate-500 font-medium font-mono">
                                <MapPin size={12} className="mr-1" />
                                {lead.city}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Status & Quick Actions */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lead Lifecycle</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-500 mb-2 font-bold uppercase">Current Status</p>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                >
                                    <option value="NEW">New</option>
                                    <option value="CONTACTED">Contacted</option>
                                    <option value="REPLIED">Replied</option>
                                    <option value="QUALIFIED">Qualified</option>
                                    <option value="WON">Won</option>
                                    <option value="LOST">Lost</option>
                                </select>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-500 mb-2 font-bold uppercase">Quality Score</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{lead.overall_score || 0}</span>
                                    <span className="text-xs text-slate-400 font-bold">/ 10</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Survey Outreach */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Outreach Tools</h3>
                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-[10px] font-black text-indigo-600 rounded">NEW</span>
                        </div>
                        <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <Layout size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold dark:text-slate-200">Personalized Audit Survey</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Link this prospect directly to their maturity check.</p>
                                </div>
                                <button
                                    onClick={handleCopySurvey}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        copySurveySuccess ? "bg-emerald-500 text-white" : "bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-100"
                                    )}
                                >
                                    {copySurveySuccess ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 break-all select-all">
                                {surveyUrl}
                            </div>
                        </div>
                    </section>

                    {/* Contact Details */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Contact Information</h3>
                        <div className="space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                            <ContactRow icon={<Globe size={16} />} label="Website" value={lead.website_url} isLink />
                            <ContactRow icon={<Mail size={16} />} label="Email" value={lead.email || 'Not available'} />
                            <ContactRow icon={<Phone size={16} />} label="Phone" value={lead.phone || 'Not available'} />
                            <ContactRow icon={<Calendar size={16} />} label="Created" value={new Date(lead.created_at).toLocaleDateString()} />
                        </div>
                    </section>

                    {/* Audit Summary */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Digital Audit</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <AuditPill label="Webshop" detected={lead.has_webshop} />
                            <AuditPill label="AI Chatbot" detected={lead.has_ai_chatbot} />
                            <AuditPill label="AI Products" detected={lead.has_ai_products} />
                            <AuditPill label="SEO Score" value={lead.category_scores?.seo} />
                        </div>
                    </section>

                    {/* Notes */}
                    <section className="space-y-4 pb-20">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">CRM Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add internal notes..."
                            className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none resize-none"
                        />
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors">
                        <Trash2 size={18} />
                        Archive
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactRow({ icon, label, value, isLink }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center text-sm font-medium text-slate-500">
                <span className="mr-3 text-slate-400">{icon}</span>
                {label}
            </div>
            {isLink ? (
                <a href={value} target="_blank" className="text-sm font-bold text-purple-600 hover:underline flex items-center gap-1">
                    Open <ExternalLink size={12} />
                </a>
            ) : (
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{value}</span>
            )}
        </div>
    );
}

function AuditPill({ label, detected, value }: any) {
    const isDetected = detected === true;
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
            {value !== undefined ? (
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{value}/100</span>
            ) : isDetected ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
                <AlertCircle size={16} className="text-rose-400" />
            )}
        </div>
    );
}

import { RefreshCw, Users } from 'lucide-react';
