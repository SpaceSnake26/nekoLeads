'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Filter,
  MapPin,
  Phone,
  Globe,
  ShoppingCart,
  User,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Papa from 'papaparse';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Lead {
  id: string;
  name: string;
  website_url: string;
  phone: string;
  owner: string;
  overall_score: number;
  has_webshop: boolean;
  city: string;
  address: string;
  last_scanned: string;
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [city, setCity] = useState('');
  const [filters, setFilters] = useState({
    minScore: 0,
    hasWebshop: 'all' as 'all' | 'yes' | 'no'
  });

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.minScore > 0) params.append('minScore', filters.minScore.toString());
      if (filters.hasWebshop !== 'all') params.append('hasWebshop', filters.hasWebshop === 'yes' ? 'true' : 'false');

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeads(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;
    setScanning(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city })
      });
      await fetchLeads();
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setScanning(false);
    }
  };

  const exportCSV = () => {
    const csvData = leads.map(l => ({
      Name: l.name,
      Owner: l.owner || 'Unknown',
      Phone: l.phone || 'N/A',
      Website: l.website_url || 'N/A',
      'Score (1-10)': l.overall_score,
      'Has Webshop': l.has_webshop ? 'Yes' : 'No',
      City: l.city,
      Address: l.address,
      'Last Scanned': new Date(l.last_scanned).toLocaleDateString()
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `pharmacy_leads_${city || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads; // Server side filtering is implemented, but we could add local search too

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              nekoLeads <span className="text-slate-400 font-medium">| Pharmacy CH</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleScan} className="relative flex items-center gap-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Swiss City (e.g. Zurich)"
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 w-64 transition-all"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={scanning}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Scan
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Pharmacy Leads" value={leads.length} icon={<Search className="w-5 h-5" />} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Average Score" value={(leads.reduce((acc, l) => acc + l.overall_score, 0) / leads.length || 0).toFixed(1)} icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard title="Webshops Detected" value={leads.filter(l => l.has_webshop).length} icon={<ShoppingCart className="w-5 h-5" />} color="text-amber-600" bg="bg-amber-50" />
          <StatCard title="Critical Leads (< 4)" value={leads.filter(l => l.overall_score < 4).length} icon={<AlertCircle className="w-5 h-5" />} color="text-rose-600" bg="bg-rose-50" />
        </div>

        {/* Filters & Actions */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-500">Min Score:</span>
              <select
                className="text-sm bg-slate-50 border-none rounded-md py-1 px-2 focus:ring-emerald-500"
                value={filters.minScore}
                onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-500">Webshop:</span>
              <select
                className="text-sm bg-slate-50 border-none rounded-md py-1 px-2 focus:ring-emerald-500"
                value={filters.hasWebshop}
                onChange={(e) => setFilters(prev => ({ ...prev, hasWebshop: e.target.value as any }))}
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pharmacy</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Webshop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No leads found. Enter a city and click Scan.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-emerald-700">{lead.name}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <MapPin className="w-3 h-3" />
                          {lead.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="w-4 h-4 text-slate-300" />
                        {lead.owner || <span className="text-slate-300 italic">Not detected</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.website_url && (
                          <a href={lead.website_url} target="_blank" className="flex items-center gap-2 text-sm text-emerald-600 hover:underline">
                            <Globe className="w-3 h-3" />
                            Website
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                          lead.overall_score >= 8 ? "bg-emerald-100 text-emerald-700" :
                            lead.overall_score >= 6 ? "bg-blue-100 text-blue-700" :
                              lead.overall_score >= 4 ? "bg-amber-100 text-amber-700" :
                                "bg-rose-100 text-rose-700"
                        )}>
                          {lead.overall_score}
                        </div>
                        <div className="hidden sm:block">
                          <div className="text-xs font-medium text-slate-500">
                            {lead.overall_score >= 8 ? 'Excellent' : lead.overall_score >= 6 ? 'Decent' : lead.overall_score >= 4 ? 'Needs Help' : 'Critical'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {lead.has_webshop ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: { title: string, value: string | number, icon: React.ReactNode, color: string, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", bg, color)}>
          {icon}
        </div>
        <Clock className="w-4 h-4 text-slate-300" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
