export type ProjectType = 'Website' | 'Webshop' | 'AI Tool' | 'Other';
export type Assignee = 'Owner' | 'Fabs' | 'Brother';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ProjectStatus = 'Backlog' | 'In Progress' | 'Review' | 'Waiting Client' | 'Done';
export type ExpenseCategory = 'Software' | 'Hardware' | 'Marketing' | 'Freelancer' | 'Other';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export interface Project {
    id: string;
    name: string;
    client: string;
    type: ProjectType;
    assignee: Assignee | null;
    priority: Priority;
    value_chf: number;
    due_date: string | null;
    status: ProjectStatus;
    notes: string | null;
    created_at: string;
}

export interface Expense {
    id: string;
    date: string;
    description: string;
    category: ExpenseCategory;
    amount_chf: number;
    project_id: string | null;
    paid_by: Assignee;
    has_receipt: boolean;
    created_at: string;
}

export interface Invoice {
    id: string;
    invoice_number: string;
    client: string;
    project_id: string | null;
    issue_date: string;
    due_date: string | null;
    amount_chf: number;
    status: InvoiceStatus;
    notes: string | null;
    created_at: string;
}
