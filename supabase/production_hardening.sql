-- SETY PRODUCTION HARDENING SQL
-- Bu kod mevcut sistemi ölçeklenebilir ve güvenli hale getirir.

-- 1. Analytics Events Tablosu (Trafik ve Dönüşüm için)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Mağaza Sahibi
  event_name TEXT NOT NULL, -- 'store_view', 'product_click', 'checkout_start', 'purchase'
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  visitor_id TEXT, -- Oturum bazlı takip için
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Trial & Plan Alanlarını Güncelle
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='trial_ends_at') THEN
        ALTER TABLE user_profiles ADD COLUMN trial_ends_at TIMESTAMP DEFAULT (NOW() + interval '14 days');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='plan_status') THEN
        ALTER TABLE user_profiles ADD COLUMN plan_status TEXT DEFAULT 'active'; -- 'active', 'past_due', 'canceled'
    END IF;
END $$;

-- 3. PERFORMANS INDEXLERİ (10k+ Veri için Şart)
CREATE INDEX IF NOT EXISTS idx_analytics_user_event ON analytics_events(user_id, event_name);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status) WHERE status = 'active';

-- 4. RLS GÜVENLİK SERTLEŞTİRME
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics sadece sahibi görebilir ama herkes (ziyaretçiler) ekleyebilir
DROP POLICY IF EXISTS "Users can view own analytics" ON analytics_events;
CREATE POLICY "Users can view own analytics" ON analytics_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can insert analytics" ON analytics_events;
CREATE POLICY "Public can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);

-- 5. AGGREGATE FUNCTION (Optimizer)
-- Dashboard'ın toplam geliri SQL tarafında hızlıca hesaplaması için bir fonksiyon
CREATE OR REPLACE FUNCTION get_store_stats(seller_uuid UUID)
RETURNS TABLE (
  total_sales BIGINT,
  total_revenue DECIMAL,
  unique_customers BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(o.id) as total_sales,
    COALESCE(SUM(o.amount), 0) as total_revenue,
    (SELECT COUNT(DISTINCT c.id) FROM customers c WHERE c.user_id = seller_uuid) as unique_customers
  FROM orders o
  WHERE o.user_id = seller_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
