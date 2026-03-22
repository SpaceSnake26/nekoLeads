import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { surveyResponseSchema } from '@/lib/validations';

export async function POST(req: Request) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    try {
        const body = await req.json();

        // Validation
        const validated = surveyResponseSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json({ error: validated.error.format() }, { status: 400 });
        }

        const data = validated.data;

        // 1. Save Survey Response
        const { data: response, error: responseError } = await supabase
            .from('survey_responses')
            .insert({
                survey_id: data.survey_id,
                lead_id: data.lead_id,
                has_website: data.has_website,
                website_satisfaction: data.website_satisfaction,
                webshop_status: data.webshop_status,
                it_management: data.it_management,
                ai_usage: data.ai_usage,
                top_priority: data.top_priority,
                top_priority_other: data.top_priority_other,
                contact_name: data.contact_name,
                email: data.email,
                phone: data.phone,
                consent_accepted: data.consent_accepted
            })
            .select()
            .single();

        if (responseError) throw responseError;

        // 2. Link back to Lead and update contact info if possible
        if (data.lead_id) {
            await supabase.from('leads').update({
                contact_name: data.contact_name,
                email: data.email,
                phone: data.phone,
                has_webshop: data.webshop_status === 'Yes',
                has_ai_chatbot: data.ai_usage === 'Chatbot' || data.ai_usage === 'Both',
                status: 'REPLIED', // Automatically move to REPLIED
                updated_at: new Date().toISOString()
            }).eq('id', data.lead_id);
        } else {
            // Optional: try to find lead by email if lead_id was missing
            const { data: lead } = await supabase.from('leads').select('id').eq('email', data.email).maybeSingle();
            if (lead) {
                await supabase.from('survey_responses').update({ lead_id: lead.id }).eq('id', response.id);
            }
        }

        return NextResponse.json({ success: true, id: response.id });
    } catch (error: any) {
        console.error('Survey Response Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const { data, error } = await supabase
        .from('survey_responses')
        .select(`
            *,
            leads ( pharmacy_name, city )
        `)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
