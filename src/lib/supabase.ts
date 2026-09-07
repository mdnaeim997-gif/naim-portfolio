import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProjectCategory = 'graphic_design' | 'video_editing' | 'digital_marketing';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  cover_url: string;
  behance_url: string;
  description: string;
  created_at: string;
  likes: number;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon_key: string;
  sort_order: number;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export function getSessionKey(): string {
  let key = localStorage.getItem('naeim_session_key');
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem('naeim_session_key', key);
  }
  return key;
}
