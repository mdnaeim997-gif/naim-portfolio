/*
# Storage bucket for project cover images

1. Purpose
- Create a public storage bucket 'project-covers' for admin-uploaded images.
- Allow anon uploads/reads so the admin panel (no Supabase auth) can upload.

2. Security
- Public bucket: anyone can read (portfolio is public).
- Anon + authenticated can upload/update/delete (admin panel uses anon key).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-covers', 'project-covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_project_covers" ON storage.objects;
CREATE POLICY "public_read_project_covers" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'project-covers');

DROP POLICY IF EXISTS "anon_insert_project_covers" ON storage.objects;
CREATE POLICY "anon_insert_project_covers" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'project-covers');

DROP POLICY IF EXISTS "anon_update_project_covers" ON storage.objects;
CREATE POLICY "anon_update_project_covers" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'project-covers') WITH CHECK (bucket_id = 'project-covers');

DROP POLICY IF EXISTS "anon_delete_project_covers" ON storage.objects;
CREATE POLICY "anon_delete_project_covers" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'project-covers');
