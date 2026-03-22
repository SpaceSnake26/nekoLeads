"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Layers, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleSwitcherProps {
  collapsed: boolean;
}

export function ModuleSwitcher({ collapsed }: ModuleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isERP = pathname.startsWith('/erp');
  const currentModule = isERP ? 'nekoERP' : 'nekoLeads';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectModule = (module: 'nekoLeads' | 'nekoERP') => {
    setIsOpen(false);
    if (module === 'nekoERP' && !isERP) {
      router.push('/erp/projects');
    } else if (module === 'nekoLeads' && isERP) {
      router.push('/');
    }
  };

  if (collapsed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-xl group relative cursor-pointer" onClick={() => setIsOpen(!isOpen)} ref={dropdownRef}>
        {isERP ? 'E' : 'L'}
        {/* Simple popover for collapsed state */}
        {isOpen && (
            <div className="absolute left-12 top-0 w-48 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
              <div 
                onClick={() => selectModule('nekoLeads')}
                className={cn(
                  "flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors",
                  !isERP ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                )}
              >
                <Layers size={18} />
                <span className="font-medium text-sm">nekoLeads</span>
              </div>
              <div 
                onClick={() => selectModule('nekoERP')}
                className={cn(
                  "flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors mt-1",
                  isERP ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                )}
              >
                <Briefcase size={18} />
                <span className="font-medium text-sm">nekoERP</span>
              </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors p-2 -ml-2 group"
      >
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
             {isERP ? 'E' : 'L'}
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600">
            {currentModule}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={cn(
            "text-slate-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
          <div 
            onClick={() => selectModule('nekoLeads')}
             className={cn(
               "flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors",
               !isERP ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
             )}
          >
             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                 <Layers size={18} />
             </div>
             <div>
                 <div className="font-semibold text-sm">nekoLeads</div>
                 <div className="text-[10px] text-slate-500 dark:text-slate-400">CRM & Leads</div>
             </div>
          </div>

          <div 
            onClick={() => selectModule('nekoERP')}
            className={cn(
              "flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors mt-1",
              isERP ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
            )}
          >
             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                 <Briefcase size={18} />
             </div>
             <div>
                 <div className="font-semibold text-sm">nekoERP</div>
                 <div className="text-[10px] text-slate-500 dark:text-slate-400">Projects & Finance</div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
