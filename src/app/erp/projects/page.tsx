import { Metadata } from "next";
import { KanbanBoard } from "./components/kanban-board";
import { getProjects } from "@/lib/supabase-erp";

export const metadata: Metadata = {
  title: "nekoERP - Projects",
  description: "Manage company projects",
};

export default async function ProjectsPage() {
  // Use a simpler approach with client-side fetching to ensure real-time updates and easier mutations later
  // Alternatively, we can pass fetched initial data to KanbanBoard
  
  return (
    <div className="p-8 h-full flex flex-col pt-[72px] lg:pt-8 bg-slate-50 dark:bg-slate-950">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Projects Board</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage all company projects, webshops, and tools.</p>
        </div>
      </div>
      
      <KanbanBoard />
    </div>
  );
}
