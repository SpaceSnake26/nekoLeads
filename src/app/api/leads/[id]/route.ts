import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { leadSchema } from '@/lib/validations';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    const { id } = await params;

    const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    const { id } = await params;

    try {
        const body = await req.json();
        const { data, error } = await supabase
            .from('leads')
            .update({
                ...body,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
