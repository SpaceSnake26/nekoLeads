"use client";

import React, { useState, useEffect } from 'react';
import { Project, ProjectType, Priority, Assignee, ProjectStatus } from '@/types/erp.types';
import { X } from 'lucide-react';

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
    onSave: (project: any) => Promise<void>;
}

export function ProjectModal({ project, onClose, onSave }: ProjectModalProps) {
    const [formData, setFormData] = useState<Partial<Project>>({
        name: '',
        client: '',
        type: 'Website',
        assignee: 'Owner',
        priority: 'Medium',
        value_chf: 0,
        due_date: '',
        status: 'Backlog',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                ...project,
                due_date: project.due_date ? project.due_date.split('T')[0] : ''
            });
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative bg-white dark:bg-slate-950 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 my-8">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-t-2xl z-10">
                    <h2 className="text-xl font-bold dark:text-slate-100">
                        {project ? 'Edit Project' : 'New Project'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium dark:text-slate-300">Project Name *</label>
                            <input
                                required
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                                placeholder="e.g. Acme Corp Webshop"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium dark:text-slate-300">Client Name *</label>
                            <input
                                required
                                name="client"
                                value={formData.client || ''}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Project Type</label>
                            <select
                                name="type"
                                value={formData.type || 'Website'}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            >
                                <option value="Website">Website</option>
                                <option value="Webshop">Webshop</option>
                                <option value="AI Tool">AI Tool</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Status</label>
                            <select
                                name="status"
                                value={formData.status || 'Backlog'}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            >
                                <option value="Backlog">Backlog</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Review">Review / Waiting</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Assignee</label>
                            <select
                                name="assignee"
                                value={formData.assignee || 'Owner'}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            >
                                <option value="Owner">Owner</option>
                                <option value="Fabs">Fabs</option>
                                <option value="Brother">Brother</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority || 'Medium'}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Due Date</label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date || ''}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Estimated Value (CHF)</label>
                            <input
                                type="number"
                                name="value_chf"
                                step="0.01"
                                min="0"
                                value={formData.value_chf || 0}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium dark:text-slate-300">Notes & Description</label>
                            <textarea
                                name="notes"
                                value={formData.notes || ''}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-slate-100 resize-y"
                                placeholder="Add any relevant information about this project..."
                            />
                        </div>
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
                                "Save Project"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
