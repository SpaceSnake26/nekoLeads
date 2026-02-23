"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  RefreshCw,
  Users,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const [city, setCity] = useState('');
  const [scanning, setScanning] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Fetch analytics error:', err);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;
    setScanning(true);
    try {
      await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city })
      });
      fetchAnalytics();
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Digital Transformation Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Monitor and grow your Swiss pharmacy digital agency pipeline.
          </p>
        </div>

        <form onSubmit={handleScan} className="flex items-center gap-2 group">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Scan new city..."
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all w-60 shadow-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Scan
          </button>
        </form>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Prospects"
          value={analytics?.totalLeads || 0}
          icon={<Users size={20} />}
          trend="+12% this month"
          color="blue"
        />
        <AnalyticsCard
          title="Webshop Adoption"
          value={`${analytics?.withWebshop || 0} / ${analytics?.totalLeads || 0}`}
          icon={<ShoppingCart size={20} />}
          trend={`${Math.round((analytics?.withWebshop / analytics?.totalLeads) * 100) || 0}% penetration`}
          color="purple"
        />
        <AnalyticsCard
          title="AI Chatbots"
          value={analytics?.withChatbot || 0}
          icon={<MessageSquare size={20} />}
          trend="High growth potential"
          color="blue"
        />
        <AnalyticsCard
          title="High Quality Leads"
          value={analytics?.highQuality || 0}
          icon={<Award size={20} />}
          trend="Score 8.0+"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-md">
            <h2 className="text-2xl font-bold">Ready to scale your outreach?</h2>
            <p className="text-purple-100 font-medium">
              You have {analytics?.highQuality || 0} high-quality leads waiting for a digital audit. Send them a personalized survey to identify their IT gaps.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/leads" className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                Manage CRM <ArrowRight size={18} />
              </Link>
              <Link href="/mailing" className="bg-purple-500/30 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2">
                Generate Emails
              </Link>
            </div>
          </div>
          {/* Decorative icons */}
          <Users className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64 rotate-12" />
        </div>

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Pipeline Breakdown</h3>
          <div className="space-y-4">
            <StatusRow label="New Prospects" count={analytics?.leadsByStatus?.NEW || 0} color="bg-blue-500" />
            <StatusRow label="Contacted" count={analytics?.leadsByStatus?.CONTACTED || 0} color="bg-purple-500" />
            <StatusRow label="Qualified" count={analytics?.leadsByStatus?.QUALIFIED || 0} color="bg-emerald-500" />
            <StatusRow label="Lost" count={analytics?.leadsByStatus?.LOST || 0} color="bg-rose-500" />
          </div>
          <Link href="/leads" className="mt-8 text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 group">
            View full CRM <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    blue: "from-blue-500 to-indigo-500",
    purple: "from-purple-500 to-indigo-500",
    emerald: "from-emerald-500 to-teal-500",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-purple-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl text-white shadow-lg", colors[color])}>
          {icon}
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth</div>
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
        <p className="text-xs text-slate-400 mt-2 font-medium">{trend}</p>
      </div>
    </div>
  );
}

function StatusRow({ label, count, color }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", color)} />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{count}</span>
    </div>
  );
}
