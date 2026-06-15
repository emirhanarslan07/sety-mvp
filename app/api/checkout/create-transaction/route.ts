import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { paddle } from '@/lib/paddle';

export async function POST(req: Request) {
  try {
    const { productId, customerEmail, customerName, storeId } = await req.json();

    if (!productId || !storeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize Supabase Admin (or use a client with service role for security)
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

    // 2. Create a Transaction in Paddle (Ad-hoc)
    // This allows us to use Sety's price and title without creating products in Paddle dashboard first
    const transaction = await paddle.transactions.create({
      items: [
        {
          price: {
            description: product.title,
            name: product.title,
            unitPrice: {
              amount: Math.round(product.price * 100).toString(), // Paddle expects amount in cents/minor units
              currencyCode: (product.currency || 'USD') as any,
            },
            product: {
              name: product.title,
              description: product.description || '',
              taxCategory: 'standard',
            }
          },
          quantity: 1,
        }
      ],
      customerId: customerEmail || undefined,
      customData: {
        sety_product_id: productId,
        sety_store_id: storeId,
        customer_name: customerName || '',
      }
    });

    return NextResponse.json({ 
      data: {
        transactionId: transaction.id,
        // You can also return a checkout URL if needed, but Paddle.js usually handles the ID
      } 
    });

  } catch (error: any) {
    console.error('Paddle Transaction Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
