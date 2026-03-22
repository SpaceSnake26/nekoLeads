import { Metadata } from "next";
import { InvoicesTable } from "./components/invoices-table";

export const metadata: Metadata = {
  title: "nekoERP - Invoices",
  description: "Track invoices issued to clients and payment status",
};

export default function InvoicesPage() {
  return (
    <div className="p-8 h-full flex flex-col pt-[72px] lg:pt-8 bg-slate-50 dark:bg-slate-950">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Invoices</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track invoices issued to clients and their payment status.</p>
        </div>
      </div>
      
      <InvoicesTable />
    </div>
  );
}
