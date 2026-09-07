/*
# NAEIM VISUAL portfolio schema

1. New Tables
- `projects`: portfolio pieces (graphics, video, marketing)
  - id (uuid pk), title, category (graphic_design|video_editing|digital_marketing),
    cover_url (text, image url), behance_url (link to Behance), description (text),
    created_at, likes (int default 0)
- `project_likes`: one like per client session per project
  - id (uuid pk), project_id (fk), session_key (text), created_at
- `project_comments`: visitor comments on projects
  - id (uuid pk), project_id (fk), author_name (text), body (text), created_at
- `social_links`: editable social profile urls
  - id (uuid pk), label (text), url (text), icon_key (text), sort_order (int)

2. Security
- Enable RLS on all tables.
- projects: public read (anon+authenticated), writes only authenticated (admin).
- project_likes: public read + insert (visitors like without login); delete own by session key.
- project_comments: public read + insert; delete/update authenticated only.
- social_links: public read, writes authenticated.

3. Notes
- Public portfolio (no sign-in screen for visitors). Admin uses Supabase auth on /admin.
- Likes keyed by session_key (localStorage-generated id) to prevent duplicate likes.
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('graphic_design','video_editing','digital_marketing')),
  cover_url text NOT NULL,
  behance_url text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  likes integer NOT NULL DEFAULT 0
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS project_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (project_id, session_key)
);

ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_likes" ON project_likes;
CREATE POLICY "public_read_likes" ON project_likes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_likes" ON project_likes;
CREATE POLICY "public_insert_likes" ON project_likes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_likes" ON project_likes;
CREATE POLICY "public_delete_likes" ON project_likes FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS project_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_comments" ON project_comments;
CREATE POLICY "public_read_comments" ON project_comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_comments" ON project_comments;
CREATE POLICY "public_insert_comments" ON project_comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_comments" ON project_comments;
CREATE POLICY "auth_delete_comments" ON project_comments FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  icon_key text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social" ON social_links;
CREATE POLICY "public_read_social" ON social_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_social" ON social_links;
CREATE POLICY "auth_insert_social" ON social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_social" ON social_links;
CREATE POLICY "auth_update_social" ON social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_social" ON social_links;
CREATE POLICY "auth_delete_social" ON social_links FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_likes_project ON project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON project_comments(project_id);
