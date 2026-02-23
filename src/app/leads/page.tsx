"use client";

import React, { useState, useEffect } from 'react';
import { Lead } from '@/types/crm';
import { LeadsTable } from '@/components/crm/leads-table';
import { LeadFilters } from '@/components/crm/lead-filters';
import { LeadDetail } from '@/components/crm/lead-detail';
import {
    Users,
    UserPlus,
    Download,
    LayoutGrid,
    List,
    ArrowUpRight
} from 'lucide-react';
import Papa from 'papaparse';

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        query: '',
        status: 'all',
        hasWebshop: 'all',
        minScore: '0'
    });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.hasWebshop !== 'all') params.append('hasWebshop', filters.hasWebshop);
            if (filters.minScore !== '0') params.append('minScore', filters.minScore);
            if (filters.query) params.append('city', filters.query);

            const res = await fetch(`/api/leads?${params.toString()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setLeads(data);
            }
        } catch (err) {
            console.error('Fetch CRM error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const csvData = leads.map(l => ({
            Pharmacy: l.pharmacy_name,
            Status: l.status,
            Email: l.email || 'N/A',
            Phone: l.phone || 'N/A',
            Website: l.website_url,
            City: l.city,
            Score: l.overall_score,
            Webshop: l.has_webshop ? 'Yes' : 'No',
            AI_Chatbot: l.has_ai_chatbot ? 'Yes' : 'No'
        }));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `crm_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                        Leads CRM
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Manage your pharmacy prospects and track digital conversion status.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95">
                        <UserPlus size={18} />
                        Add Lead
                    </button>
                </div>
            </div>

            <LeadFilters
                filters={filters}
                setFilters={setFilters}
                onSearch={fetchLeads}
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-bold text-slate-500">
                        <Users size={16} />
                        <span>{leads.length} Total Prospect{leads.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                <LeadsTable
                    leads={leads}
                    loading={loading}
                    onViewLead={(lead) => setSelectedLead(lead)}
                />
            </div>

            {selectedLead && (
                <LeadDetail
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                    onUpdate={(updated) => {
                        setLeads(leads.map(l => l.id === updated.id ? updated : l));
                        setSelectedLead(null);
                    }}
                />
            )}
        </div>
    );
}
