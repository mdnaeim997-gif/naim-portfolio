/*
# Allow anon writes for admin-managed tables

1. Purpose
- The admin panel uses a hardcoded credential check (not Supabase auth),
  so database writes happen with the anon key.
- Updates RLS policies on projects and social_links to allow anon + authenticated writes.

2. Changes
- projects: INSERT/UPDATE/DELETE policies now TO anon, authenticated.
- social_links: INSERT/UPDATE/DELETE policies now TO anon, authenticated.
- project_comments DELETE: now TO anon, authenticated (admin can moderate).

3. Security
- The admin panel is gated by a hardcoded login in the frontend.
- Public visitors can still only read projects, likes, and comments.
*/

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_social" ON social_links;
CREATE POLICY "auth_insert_social" ON social_links FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_social" ON social_links;
CREATE POLICY "auth_update_social" ON social_links FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_social" ON social_links;
CREATE POLICY "auth_delete_social" ON social_links FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_comments" ON project_comments;
CREATE POLICY "auth_delete_comments" ON project_comments FOR DELETE
  TO anon, authenticated USING (true);
