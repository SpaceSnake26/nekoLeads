import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: Request) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const minScore = searchParams.get('minScore');
    const hasWebshop = searchParams.get('hasWebshop');

    let query = supabase.from('leads').select('*').order('overall_score', { ascending: false });

    if (city) query = query.eq('city', city);
    if (minScore) query = query.gte('overall_score', parseInt(minScore));
    if (hasWebshop) query = query.eq('has_webshop', hasWebshop === 'true');

    const { data, error } = await query;

    if (error) {
        console.error('Supabase fetch error:', JSON.stringify(error, null, 2));
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}
