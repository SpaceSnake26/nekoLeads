"use client";

import React, { useState, useEffect } from 'react';
import { Invoice, Project, InvoiceStatus } from '@/types/erp.types';
import { getInvoices, updateInvoiceStatus, getProjects } from '@/lib/supabase-erp';
import { InvoiceModal } from './invoice-modal';
import { Plus, Loader2, CheckCircle2, AlertCircle, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<InvoiceStatus, string> = {
    'Draft': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    'Sent': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50',
    'Paid': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800/50',
    'Overdue': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800/50',
};

export function InvoicesTable() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [projects, setProjects] = useState<Record<string, Project>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const [invData, projData] = await Promise.all([
            getInvoices(),
            getProjects()
        ]);

        setInvoices(invData);

        const projMap: Record<string, Project> = {};
        projData.forEach(p => projMap[p.id] = p);
        setProjects(projMap);

        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchData();
    }, []);

    const handleMarkAsPaid = async (id: string) => {
        const success = await updateInvoiceStatus(id, 'Paid');
        if (success) {
            setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'Paid' } : i));
        }
    };

    // Summaries
    const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.amount_chf), 0);
    const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.amount_chf), 0);
    const totalPending = invoices.filter(i => i.status === 'Sent' || i.status === 'Draft').reduce((sum, i) => sum + Number(i.amount_chf), 0);
    const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + Number(i.amount_chf), 0);

    const filteredInvoices = invoices.filter(i =>
        i.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                        <FileText size={16} /> Total Invoiced
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        CHF {totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" /> Total Paid
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        CHF {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Total Pending
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        CHF {totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500" /> Total Overdue
                    </p>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                        CHF {totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                        />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm shadow-purple-500/20 text-sm font-medium"
                    >
                        <Plus size={16} />
                        <span>Create Invoice</span>
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-md z-10 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Issue Date</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4 text-right">Amount (CHF)</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors text-sm text-slate-700 dark:text-slate-300">
                                    <td className="px-6 py-4 font-mono font-medium dark:text-slate-200 whitespace-nowrap">
                                        {invoice.invoice_number}
                                    </td>
                                    <td className="px-6 py-4 font-medium dark:text-slate-200">
                                        {invoice.client}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {invoice.project_id ? projects[invoice.project_id]?.name || 'Unknown' : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(invoice.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {Number(invoice.amount_chf).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border", STATUS_COLORS[invoice.status])}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {invoice.status !== 'Paid' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(invoice.id)}
                                                className="text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-purple-800/50"
                                            >
                                                Mark as Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <InvoiceModal
                    projects={Object.values(projects)}
                    onClose={() => setIsModalOpen(false)}
                    onSave={async () => {
                        setIsModalOpen(false);
                        await fetchData();
                    }}
                />
            )}
        </div>
    );
}
