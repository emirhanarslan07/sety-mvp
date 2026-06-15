import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Use service role to bypass RLS if needed, or just admin client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { store_id, block_id, email, name } = body;

        if (!store_id || !block_id || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch product details to get file_url and title
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', block_id)
            .single();

        if (productError || !product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // 2. Fetch store details for the email branding
        const { data: store } = await supabaseAdmin
            .from('stores')
            .select('display_name, username')
            .eq('id', store_id)
            .single();

        const storeName = store?.display_name || store?.username || 'Sety Mağazası';

        // 3. Save subscriber to database
        // Use upsert to handle existing subscribers gracefully
        const { error: insertError } = await supabaseAdmin
            .from('subscribers')
            .upsert({
                store_id,
                product_id: block_id,
                email,
                name: name || email.split('@')[0],
                status: 'active',
                updated_at: new Date().toISOString()
            }, { onConflict: 'store_id,email' });

        if (insertError) {
            console.error('Error saving subscriber:', insertError);
            // We still proceed to send email even if they are already subscribed, 
            // as they requested the lead magnet again.
        }

        // 4. Send email using Resend
        const downloadUrl = product.file_url || product.digital_file_url || '#';
        
        // We use a verified domain if possible, otherwise rely on resend's test domain for now.
        // Replace 'onboarding@resend.dev' with your actual verified sender domain in production.
        const { error: emailError } = await resend.emails.send({
            from: `${storeName} <onboarding@resend.dev>`,
            to: [email],
            subject: `İşte Ücretsiz Rehberiniz: ${product.title}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Merhaba ${name || ''},</h2>
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                        Talep ettiğiniz <strong>${product.title}</strong> isimli dosyayı aşağıdan indirebilirsiniz.
                    </p>
                    <div style="margin: 30px 0;">
                        <a href="${downloadUrl}" style="background-color: #5500ff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Dosyayı İndir
                        </a>
                    </div>
                    <p style="color: #888; font-size: 14px; margin-top: 40px;">
                        Bu e-posta <strong>${storeName}</strong> tarafından gönderilmiştir.
                    </p>
                </div>
            `
        });

        if (emailError) {
            console.error('Resend error:', emailError);
            return NextResponse.json({ error: 'E-posta gönderilemedi' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Lead capture error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
