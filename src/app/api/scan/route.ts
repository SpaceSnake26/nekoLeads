import { NextResponse } from 'next/server';
import { findPharmacies } from '@/lib/google-maps';
import { scanWebsite } from '@/lib/scanner';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    try {
        const { city } = await req.json();
        if (!city) return NextResponse.json({ error: 'City is required' }, { status: 400 });

        const pharmacyLeads = await findPharmacies(city);

        const results = [];
        for (const lead of pharmacyLeads) {
            let scanResult: {
                overall_score: number;
                has_webshop: boolean;
                owner: string | null;
                category_scores: any;
            } = {
                overall_score: 0,
                has_webshop: false,
                owner: null,
                category_scores: {}
            };

            if (lead.website) {
                const scan = await scanWebsite(lead.website);
                scanResult = {
                    overall_score: scan.overall_score,
                    has_webshop: scan.has_webshop,
                    owner: scan.owner,
                    category_scores: scan.category_scores
                };
            }

            const { data, error } = await supabase
                .from('leads')
                .upsert({
                    name: lead.name,
                    website_url: lead.website,
                    phone: lead.phone,
                    address: lead.address,
                    city: city,
                    google_place_id: lead.place_id,
                    latitude: lead.latitude,
                    longitude: lead.longitude,
                    overall_score: scanResult.overall_score,
                    has_webshop: scanResult.has_webshop,
                    owner: scanResult.owner,
                    category_scores: scanResult.category_scores,
                    last_scanned: new Date().toISOString()
                }, { onConflict: 'google_place_id' })
                .select();

            if (error) console.error('Supabase upsert error:', error);
            results.push(data?.[0] || lead);
        }

        return NextResponse.json({ success: true, count: results.length, data: results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
