import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { newsletterSignupSchema } from '@/lib/validations';

export async function POST(req: Request) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    try {
        const body = await req.json();

        // Validation
        const validated = newsletterSignupSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json({ error: validated.error.format() }, { status: 400 });
        }

        const data = validated.data;

        // Save Newsletter Signup
        const { error } = await supabase
            .from('newsletter_signups')
            .upsert({
                email: data.email,
                pharmacy_name: data.pharmacy_name,
                lead_id: data.lead_id,
                consent_accepted: data.consent_accepted,
                created_at: new Date().toISOString()
            }, { onConflict: 'email' });

        if (error) throw error;

        // Add 'NEWSLETTER' tag to lead if linked
        if (data.lead_id) {
            const { data: lead } = await supabase.from('leads').select('tags').eq('id', data.lead_id).single();
            if (lead) {
                const newTags = Array.from(new Set([...(lead.tags || []), 'NEWSLETTER']));
                await supabase.from('leads').update({ tags: newTags }).eq('id', data.lead_id);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Newsletter Signup Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const { data, error } = await supabase
        .from('newsletter_signups')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
