import { NextResponse } from 'next/server';
import { polar } from '@/lib/polar';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // You would replace this ID with the actual product ID from Polar Dashboard
    const POLAR_PRO_PRODUCT_ID = process.env.POLAR_PRO_PRODUCT_ID || "dummy_product_id";

    const checkout = await polar.checkouts.create({
      productId: POLAR_PRO_PRODUCT_ID,
      customerEmail: email,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=success`,
    });

    return NextResponse.json({ 
      url: checkout.url 
    });

  } catch (error: any) {
    console.error('Polar Subscription Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
