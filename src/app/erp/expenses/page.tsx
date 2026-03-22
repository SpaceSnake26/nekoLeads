import { Metadata } from "next";
import { ExpensesTable } from "./components/expenses-table";

export const metadata: Metadata = {
  title: "nekoERP - Expenses",
  description: "Track company expenses and costs per project",
};

export default function ExpensesPage() {
  return (
    <div className="p-8 h-full flex flex-col pt-[72px] lg:pt-8 bg-slate-50 dark:bg-slate-950">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Expenses Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track company expenses and costs per project.</p>
        </div>
      </div>
      
      <ExpensesTable />
    </div>
  );
}
