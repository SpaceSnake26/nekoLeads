/**
 * Local.ch API Wrapper (Mock / Placeholder)
 * 
 * This service will be updated with the actual API key in 2 working days.
 * Currently returns mock data for Switzerland-wide pharmacy results.
 */

export interface LocalChLead {
    name: string;
    website?: string;
    phone?: string;
    address?: string;
    city?: string;
    source: 'local.ch';
}

export async function searchLocalCh(query: string = 'Apotheke'): Promise<LocalChLead[]> {
    console.log(`[Local.ch] Searching for "${query}" across Switzerland...`);

    // Placeholder: actual API call would go here
    // const apiKey = process.env.LOCAL_CH_API_KEY;

    // Mocking 3 results for demonstration
    return [
        {
            name: 'Sun Store Apotheke',
            website: 'https://www.sunstore.ch',
            phone: '+41 58 878 50 00',
            address: 'Route des Falaises 7',
            city: 'Neuchâtel',
            source: 'local.ch'
        },
        {
            name: 'Amavita Apotheke',
            website: 'https://www.amavita.ch',
            phone: '+41 58 878 20 00',
            address: 'Untere Bahnhofstrasse 1',
            city: 'Rapperswil',
            source: 'local.ch'
        },
        {
            name: 'Apotheke am Bahnhof',
            website: 'https://apotheke-am-bahnhof.ch',
            phone: '+41 44 123 45 67',
            address: 'Bahnhofsplatz 1',
            city: 'Zürich',
            source: 'local.ch'
        }
    ];
}
