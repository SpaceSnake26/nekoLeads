import { NextResponse } from 'next/server';
import { findPharmacies, findPharmaciesGlobal } from '@/lib/google-maps';
import { searchLocalCh } from '@/lib/local-ch';
import { scanWebsite } from '@/lib/scanner';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    try {
        const { city } = await req.json();
        const isGlobal = !city || city.toLowerCase() === 'schweiz' || city.toLowerCase() === 'switzerland';

        console.log(`[Scanner] Starting scan. Mode: ${isGlobal ? 'Global' : `City: ${city}`}`);

        // Get leads from both sources
        const [gmapsLeads, localChLeads] = await Promise.all([
            isGlobal ? findPharmaciesGlobal() : findPharmacies(city),
            searchLocalCh(isGlobal ? 'Apotheke' : `Apotheke in ${city}`)
        ]);

        const combinedLeads = [
            ...gmapsLeads.map(l => ({ ...l, source: 'GMaps' as const })),
            ...localChLeads.map(l => ({ ...l, source: 'local.ch' as const, place_id: `localch_${l.name}_${l.city}` }))
        ];

        const results = [];
        for (const lead of combinedLeads) {
            // Dedupe: Source-specific unique ID or Website
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
                city: lead.city || city || 'Switzerland',
                google_place_id: lead.place_id,
                source: lead.source,
                latitude: (lead as any).latitude,
                longitude: (lead as any).longitude,
                overall_score: scanResult.overall_score,
                has_webshop: scanResult.has_webshop,
                has_ai_chatbot: false,
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
