import { NextResponse } from 'next/server';

/**
 * DUMMY LOCAL.CH API ENDPOINT
 * 
 * This simulates the external local.ch API.
 * In 2 working days, the 'src/lib/local-ch.ts' will be updated
 * to point to the real production URL.
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'Apotheke';

    console.log(`[DUMMY API] local.ch received request for: ${query}`);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockData = [
        {
            name: 'Sun Store Apotheke',
            website: 'https://www.sunstore.ch',
            phone: '+41 58 878 50 00',
            address: 'Route des Falaises 7',
            city: 'Neuchâtel',
            zip: '2000'
        },
        {
            name: 'Amavita Apotheke',
            website: 'https://www.amavita.ch',
            phone: '+41 58 878 20 00',
            address: 'Untere Bahnhofstrasse 1',
            city: 'Rapperswil',
            zip: '8640'
        },
        {
            name: 'Apotheke am Bahnhof',
            website: 'https://apotheke-am-bahnhof.ch',
            phone: '+41 44 123 45 67',
            address: 'Bahnhofsplatz 1',
            city: 'Zürich',
            zip: '8001'
        },
        {
            name: 'Coop Vitality',
            website: 'https://www.coop-vitality.ch',
            phone: '+41 58 234 56 78',
            address: 'Industriestrasse 10',
            city: 'Bern',
            zip: '3000'
        }
    ];

    return NextResponse.json({
        results: mockData,
        source: 'local.ch',
        status: 'success'
    });
}
