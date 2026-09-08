/*
# Ensure admin user exists with correct password

1. Purpose
- Idempotently inserts the admin user mdnaeim997@gmail.com if not present,
  or updates the password if the user already exists.
- Password is set to the agreed admin credential.

2. Approach
- Uses a DO block to check whether the user exists by email.
- If not found: inserts into auth.users with bcrypt-hashed password.
- If found: updates encrypted_password and updated_at.
- Email confirmation is set so login works immediately.

3. Security
- No RLS changes — auth.users is managed by Supabase internally.
- This migration is safe to re-run.
*/

DO $$
DECLARE
  existing_user uuid;
BEGIN
  SELECT id INTO existing_user FROM auth.users WHERE email = 'mdnaeim997@gmail.com';

  IF existing_user IS NULL THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      aud,
      role,
      raw_app_meta_data,
      raw_user_meta_data,
      confirmation_token,
      email_change_token_current
    ) VALUES (
      gen_random_uuid(),
      'mdnaeim997@gmail.com',
      crypt('naeim@#%', gen_salt('bf')),
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{}',
      '',
      ''
    );
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt('naeim@#%', gen_salt('bf')),
        updated_at = now(),
        email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = existing_user;
  END IF;
END $$;
