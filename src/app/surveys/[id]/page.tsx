"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    CheckCircle2,
    Send,
    ShieldCheck,
    Info,
    ChevronRight,
    ChevronLeft,
    Building2,
    Mail,
    Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicSurveyPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const leadId = searchParams.get('lead_id');

    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        pharmacy_name: '',
        city: '',
        contact_name: '',
        email: '',
        phone: '',
        has_website: true,
        website_satisfaction: 3,
        webshop_status: 'No',
        it_management: 'not sure',
        ai_usage: 'None',
        top_priority: 'Website refresh',
        consent_accepted: false,
    });

    const totalSteps = 6;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/surveys/responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    survey_id: params.id,
                    lead_id: leadId,
                    ...formData
                })
            });
            if (res.ok) setIsSubmitted(true);
        } catch (err) {
            console.error('Survey error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-2xl font-bold dark:text-slate-100">Vielen Dank!</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Your response has been recorded. Our Swiss team will analyze your digital situation and get in touch with you shortly.
                    </p>
                    <div className="pt-4">
                        <button
                            onClick={() => window.location.href = 'https://google.ch'}
                            className="px-8 py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-2xl font-bold transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck size={12} /> Swiss Digital Audit
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Pharmacy Digital Maturity Check</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Help us understand your IT landscape in 2 minutes.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 flex">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>

                    <div className="p-8 md:p-12 min-h-[400px] flex flex-col">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-bold dark:text-slate-100">Basic Information</h2>
                                <div className="space-y-4">
                                    <InputGroup label="Pharmacy Name" icon={<Building2 size={18} />}>
                                        <input
                                            type="text"
                                            placeholder="e.g. Apotheke Zurich"
                                            className="survey-input"
                                            value={formData.pharmacy_name}
                                            onChange={(e) => setFormData({ ...formData, pharmacy_name: e.target.value })}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Contat Email" icon={<Mail size={18} />}>
                                        <input
                                            type="email"
                                            placeholder="your@email.ch"
                                            className="survey-input"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </InputGroup>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-bold dark:text-slate-100">Digital Presence</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 mb-3">Do you currently have a website?</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <SelectButton active={formData.has_website === true} onClick={() => setFormData({ ...formData, has_website: true })}>Yes</SelectButton>
                                            <SelectButton active={formData.has_website === false} onClick={() => setFormData({ ...formData, has_website: false })}>No</SelectButton>
                                        </div>
                                    </div>
                                    {formData.has_website && (
                                        <div className="animate-in fade-in zoom-in-95">
                                            <label className="block text-sm font-bold text-slate-500 mb-3 text-center">Are you happy with it? (1-5)</label>
                                            <div className="flex justify-between items-center px-4">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <button
                                                        key={n}
                                                        onClick={() => setFormData({ ...formData, website_satisfaction: n })}
                                                        className={cn(
                                                            "w-12 h-12 rounded-full font-bold transition-all border-2",
                                                            formData.website_satisfaction === n
                                                                ? "bg-purple-600 border-purple-600 text-white scale-110 shadow-lg shadow-purple-500/30"
                                                                : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-purple-300"
                                                        )}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-bold dark:text-slate-100">Online Ordering</h2>
                                <label className="block text-sm font-bold text-slate-500 mb-3">Do you have an online shop / online ordering?</label>
                                <div className="space-y-3">
                                    {['Yes', 'No', 'Planned'].map(opt => (
                                        <SelectButton key={opt} active={formData.webshop_status === opt} onClick={() => setFormData({ ...formData, webshop_status: opt })}>{opt}</SelectButton>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-bold dark:text-slate-100">IT Management</h2>
                                <label className="block text-sm font-bold text-slate-500 mb-3">Who manages your IT/website?</label>
                                <div className="space-y-3">
                                    {[
                                        { id: 'in-house', label: 'In-house Team' },
                                        { id: 'agency', label: 'External Agency' },
                                        { id: 'freelancer', label: 'Freelancer' },
                                        { id: 'not sure', label: 'Not sure / Unknown' }
                                    ].map(opt => (
                                        <SelectButton key={opt.id} active={formData.it_management === opt.id} onClick={() => setFormData({ ...formData, it_management: opt.id })}>{opt.label}</SelectButton>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-bold dark:text-slate-100">AI Usage</h2>
                                <label className="block text-sm font-bold text-slate-500 mb-3">Do you currently use AI tools or chatbots?</label>
                                <div className="space-y-3">
                                    {[
                                        { id: 'None', label: 'None' },
                                        { id: 'Internal', label: 'Only internal tools' },
                                        { id: 'Chatbot', label: 'Public chatbot on site' },
                                        { id: 'Both', label: 'Both' }
                                    ].map(opt => (
                                        <SelectButton key={opt.id} active={formData.ai_usage === opt.id} onClick={() => setFormData({ ...formData, ai_usage: opt.id })}>{opt.label}</SelectButton>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 6 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-bold dark:text-slate-100">Privacy & Confirmation</h2>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/10 border border-slate-200 dark:border-slate-800 rounded-2xl flex gap-3 text-xs text-slate-500 leading-relaxed">
                                    <ShieldCheck size={28} className="text-purple-500 shrink-0" />
                                    <p>
                                        By submitting this digital audit, you agree to our privacy policy. Your data will be kept secure and used only to provide you with a tailored digital digitalization report for your pharmacy in accordance with Swiss DSG.
                                    </p>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                        checked={formData.consent_accepted}
                                        onChange={(e) => setFormData({ ...formData, consent_accepted: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium dark:text-slate-300 group-hover:text-purple-500 transition-colors">I agree to the privacy note</span>
                                </label>
                            </div>
                        )}

                        <div className="mt-auto pt-10 flex items-center justify-between">
                            <button
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                                className="p-3 text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {step < totalSteps ? (
                                <button
                                    onClick={() => setStep(Math.min(totalSteps, step + 1))}
                                    disabled={step === 1 && !formData.pharmacy_name}
                                    className="bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold py-3 px-8 rounded-2xl flex items-center gap-2 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Next Step <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.consent_accepted || loading}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-2 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                                    Submit Audit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <p className="text-center text-xs text-slate-400 font-medium">
                    &copy; 2026 Swiss Pharmacy Leads. All rights reserved. 🇨🇭
                </p>
            </div>

            <style jsx>{`
        .survey-input {
          width: 100%;
          background: transparent;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          color: inherit;
          outline: none;
          padding: 4px 0;
        }
        .survey-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
        </div>
    );
}

function InputGroup({ label, icon, children }: any) {
    return (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            <div className="flex items-center gap-3 mt-1">
                <span className="text-slate-400">{icon}</span>
                {children}
            </div>
        </div>
    );
}

function SelectButton({ active, onClick, children }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-all font-bold",
                active
                    ? "bg-purple-100 border-purple-600 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
            )}
        >
            {children}
        </button>
    );
}

import { RefreshCw } from 'lucide-react';
