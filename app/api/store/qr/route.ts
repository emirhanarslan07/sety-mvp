import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Generate QR Code as a Data URL (PNG)
        const qrDataUrl = await QRCode.toDataURL(url, {
            margin: 2,
            width: 512,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        });

        // Convert base64 Data URL to Buffer
        const base64Data = qrDataUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Return the image
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error: any) {
        console.error('QR Generation error:', error);
        return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
