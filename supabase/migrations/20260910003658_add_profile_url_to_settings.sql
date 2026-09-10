/*
# Add profile picture URL to site_settings

1. Modified Tables
- `site_settings`: ADD COLUMN profile_url (text, nullable) — stores the admin-uploaded profile photo URL.

2. Security
- No new policies needed; existing anon+authenticated CRUD policies on site_settings cover the new column.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'profile_url') THEN
    ALTER TABLE site_settings ADD COLUMN profile_url text;
  END IF;
END $$;
