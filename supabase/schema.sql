-- SETY MVP Database Schema (PRODUCTION HARDENING READY)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table 1: user_profiles (Basic User Data)
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  profile_image_url TEXT,
  
  -- Subscription & Pricing Strategy (Sety Beta)
  plan_type TEXT DEFAULT 'founder', -- 'founder' | 'starter'
  price_locked BOOLEAN DEFAULT TRUE,
  locked_price DECIMAL(10,2) DEFAULT 9.00,
  subscription_status TEXT DEFAULT 'trialing', -- 'trialing' | 'active' | 'canceled'
  trial_ends_at TIMESTAMP DEFAULT (NOW() + interval '30 days'),
  
  is_active BOOLEAN DEFAULT TRUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- Table 2: stores (The Business Entity)
-- =============================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  social_links JSONB DEFAULT '{}',
  
  -- Business Data
  niche TEXT,
  platform TEXT,
  followers INTEGER,
  engagement_rate DECIMAL(5,2),
  monthly_goal DECIMAL(10,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Design & Customization (Added in V3 Refinement)
  display_name TEXT,
  store_logo_url TEXT,
  cover_image_url TEXT,
  theme_id TEXT DEFAULT 'minimal',
  brand_color TEXT DEFAULT '#5500ff',
  font_family TEXT DEFAULT 'Inter',
  button_style TEXT DEFAULT 'rounded',
  announcement_text TEXT,
  show_affiliate_badge BOOLEAN DEFAULT TRUE,

  CONSTRAINT fk_stores_user_profile FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- =============================================
-- MIGRATION: Ensure existing tables have store_id
-- =============================================
DO $$ 
BEGIN 
    -- products
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='store_id') THEN
        ALTER TABLE products ADD COLUMN store_id UUID REFERENCES stores(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='currency') THEN
        ALTER TABLE products ADD COLUMN currency TEXT DEFAULT 'TRY';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='external_checkout_url') THEN
        ALTER TABLE products ADD COLUMN external_checkout_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='checkout_provider') THEN
        ALTER TABLE products ADD COLUMN checkout_provider TEXT DEFAULT 'manual';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='order_index') THEN
        ALTER TABLE products ADD COLUMN order_index INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='icon_id') THEN
        ALTER TABLE products ADD COLUMN icon_id TEXT DEFAULT 'mail';
    END IF;

    -- customers
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='store_id') THEN
        ALTER TABLE customers ADD COLUMN store_id UUID REFERENCES stores(id) ON DELETE CASCADE;
    END IF;

    -- orders
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='store_id') THEN
        ALTER TABLE orders ADD COLUMN store_id UUID REFERENCES stores(id) ON DELETE CASCADE;
    END IF;

    -- analytics_events
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='analytics_events' AND column_name='store_id') THEN
        ALTER TABLE analytics_events ADD COLUMN store_id UUID REFERENCES stores(id) ON DELETE CASCADE;
    END IF;

    -- user_profiles migration for Founder Plan
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='plan_type') THEN
        ALTER TABLE user_profiles ADD COLUMN plan_type TEXT DEFAULT 'founder';
        ALTER TABLE user_profiles ADD COLUMN price_locked BOOLEAN DEFAULT TRUE;
        ALTER TABLE user_profiles ADD COLUMN locked_price DECIMAL(10,2) DEFAULT 9.00;
        ALTER TABLE user_profiles ADD COLUMN subscription_status TEXT DEFAULT 'trialing';
    END IF;

    -- FK link for stores -> user_profiles (important for PostgREST joins)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='fk_stores_user_profile') THEN
        ALTER TABLE stores 
        ADD CONSTRAINT fk_stores_user_profile 
        FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE;
    END IF;
END $$;


-- =============================================
-- Table 3: products
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'TRY',
  type TEXT NOT NULL, 
  image_url TEXT,
  file_url TEXT,
  external_checkout_url TEXT,
  checkout_provider TEXT DEFAULT 'manual', -- 'stripe', 'iyzico', 'shopier', 'paddle', 'manual'
  status TEXT DEFAULT 'active', -- 'active', 'draft'
  order_index INTEGER DEFAULT 0,
  
  -- Modernized UI Styles (Stan-like)
  thumbnail_style TEXT DEFAULT 'callout', -- 'button', 'callout', 'preview'
  subtitle TEXT,
  button_text TEXT DEFAULT 'Hemen Al',
  image_zoom DECIMAL DEFAULT 1.0,
  is_highlighted BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Table 4: customers
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Table 5: orders
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'paid', 
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Table 6: analytics_events
-- =============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL, -- 'store_view', 'product_click', 'checkout_open', 'checkout_complete'
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  visitor_id TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_username ON stores(username);

CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);

CREATE INDEX IF NOT EXISTS idx_customers_store_id ON customers(store_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- user_profiles Policies
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);

-- stores Policies
DROP POLICY IF EXISTS "Public can view stores" ON stores;
CREATE POLICY "Public can view stores" ON stores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own store" ON stores;
CREATE POLICY "Users can manage own store" ON stores FOR ALL USING (auth.uid() = user_id);

-- products Policies
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own products" ON products;
CREATE POLICY "Users can manage own products" ON products FOR ALL 
USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.user_id = auth.uid()));

-- customers Policies
DROP POLICY IF EXISTS "Users can manage own customers" ON customers;
CREATE POLICY "Users can manage own customers" ON customers FOR ALL 
USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = customers.store_id AND stores.user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can insert customers" ON customers;
CREATE POLICY "Public can insert customers" ON customers FOR INSERT WITH CHECK (true);

-- orders Policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT 
USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- analytics_events Policies
DROP POLICY IF EXISTS "Users can view own analytics" ON analytics_events;
CREATE POLICY "Users can view own analytics" ON analytics_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can insert analytics" ON analytics_events;
CREATE POLICY "Public can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);

-- =============================================
-- Aggregate Functions for Dashboard
-- =============================================
CREATE OR REPLACE FUNCTION get_store_metrics(p_store_id UUID)
RETURNS TABLE (
  order_count BIGINT,
  total_revenue DECIMAL,
  customer_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(o.id) as order_count,
    COALESCE(SUM(o.amount), 0) as total_revenue,
    (SELECT COUNT(id) FROM customers WHERE store_id = p_store_id) as customer_count
  FROM orders o
  WHERE o.store_id = p_store_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sety Founder Stats Counter
CREATE OR REPLACE FUNCTION get_founder_stats()
RETURNS TABLE (
  founder_count BIGINT,
  is_full BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(id) as founder_count,
    COUNT(id) >= 30 as is_full
  FROM user_profiles
  WHERE plan_type = 'founder';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
