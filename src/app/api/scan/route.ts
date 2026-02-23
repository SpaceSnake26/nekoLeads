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
            // 1. Check for existing lead to handle deduplication
            // Dedupe strategy: Google Place ID -> Website URL -> Name + City
            const { data: existingLead } = await supabase
                .from('leads')
                .select('id')
                .or(`google_place_id.eq.${lead.place_id}${lead.website ? `,website_url.eq.${lead.website}` : ''}`)
                .maybeSingle();

            let scanResult: any = { overall_score: 0, has_webshop: false, owner: null, category_scores: {} };

            if (lead.website) {
                const scan = await scanWebsite(lead.website);
                scanResult = {
                    overall_score: scan.overall_score,
                    has_webshop: scan.has_webshop,
                    owner: scan.owner,
                    category_scores: scan.category_scores
                };
            }

            const leadData = {
                pharmacy_name: lead.name,
                website_url: lead.website,
                phone: lead.phone,
                address: lead.address,
                city: city,
                google_place_id: lead.place_id,
                latitude: lead.latitude,
                longitude: lead.longitude,
                overall_score: scanResult.overall_score,
                has_webshop: scanResult.has_webshop,
                has_ai_chatbot: false, // Baseline detection deferred or manually set
                owner: scanResult.owner,
                category_scores: scanResult.category_scores,
                last_scanned: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('leads')
                .upsert(
                    existingLead ? { ...leadData, id: existingLead.id } : leadData,
                    { onConflict: 'google_place_id' }
                )
                .select();

            if (error) console.error('Supabase upsert error:', JSON.stringify(error, null, 2));
            results.push(data?.[0] || lead);
        }

        return NextResponse.json({ success: true, count: results.length, data: results });
    } catch (error: any) {
        console.error('Scanning error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
