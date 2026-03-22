"use client";

import React, { useState, useEffect } from 'react';
import { Expense, Project } from '@/types/erp.types';
import { getExpenses, deleteExpense, getProjects } from '@/lib/supabase-erp';
import { ExpenseModal } from './expense-modal';
import { Plus, Download, Loader2, Trash2, Receipt, Search } from 'lucide-react';
import Papa from 'papaparse';

export function ExpensesTable() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [projects, setProjects] = useState<Record<string, Project>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchData = async () => {
        setLoading(true);
        const [expData, projData] = await Promise.all([
            getExpenses(),
            getProjects()
        ]);
        
        setExpenses(expData);
        
        const projMap: Record<string, Project> = {};
        projData.forEach(p => projMap[p.id] = p);
        setProjects(projMap);
        
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;
        const success = await deleteExpense(id);
        if (success) {
            setExpenses(expenses.filter(e => e.id !== id));
        }
    };

    const handleExportCSV = () => {
        const exportData = expenses.map(e => ({
            Date: new Date(e.date).toLocaleDateString(),
            Description: e.description,
            Category: e.category,
            Amount: e.amount_chf,
            Project: e.project_id ? projects[e.project_id]?.name || 'Unknown' : 'None',
            PaidBy: e.paid_by,
            HasReceipt: e.has_receipt ? 'Yes' : 'No'
        }));
        
        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `erp_expenses_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate Current Month Total
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = expenses
        .filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, e) => sum + Number(e.amount_chf), 0);
        
    const filteredExpenses = expenses.filter(e => 
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Current Month Total ({new Date().toLocaleString('default', { month: 'long' })})
                        </p>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                            CHF {monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                            onClick={handleExportCSV}
                            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl transition-colors text-sm font-medium border border-slate-200 dark:border-slate-700"
                        >
                            <Download size={16} />
                            <span>Export CSV</span>
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm shadow-purple-500/20 text-sm font-medium"
                        >
                            <Plus size={16} />
                            <span>Add Expense</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-md z-10 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Amount (CHF)</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Paid By</th>
                                <th className="px-6 py-4 text-center">Receipt</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors text-sm text-slate-700 dark:text-slate-300">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 font-medium dark:text-slate-200">
                                        {expense.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {Number(expense.amount_chf).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {expense.project_id ? projects[expense.project_id]?.name || 'Unknown' : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {expense.paid_by}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {expense.has_receipt ? (
                                            <Receipt size={16} className="mx-auto text-green-500" />
                                        ) : (
                                            <span className="text-slate-300 dark:text-slate-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(expense.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredExpenses.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No expenses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <ExpenseModal 
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
