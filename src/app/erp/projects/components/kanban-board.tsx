"use client";

import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '@/types/erp.types';
import { getProjects, updateProjectStatus, createProject } from '@/lib/supabase-erp';
import { ProjectCard } from './project-card';
import { ProjectModal } from './project-modal';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLUMNS: { id: ProjectStatus; title: string; color: string }[] = [
  { id: 'Backlog', title: 'Backlog', color: 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' },
  { id: 'Review', title: 'Review / Waiting', color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' },
  { id: 'Done', title: 'Done', color: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' }
];

export function KanbanBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    // eslint-disable-next-line
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleDragStart = (e: React.DragEvent, project: Project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', project.id);
    
    // Slight delay to allow drag image generation before hiding the original
    setTimeout(() => {
        // Find the element and dim it
        const el = document.getElementById(`project-${project.id}`);
        if (el) el.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, project: Project) => {
    setDraggedProject(null);
    const el = document.getElementById(`project-${project.id}`);
    if (el) el.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, status: ProjectStatus) => {
    e.preventDefault();
    
    if (!draggedProject || draggedProject.status === status) {
        return;
    }

    // Optimistic update
    const previousProjects = [...projects];
    setProjects(projects.map(p => p.id === draggedProject.id ? { ...p, status } : p));
    
    // API update
    const success = await updateProjectStatus(draggedProject.id, status);
    if (!success) {
        console.error("Failed to update status");
        setProjects(previousProjects); // Revert on failure
    }
  };

  const openNewModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'created_at'>) => {
    if (editingProject) {
        // Assume update function exists, for now we just refetch
        // We realistically should add an updateProject in lib/supabase-erp.ts
        await fetchProjects();
        setIsModalOpen(false);
    } else {
        const newProject = await createProject(projectData);
        if (newProject) {
            setProjects([newProject, ...projects]);
            setIsModalOpen(false);
        }
    }
  };

  if (loading) {
      return (
          <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters could go here */}
        <div className="flex gap-2">
           <div className="h-9 px-3 text-sm flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
               All Assignees
           </div>
           <div className="h-9 px-3 text-sm flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
               All Priorities
           </div>
        </div>

        <button 
            onClick={openNewModal}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm shadow-purple-500/20 font-medium text-sm"
        >
            <Plus size={18} />
            <span>New Project</span>
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {COLUMNS.map((column) => (
            <div 
                key={column.id} 
                className="w-[320px] flex flex-col bg-slate-100/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/60 dark:border-slate-800/60"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center space-x-2">
                    <div className={cn("w-3 h-3 rounded-full border", column.color)} />
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">{column.title}</h3>
                </div>
                <span className="text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {projects.filter(p => p.status === column.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {projects
                  .filter(p => p.status === column.id)
                  .map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDragStart={(e: React.DragEvent) => handleDragStart(e, project)}
                      onDragEnd={(e: React.DragEvent) => handleDragEnd(e, project)}
                      onClick={() => openEditModal(project)}
                    />
                  ))}
                  {projects.filter(p => p.status === column.id).length === 0 && (
                      <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                          Drop projects here
                      </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
          <ProjectModal 
              project={editingProject} 
              onClose={() => setIsModalOpen(false)} 
              onSave={handleSaveProject} 
          />
      )}
    </div>
  );
}
