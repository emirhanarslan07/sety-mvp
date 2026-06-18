import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { polar } from '@/lib/polar';

export async function POST(req: Request) {
  try {
    const { productId, customerEmail, customerName, storeId } = await req.json();

    if (!productId || !storeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize Supabase Admin
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch Product from Sety DB
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 2. Create a Product in Polar first (required by the latest SDK)
    const polarProduct = await polar.products.create({
        name: product.title,
        description: product.description || '',
        prices: [{
            amountType: 'fixed',
            priceAmount: Math.round(product.price * 100),
            priceCurrency: (product.currency || 'usd').toLowerCase(),
        }],
        organizationId: process.env.NEXT_PUBLIC_POLAR_ORGANIZATION_ID || '',
    });

    // 3. Create a Checkout using the new Product
    const checkout = await polar.checkouts.create({
        products: [polarProduct.id],
        customerEmail: customerEmail || undefined,
        metadata: {
            sety_product_id: productId,
            sety_store_id: storeId,
            customer_name: customerName || '',
        },
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success?checkout_id={CHECKOUT_ID}`,
    });

    return NextResponse.json({ 
      data: {
        transactionId: checkout.id,
        checkoutUrl: checkout.url,
      } 
    });

  } catch (error: any) {
    console.error('Polar Transaction Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
