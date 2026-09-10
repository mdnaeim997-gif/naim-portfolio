import { useEffect, useState } from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { supabase, type SiteSettings, type Project } from '../lib/supabase';
import { type Lang, type Translation, translations, getStoredLang, subscribeLang } from '../lib/i18n';

const DEFAULT_BEHANCE_URL = 'https://www.behance.net/mdnaeim26';

export function BehanceShowcase() {
  const [lang, setLang] = useState<Lang>(getStoredLang());
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const unsub = subscribeLang((l) => setLang(l));
    return unsub;
  }, []);

  useEffect(() => {
    supabase.from('site_settings').select('*').maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
    supabase.from('projects').select('*').eq('source', 'behance').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setProjects(data); });
  }, []);

  const t: Translation = translations[lang];
  const behanceUrl = settings?.behance_profile_url || DEFAULT_BEHANCE_URL;
  const userName = behanceUrl.split('/').filter(Boolean).pop() || 'mdnaeim26';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <rect width="24" height="24" rx="4" fill="#1769FF" />
            <path d="M22 7h-7V5.5h7V7zm1.726 10c-.442 1.297-1.635 3-4.726 3-3.1 0-5.2-1.8-5.2-5.1 0-3.1 1.9-5.3 5-5.3 3.3 0 4.9 2.3 4.9 5.4v.7h-7.3c.1 1.3.7 2 2 2 1.1 0 1.6-.4 2-1.2l2.4.5zM9 5c2 0 3.5.7 4.2 1.8.7 1.1.8 2.4.8 3.7 0 1.5-.2 2.8-1.1 3.8-.9 1-2 1.4-3.5 1.4H2V5h7zm-.2 7c1.2 0 2.2-.5 2.2-2.4 0-1.9-1-2.3-2.3-2.3H4.5V12h4.3zM4.5 14.3V17h4.4c1.4 0 2.6-.4 2.6-2.4 0-1.9-1-2.3-2.4-2.3H4.5z" fill="#fff" />
          </svg>
          {t.work.behanceShowcase}
        </h3>
        <a href={behanceUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors">
          {t.work.viewProfile} <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Behance-linked projects from database */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {projects.map((p) => (
            <a key={p.id} href={p.behance_url || behanceUrl} target="_blank" rel="noopener noreferrer"
              className="group glass rounded-xl overflow-hidden hover:border-[#1769FF]/40 transition-all hover:-translate-y-1">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.cover_url} alt={p.title} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-white truncate">{p.title}</span>
                <ArrowUpRight className="w-4 h-4 text-[#1769FF] shrink-0" />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Behance profile embed card — since Behance blocks direct iframe embedding */}
      <div className="glass rounded-2xl overflow-hidden border border-[#1769FF]/20">
        <div className="bg-[#1769FF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path d="M22 7h-7V5.5h7V7zm1.726 10c-.442 1.297-1.635 3-4.726 3-3.1 0-5.2-1.8-5.2-5.1 0-3.1 1.9-5.3 5-5.3 3.3 0 4.9 2.3 4.9 5.4v.7h-7.3c.1 1.3.7 2 2 2 1.1 0 1.6-.4 2-1.2l2.4.5zM9 5c2 0 3.5.7 4.2 1.8.7 1.1.8 2.4.8 3.7 0 1.5-.2 2.8-1.1 3.8-.9 1-2 1.4-3.5 1.4H2V5h7zm-.2 7c1.2 0 2.2-.5 2.2-2.4 0-1.9-1-2.3-2.3-2.3H4.5V12h4.3zM4.5 14.3V17h4.4c1.4 0 2.6-.4 2.6-2.4 0-1.9-1-2.3-2.4-2.3H4.5z" fill="#fff" />
            </svg>
            <div>
              <p className="text-white font-semibold text-sm">@{userName}</p>
              <p className="text-blue-100 text-xs">Behance Portfolio</p>
            </div>
          </div>
          <a href={behanceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-[#1769FF] text-xs font-bold hover:scale-105 transition-transform">
            {t.work.viewProfile} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm text-slate-400 mb-4">
            {lang === 'bn'
              ? 'আমার সমস্ত বিহ্যান্স প্রজেক্ট দেখতে নিচের বাটনে ক্লিক করুন।'
              : 'Click below to view all my Behance projects in full resolution.'}
          </p>
          <a href={behanceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1769FF] text-white text-sm font-bold hover:scale-105 transition-transform glow-cyan">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22 7h-7V5.5h7V7zm1.726 10c-.442 1.297-1.635 3-4.726 3-3.1 0-5.2-1.8-5.2-5.1 0-3.1 1.9-5.3 5-5.3 3.3 0 4.9 2.3 4.9 5.4v.7h-7.3c.1 1.3.7 2 2 2 1.1 0 1.6-.4 2-1.2l2.4.5zM9 5c2 0 3.5.7 4.2 1.8.7 1.1.8 2.4.8 3.7 0 1.5-.2 2.8-1.1 3.8-.9 1-2 1.4-3.5 1.4H2V5h7zm-.2 7c1.2 0 2.2-.5 2.2-2.4 0-1.9-1-2.3-2.3-2.3H4.5V12h4.3zM4.5 14.3V17h4.4c1.4 0 2.6-.4 2.6-2.4 0-1.9-1-2.3-2.4-2.3H4.5z" fill="#fff" />
            </svg>
            {t.work.viewProfile}
          </a>
        </div>
      </div>
    </div>
  );
}
