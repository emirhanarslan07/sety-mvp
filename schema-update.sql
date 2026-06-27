-- =============================================
-- SETY MVP — Schema Update (Supabase SQL Editor'de çalıştırın)
-- =============================================

-- 1. Subscribers tablosu (lead magnet / ücretsiz ürün indirme kayıtları)
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(store_id, email)
);

-- 2. RLS Politikaları
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'subscribers' AND policyname = 'Users can view their own store subscribers'
    ) THEN
        CREATE POLICY "Users can view their own store subscribers"
            ON public.subscribers FOR SELECT
            USING (
                store_id IN (
                    SELECT id FROM public.stores WHERE user_id = auth.uid()
                )
            );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'subscribers' AND policyname = 'Anyone can insert a subscriber'
    ) THEN
        CREATE POLICY "Anyone can insert a subscriber"
            ON public.subscribers FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'subscribers' AND policyname = 'Users can delete their own store subscribers'
    ) THEN
        CREATE POLICY "Users can delete their own store subscribers"
            ON public.subscribers FOR DELETE
            USING (
                store_id IN (
                    SELECT id FROM public.stores WHERE user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- 3. Index
CREATE INDEX IF NOT EXISTS idx_subscribers_store_id ON public.subscribers(store_id);

-- 4. Stores tablosunda eksik olabilecek kolonları ekle (hata almamak için IF NOT EXISTS)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'announcement_text') THEN
        ALTER TABLE public.stores ADD COLUMN announcement_text TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'display_name') THEN
        ALTER TABLE public.stores ADD COLUMN display_name TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'store_logo_url') THEN
        ALTER TABLE public.stores ADD COLUMN store_logo_url TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'cover_image_url') THEN
        ALTER TABLE public.stores ADD COLUMN cover_image_url TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'theme_id') THEN
        ALTER TABLE public.stores ADD COLUMN theme_id TEXT DEFAULT 'minimal';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'brand_color') THEN
        ALTER TABLE public.stores ADD COLUMN brand_color TEXT DEFAULT '#5500ff';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'font_family') THEN
        ALTER TABLE public.stores ADD COLUMN font_family TEXT DEFAULT 'Inter';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'button_style') THEN
        ALTER TABLE public.stores ADD COLUMN button_style TEXT DEFAULT 'rounded';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'show_affiliate_badge') THEN
        ALTER TABLE public.stores ADD COLUMN show_affiliate_badge BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- 5. Products tablosunda calendly_url kolonu
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'calendly_url') THEN
        ALTER TABLE public.products ADD COLUMN calendly_url TEXT;
    END IF;
END $$;

-- Tamamlandı! ✅

-- 6. user_profiles tablosuna onboarding_completed kolonu
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'onboarding_completed') THEN
        ALTER TABLE public.user_profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
    END IF;
END $$;
