import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    try {
        const { data: leads, error } = await supabase.from('leads').select('status, has_webshop, has_ai_chatbot, overall_score');

        if (error) throw error;

        const analytics = {
            totalLeads: leads.length,
            leadsByStatus: leads.reduce((acc: any, lead) => {
                acc[lead.status] = (acc[lead.status] || 0) + 1;
                return acc;
            }, {}),
            withWebshop: leads.filter(l => l.has_webshop).length,
            withChatbot: leads.filter(l => l.has_ai_chatbot).length,
            highQuality: leads.filter(l => (l.overall_score || 0) >= 8).length,
        };

        return NextResponse.json(analytics);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
