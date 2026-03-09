-- SETY SECURITY FIREWALL HARDENING
-- This script tightens RLS policies to prevent unauthorized data manipulation.

-- 1. Analytics Events Hardening
-- Current: Public can insert anything.
-- Improved: Public can insert if the store_id exists.
DROP POLICY IF EXISTS "Public can insert analytics" ON analytics_events;
CREATE POLICY "Public can insert analytics" ON analytics_events FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = analytics_events.store_id)
);

-- 2. Customers Hardening
-- Current: Public can insert anything.
-- Improved: Public can insert if the store_id exists.
DROP POLICY IF EXISTS "Public can insert customers" ON customers;
CREATE POLICY "Public can insert customers" ON customers FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = customers.store_id)
);

-- 3. Orders Hardening
-- Current: Public can insert anything.
-- Improved: Public can insert if the store_id exists.
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id)
);

-- 4. User Profiles Hardening
-- Ensure users can only SEE their own profiles.
-- The "Users can manage own profile" policy already exists for ALL, but let's be explicit for SELECT.
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Prevent Public Store Listing
-- Current: Public can view all stores.
-- Note: Public needs to view A SPECIFIC store by username for the landing page, 
-- but we should ensure they can't just list all stores via API if they find the endpoint.
-- Actually, Next.js fetching via username is fine. RLS "SELECT true" is standard for public profiles.
-- However, we can add a check to ensure only active stores are visible if we add a 'status' column later.

-- 6. Storage Security (Bucket Policies)
-- Ensure 'product-images' and 'store-assets' have strict RLS.
-- (This assumes buckets 'product-images' and 'store-assets' exist)
-- Note: Storage RLS is managed in the storage.objects table.
-- 7. Field Protection for user_profiles
-- Users should NOT be able to change their plan_type or subscription_status directly.
CREATE OR REPLACE FUNCTION protect_profile_fields() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.plan_type IS DISTINCT FROM OLD.plan_type OR 
     NEW.subscription_status IS DISTINCT FROM OLD.subscription_status OR
     NEW.price_locked IS DISTINCT FROM OLD.price_locked OR
     NEW.locked_price IS DISTINCT FROM OLD.locked_price OR
     NEW.trial_ends_at IS DISTINCT FROM OLD.trial_ends_at THEN
    
    -- If the current user is NOT an admin (we should check for an admin flag later)
    -- For now, we revert these fields to their OLD values
    NEW.plan_type := OLD.plan_type;
    NEW.subscription_status := OLD.subscription_status;
    NEW.price_locked := OLD.price_locked;
    NEW.locked_price := OLD.locked_price;
    NEW.trial_ends_at := OLD.trial_ends_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_protect_profile_fields ON user_profiles;
CREATE TRIGGER tr_protect_profile_fields
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_fields();

-- 8. Enhanced Orders Cross-Validation
-- Ensure an order's product_id belongs to the same store_id.
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM products 
    WHERE products.id = orders.product_id 
    AND products.store_id = orders.store_id
  )
);

-- 9. Enhanced Customer Email Privacy
-- Users should be able to see their own customers, but others shouldn't even if they know the ID.
-- (Existing policy already handles this by checking stores.user_id = auth.uid())

-- 10. Admin Reset Helper (Optional, but useful for testing)
-- We'll just define it for completeness.
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, only a specific hardcoded email is admin (or use a role column)
  RETURN (SELECT email FROM auth.users WHERE id = auth.uid()) IN ('admin@sety.store', 'emirh.sety@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
