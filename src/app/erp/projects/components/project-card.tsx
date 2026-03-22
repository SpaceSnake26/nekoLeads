"use client";

import React from 'react';
import { Project, Priority } from '@/types/erp.types';
import { Calendar, Tag, User, Banknote, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
    project: Project;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onClick: () => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
    'Low': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    'Medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    'High': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    'Urgent': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export function ProjectCard({ project, onDragStart, onDragEnd, onClick }: ProjectCardProps) {
    return (
        <div
            id={`project-${project.id}`}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onClick}
            className="group relative bg-white dark:bg-slate-950 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 cursor-grab active:cursor-grabbing hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-md transition-all text-left"
        >
            <div className="flex justify-between items-start mb-2 gap-2">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-tight">
                    {project.name}
                </h4>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 truncate">
                {project.client}
            </p>

            <div className="space-y-2">
                {/* Type & Priority */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-medium border border-purple-100 dark:border-purple-800/50">
                        <Tag size={10} />
                        <span>{project.type}</span>
                    </span>
                    <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-medium border border-transparent", PRIORITY_COLORS[project.priority])}>
                        {project.priority}
                    </span>
                </div>

                {/* Footer specs */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-900 mt-2">
                    <div className="flex space-x-3 text-slate-400 dark:text-slate-500 text">
                        {project.assignee && (
                            <div className="flex items-center space-x-1" title="Assignee">
                                <User size={12} />
                                <span className="text-[10px] truncate max-w-[60px]">{project.assignee}</span>
                            </div>
                        )}
                        {project.due_date && (
                            <div className="flex items-center space-x-1" title="Due Date">
                                <Calendar size={12} />
                                <span className="text-[10px]">
                                    {new Date(project.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {project.value_chf > 0 && (
                        <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 font-medium" title="Estimated Value">
                            <span className="text-[10px]">CHF {project.value_chf.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
