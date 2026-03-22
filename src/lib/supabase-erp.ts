import { getSupabase } from './supabase';
import { Project, Expense, Invoice } from '@/types/erp.types';

export const getProjects = async (): Promise<Project[]> => {
    const supabase = getSupabase();
    if (!supabase) return [];
    
    const { data, error } = await supabase
        .from('erp_projects')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    
    return data || [];
};

export const updateProjectStatus = async (projectId: string, newStatus: string): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) return false;
    
    const { error } = await supabase
        .from('erp_projects')
        .update({ status: newStatus })
        .eq('id', projectId);
        
    if (error) {
        console.error('Error updating project status:', error);
        return false;
    }
    return true;
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at'>): Promise<Project | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;
    
    const { data, error } = await supabase
        .from('erp_projects')
        .insert(project)
        .select()
        .single();
        
    if (error) {
        console.error('Error creating project:', JSON.stringify(error, null, 2));
        if (typeof window !== 'undefined') {
            alert(`Failed to save project: ${error.message} \nDetails: ${error.details}`);
        }
        return null;
    }
    return data;
};

export const getExpenses = async (): Promise<Expense[]> => {
    const supabase = getSupabase();
    if (!supabase) return [];
    
    const { data, error } = await supabase
        .from('erp_expenses')
        .select('*')
        .order('date', { ascending: false });
        
    if (error) {
        console.error('Error fetching expenses:', error);
        return [];
    }
    return data || [];
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;
    
    const { data, error } = await supabase
        .from('erp_expenses')
        .insert(expense)
        .select()
        .single();
        
    if (error) {
        console.error('Error creating expense:', JSON.stringify(error, null, 2));
        if (typeof window !== 'undefined') {
            alert(`Failed to save expense: ${error.message} \nDetails: ${error.details}`);
        }
        return null;
    }
    return data;
};

export const deleteExpense = async (id: string): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) return false;
    
    const { error } = await supabase
        .from('erp_expenses')
        .delete()
        .eq('id', id);
        
    if (error) {
        console.error('Error deleting expense:', error);
        return false;
    }
    return true;
};

export const getInvoices = async (): Promise<Invoice[]> => {
    const supabase = getSupabase();
    if (!supabase) return [];
    
    const { data, error } = await supabase
        .from('erp_invoices')
        .select('*')
        .order('issue_date', { ascending: false });
        
    if (error) {
        console.error('Error fetching invoices:', error);
        return [];
    }
    return data || [];
};

export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at'>): Promise<Invoice | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;
    
    const { data, error } = await supabase
        .from('erp_invoices')
        .insert(invoice)
        .select()
        .single();
        
    if (error) {
        console.error('Error creating invoice:', JSON.stringify(error, null, 2));
        if (typeof window !== 'undefined') {
            alert(`Failed to save invoice: ${error.message} \nDetails: ${error.details}`);
        }
        return null;
    }
    return data;
};

export const updateInvoiceStatus = async (id: string, status: string): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) return false;
    
    const { error } = await supabase
        .from('erp_invoices')
        .update({ status })
        .eq('id', id);
        
    if (error) {
        console.error('Error updating invoice status:', error);
        return false;
    }
    return true;
};
