-- Add Polar ID columns to user_profiles

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS polar_customer_id TEXT;

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS polar_subscription_id TEXT;

-- If you have any products table that needs a polar_product_id, you can add it as well
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS polar_product_id TEXT;
