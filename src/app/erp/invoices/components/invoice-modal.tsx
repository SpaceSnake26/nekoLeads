"use client";

import React, { useState } from 'react';
import { InvoiceStatus, Project } from '@/types/erp.types';
import { createInvoice } from '@/lib/supabase-erp';
import { X } from 'lucide-react';

interface InvoiceModalProps {
    projects: Project[];
    onClose: () => void;
    onSave: () => Promise<void>;
}

export function InvoiceModal({ projects, onClose, onSave }: InvoiceModalProps) {
    const [formData, setFormData] = useState({
        invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        client: '',
        project_id: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: '',
        amount_chf: 0,
        status: 'Draft' as InvoiceStatus,
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToSubmit = {
                ...formData,
                project_id: formData.project_id || null,
                due_date: formData.due_date || null
            };
            const result = await createInvoice(dataToSubmit);
            if (result) {
                await onSave();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative bg-white dark:bg-slate-950 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 my-8">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-t-2xl z-10">
                    <h2 className="text-xl font-bold dark:text-slate-100">
                        Create Invoice
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Invoice Number *</label>
                            <input
                                required
                                name="invoice_number"
                                value={formData.invoice_number}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-sm dark:text-slate-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Amount (CHF) *</label>
                            <input
                                required
                                type="number"
                                name="amount_chf"
                                step="0.01"
                                min="0"
                                value={formData.amount_chf || ''}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Client / Company Name *</label>
                        <input
                            required
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Linked Project (Optional)</label>
                        <select
                            name="project_id"
                            value={formData.project_id}
                            onChange={handleChange}
                            className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                        >
                            <option value="">-- None --</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Issue Date *</label>
                            <input
                                required
                                type="date"
                                name="issue_date"
                                value={formData.issue_date}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Due Date</label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Notes (Optional)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100 resize-y"
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/60 sticky bottom-0 bg-white dark:bg-slate-950 pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium shadow-sm shadow-purple-500/20 transition-colors flex items-center justify-center min-w-[100px]"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Save Invoice"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
