import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const targetUrl = url.startsWith('http') ? url : `https://${url}`;

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
        let name = title;
        if (title.includes('@')) name = title.split('@')[1].trim();
        else if (title.includes('|')) name = title.split('|')[0].trim();

        const bio = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
        const image = $('meta[property="og:image"]').attr('content') || '';

        const links: { title: string, url: string }[] = [];
        
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            const linkTitle = $(el).text().trim() || $(el).attr('aria-label') || '';
            
            if (href && href.startsWith('http') && !href.includes('linktr.ee') && linkTitle && linkTitle.length > 2) {
                if (!links.find(l => l.url === href)) {
                    links.push({
                        title: linkTitle,
                        url: href
                    });
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                name,
                bio,
                image,
                links: links.slice(0, 10) 
            }
        });

    } catch (error: any) {
        console.error('Import API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to parse the provided URL' }, { status: 500 });
    }
}
