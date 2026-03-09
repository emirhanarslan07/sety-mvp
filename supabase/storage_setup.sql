-- =============================================
-- STORAGE SETUP
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Create the 'products' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS Policies for the bucket

-- Policy: Allow anyone to view images (needed for the public store)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Policy: Allow authenticated users to upload their own images
DROP POLICY IF EXISTS "Authenticated Users Can Upload" ON storage.objects;
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow users to update or delete their own images
-- This assumes the path starts with the user's ID: products/{user_id}/{filename}
DROP POLICY IF EXISTS "Users Can Manage Own Images" ON storage.objects;
CREATE POLICY "Users Can Manage Own Images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'products'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
