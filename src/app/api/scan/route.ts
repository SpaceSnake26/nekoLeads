import { NextResponse } from 'next/server';
import { findPharmacies, findPharmaciesGlobal } from '@/lib/google-maps';
import { searchLocalCh } from '@/lib/local-ch';
import { scanWebsite } from '@/lib/scanner';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    try {
        const { city, scanners = 'both' } = await req.json();
        const isGlobal = !city || city === '_global' || city.toLowerCase() === 'schweiz' || city.toLowerCase() === 'switzerland';

        console.log(`[Scanner] Starting scan. Mode: ${isGlobal ? 'Global' : `City: ${city}`}, Scanners: ${scanners}`);

        // Get leads from both sources based on selection
        const fetchPromises = [];
        if (scanners === 'both' || scanners === 'gmaps') {
            fetchPromises.push(isGlobal ? findPharmaciesGlobal() : findPharmacies(city));
        } else {
            fetchPromises.push(Promise.resolve([])); // Empty GMaps results
        }

        if (scanners === 'both' || scanners === 'localch') {
            fetchPromises.push(searchLocalCh(isGlobal ? 'Apotheke' : `Apotheke in ${city}`));
        } else {
            fetchPromises.push(Promise.resolve([])); // Empty local.ch results
        }

        const [gmapsLeads, localChLeads] = await Promise.all(fetchPromises);

        const combinedLeads = [
            ...gmapsLeads.map(l => ({ ...l, source: 'GMaps' as const })),
            ...localChLeads.map(l => ({ ...l, source: 'local.ch' as const, place_id: (l as any).place_id || `localch_${l.name}_${l.city}` }))
        ];

        console.log(`[Scanner] Processing ${combinedLeads.length} leads in chunks...`);
        const results = [];
        const chunkSize = 25;

        for (let i = 0; i < combinedLeads.length; i += chunkSize) {
            const chunk = combinedLeads.slice(i, i + chunkSize);
            console.log(`[Scanner] Processing chunk ${i / chunkSize + 1} / ${Math.ceil(combinedLeads.length / chunkSize)}`);

            const chunkResults = await Promise.all(chunk.map(async (lead) => {
                try {
                    // Dedupe: Source-specific unique ID or Website
                    const { data: existingLead } = await supabase
                        .from('leads')
                        .select('id, overall_score, has_webshop')
                        .or(`google_place_id.eq.${lead.place_id}${lead.website ? `,website_url.eq.${lead.website}` : ''}`)
                        .maybeSingle();

                    let scanResult: any = {
                        overall_score: existingLead?.overall_score || 0,
                        has_webshop: existingLead?.has_webshop || false,
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

                    if (error) console.error('Supabase upsert error:', error.message);
                    return data?.[0] || lead;
                } catch (err) {
                    console.error(`Error processing lead ${lead.name}:`, err);
                    return lead; // Fallback so we don't lose it from response array
                }
            }));

            results.push(...chunkResults);
        }

        console.log(`[Scanner] Successfully processed ${results.length} leads.`);
        return NextResponse.json({ success: true, count: results.length, data: results });
    } catch (error: any) {
        console.error('Scanning error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
