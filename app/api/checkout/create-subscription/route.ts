import { NextResponse } from 'next/server';
import { polar } from '@/lib/polar';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      console.log("Error: User not authenticated or missing email");
      return NextResponse.json({ error: 'Unauthorized or missing email' }, { status: 401 });
    }

    const email = user.email;

    // You would replace this ID with the actual product ID from Polar Dashboard
    const POLAR_PRO_PRODUCT_ID = process.env.POLAR_PRO_PRODUCT_ID || "dummy_product_id";

    const checkout = await polar.checkouts.create({
      products: [POLAR_PRO_PRODUCT_ID],
      customerEmail: email,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=success`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ 
      url: checkout.url 
    });

  } catch (error: any) {
    console.error('Polar Subscription Error:', error.message || error);
    if (error.detail) console.error('Polar detail:', error.detail);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
