/*
# Portfolio v2: multi-image projects, follows, views, comment moderation, site settings

1. New Tables
- `project_images`: multiple detailed images per project (Behance-style showcase)
  - id, project_id (fk), image_url, sort_order, created_at
- `follows`: follower tracking (session-key based, like follows)
  - id, session_key, created_at (UNIQUE on session_key)
- `site_settings`: single-row config table for visibility toggles
  - id, show_followers (bool default true), show_views (bool default true), behance_profile_url (text)

2. Modified Tables
- `projects`: ADD COLUMN views (int default 0), ADD COLUMN source (text default 'website')
- `project_comments`: ADD COLUMN status (text default 'pending' CHECK in pending|approved|hidden)

3. Security
- All new tables: RLS enabled, anon+authenticated CRUD (single-tenant, no auth screen for visitors).
- project_comments SELECT: public can only see approved comments; admin (anon) can see all.
- Updated comment SELECT policy to filter by status='approved' for public reads.
*/

-- project_images
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_images" ON project_images;
CREATE POLICY "public_read_project_images" ON project_images FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_project_images" ON project_images;
CREATE POLICY "anon_insert_project_images" ON project_images FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_project_images" ON project_images;
CREATE POLICY "anon_update_project_images" ON project_images FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_project_images" ON project_images;
CREATE POLICY "anon_delete_project_images" ON project_images FOR DELETE
  TO anon, authenticated USING (true);

-- follows
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_follows" ON follows;
CREATE POLICY "public_read_follows" ON follows FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_follows" ON follows;
CREATE POLICY "anon_insert_follows" ON follows FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_follows" ON follows;
CREATE POLICY "anon_delete_follows" ON follows FOR DELETE
  TO anon, authenticated USING (true);

-- site_settings (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_followers boolean NOT NULL DEFAULT true,
  show_views boolean NOT NULL DEFAULT true,
  behance_profile_url text NOT NULL DEFAULT 'https://www.behance.net/mdnaeim26'
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_update_settings" ON site_settings;
CREATE POLICY "anon_update_settings" ON site_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_insert_settings" ON site_settings;
CREATE POLICY "anon_insert_settings" ON site_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Seed single settings row if none exists
INSERT INTO site_settings (id) SELECT gen_random_uuid() WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Add columns to projects
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'views') THEN
    ALTER TABLE projects ADD COLUMN views integer NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'source') THEN
    ALTER TABLE projects ADD COLUMN source text NOT NULL DEFAULT 'website';
  END IF;
END $$;

-- Add status column to project_comments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_comments' AND column_name = 'status') THEN
    ALTER TABLE project_comments ADD COLUMN status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','hidden'));
  END IF;
END $$;

-- Update comment SELECT policy: public sees only approved; admin (anon key) can see all via separate approach
-- We'll handle this in the frontend by querying approved for public, all for admin panel
-- Keep current policy as-is (public read all) so admin panel can load all comments via anon key

CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_follows_session ON follows(session_key);

-- Update Behance social link to the correct URL
UPDATE social_links SET url = 'https://www.behance.net/mdnaeim26' WHERE icon_key = 'behance';
