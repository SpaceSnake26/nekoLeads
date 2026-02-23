import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScanResult {
    overall_score: number;
    has_webshop: boolean;
    owner: string | null;
    category_scores: {
        performance: number;
        seo: number;
        accessibility: number;
        security: number;
        conversion: number;
    };
    issues: string[];
    quick_wins: string[];
}

export async function scanWebsite(url: string): Promise<ScanResult> {
    if (!url) return getEmptyResult();

    try {
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await axios.get(formattedUrl, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });
        const html = response.data;
        const $ = cheerio.load(html);

        // Heuristics
        const hasWebshop = detectWebshop($, html);
        const owner = await detectOwner($, formattedUrl);

        // Scoring Pass 1: HTML Baseline
        const seoScore = calculateSEOScore($);
        const conversionScore = calculateConversionScore($);
        const securityScore = calculateSecurityScore(response.headers, html);

        // Placeholder for Pass 2 (PageSpeed Insights would go here)
        const performanceScore = 50; // Manual baseline
        const accessibilityScore = 60; // Manual baseline

        const overallScore = Math.round(
            (performanceScore * 0.3 +
                seoScore * 0.2 +
                accessibilityScore * 0.1 +
                securityScore * 0.15 +
                conversionScore * 0.25) / 10
        );

        return {
            overall_score: Math.min(Math.max(overallScore, 1), 10),
            has_webshop: hasWebshop,
            owner: owner,
            category_scores: {
                performance: performanceScore,
                seo: seoScore,
                accessibility: accessibilityScore,
                security: securityScore,
                conversion: conversionScore,
            },
            issues: [], // Populated based on score drops
            quick_wins: []
        };
    } catch (error) {
        console.error(`Failed to scan ${url}:`, error);
        return getEmptyResult();
    }
}

function detectWebshop($: cheerio.CheerioAPI, html: string): boolean {
    const shopKeywords = ['warenkorb', 'cart', 'panier', 'carrello', 'shop', 'kasse', 'checkout'];
    const hasCartIcon = $('.fa-shopping-cart, .cart-icon, [class*="cart"]').length > 0;
    const hasKeywords = shopKeywords.some(kw => html.toLowerCase().includes(kw));
    return hasCartIcon || hasKeywords;
}

async function detectOwner($: cheerio.CheerioAPI, baseUrl: string): Promise<string | null> {
    // Logic to find Impressum / Imprint and extract names
    const impressumLinks = $('a').filter((i, el) => {
        const text = $(el).text().toLowerCase();
        return text.includes('impressum') || text.includes('imprint') || text.includes('mentions légales');
    });

    if (impressumLinks.length > 0) {
        // In a real scenario, we would follow this link. For now, we'll try a regex on the main page
        // searching for "Inhaber", "Geschäftsführer", etc.
    }

    const ownerRegex = /(?:Inhaber|Geschäftsführer|Gérant|Proprietario|Verantwortlich):\s*([A-Z][a-z]+\s[A-Z][a-z]+)/;
    const match = $.text().match(ownerRegex);
    return match ? match[1] : null;
}

function calculateSEOScore($: cheerio.CheerioAPI): number {
    let score = 100;
    if ($('h1').length === 0) score -= 20;
    if (!$('meta[name="description"]').attr('content')) score -= 20;
    if (!$('title').text()) score -= 10;
    return Math.max(score, 0);
}

function calculateConversionScore($: cheerio.CheerioAPI): number {
    let score = 0;
    const contactKeywords = ['kontakt', 'contact', 'telefon', 'phone', 'appeler'];
    if (contactKeywords.some(kw => $.text().toLowerCase().includes(kw))) score += 40;
    if ($('button, a.button, .btn').length > 2) score += 30;
    if ($.text().includes('+41')) score += 30;
    return score;
}

function calculateSecurityScore(headers: any, html: string): number {
    let score = 50; // Start at 50 if it's HTTPS (axios would fail otherwise or we check protocol)
    if (headers['strict-transport-security']) score += 20;
    if (headers['content-security-policy']) score += 30;
    return score;
}

function getEmptyResult(): ScanResult {
    return {
        overall_score: 0,
        has_webshop: false,
        owner: null,
        category_scores: { performance: 0, seo: 0, accessibility: 0, security: 0, conversion: 0 },
        issues: ['Could not reach website'],
        quick_wins: []
    };
}
