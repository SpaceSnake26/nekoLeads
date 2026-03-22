const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use existing supabase config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    const expense = {
        date: '2026-03-22',
        description: 'Test Expense',
        category: 'Software',
        amount_chf: 10,
        project_id: null,
        paid_by: 'Owner',
        has_receipt: false
    };

    console.log("Attempting to insert:", expense);
    const { data, error } = await supabase
        .from('erp_expenses')
        .insert(expense)
        .select()
        .single();
        
    if (error) {
        console.error('Supabase Error:', error);
    } else {
        console.log('Success:', data);
    }
}

run();
