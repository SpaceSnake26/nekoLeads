"use client";

import React from 'react';
import { Search, Filter, ShoppingCart, MessageSquare, MapPin, Tag, ChevronDown } from 'lucide-react';

interface LeadFiltersProps {
    filters: any;
    setFilters: (filters: any) => void;
    onSearch: () => void;
}

export function LeadFilters({ filters, setFilters, onSearch }: LeadFiltersProps) {
    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[240px] relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by pharmacy name or city..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all"
                        value={filters.query || ''}
                        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-slate-400" />
                    <select
                        className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-xs font-bold px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500/20 transition-all pr-8 appearance-none relative"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Statuses</option>
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="WON">Won</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-xs font-bold px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none"
                        value={filters.hasWebshop}
                        onChange={(e) => setFilters({ ...filters, hasWebshop: e.target.value })}
                    >
                        <option value="all">Webshop: All</option>
                        <option value="true">With Webshop</option>
                        <option value="false">No Webshop</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-xs font-bold px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none"
                        value={filters.minScore}
                        onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                    >
                        <option value="0">Score: Any</option>
                        <option value="5">Score: 5+</option>
                        <option value="8">Score: 8+</option>
                    </select>
                </div>

                <button
                    onClick={onSearch}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
