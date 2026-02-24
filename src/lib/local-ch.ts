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
    console.log(`[Local.ch] Fetching from dummy API for "${query}"...`);

    try {
        // In 2 working days, change this URL to the real local.ch API
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/dummy/local-ch?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.status === 'success' && Array.isArray(data.results)) {
            return data.results.map((r: any) => ({
                ...r,
                source: 'local.ch'
            }));
        }
        return [];
    } catch (error) {
        console.error('[Local.ch] Dummy API fetch failed:', error);
        return [];
    }
}
