import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { supabase, type SiteSettings, type Project, type ProjectImage } from '../lib/supabase';
import { type Lang, type Translation, translations, getStoredLang, subscribeLang } from '../lib/i18n';
import { BehanceIcon } from '../lib/icons';
import { BehanceCard } from './BehanceCard';

const DEFAULT_BEHANCE_URL = 'https://www.behance.net/mdnaeim26';

export function BehanceShowcase() {
  const [lang, setLang] = useState<Lang>(getStoredLang());
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allImages, setAllImages] = useState<Record<string, ProjectImage[]>>({});

  useEffect(() => {
    const unsub = subscribeLang((l) => setLang(l));
    return unsub;
  }, []);

  useEffect(() => {
    supabase.from('site_settings').select('*').maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
    (async () => {
      const { data: projs } = await supabase
        .from('projects')
        .select('*')
        .eq('source', 'behance')
        .order('created_at', { ascending: false });
      if (projs) {
        setProjects(projs);
        // Load images for each Behance project
        const imgMap: Record<string, ProjectImage[]> = {};
        for (const p of projs) {
          const { data: imgs } = await supabase
            .from('project_images')
            .select('*')
            .eq('project_id', p.id)
            .order('sort_order', { ascending: true });
          imgMap[p.id] = imgs || [];
        }
        setAllImages(imgMap);
      }
    })();
  }, []);

  const t: Translation = translations[lang];
  const behanceUrl = settings?.behance_profile_url || DEFAULT_BEHANCE_URL;
  const userName = behanceUrl.split('/').filter(Boolean).pop() || 'mdnaeim26';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
          <BehanceIcon className="w-6 h-6" />
          {t.work.behanceShowcase}
        </h3>
        <a href={behanceUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors">
          {t.work.viewProfile} <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Behance-synced project cards with lightbox */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {projects.map((p) => (
            <BehanceCard key={p.id} project={p} images={allImages[p.id] || []} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center mb-6 border border-[#1769FF]/20">
          <BehanceIcon className="w-10 h-10 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-2">
            {lang === 'bn'
              ? 'বিহ্যান্স প্রজেক্ট সিঙ্ক করা হচ্ছে... কিছুক্ষণ পরে আবার দেখুন বা "Sync Behance" বাটনে ক্লিক করুন।'
              : 'Syncing Behance projects... Check back shortly or click "Sync Behance" above.'}
          </p>
        </div>
      )}

      {/* Explore More on Behance banner */}
      <div className="glass rounded-2xl overflow-hidden border border-[#1769FF]/20">
        <div className="bg-[#1769FF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BehanceIcon className="w-7 h-7" />
            <div>
              <p className="text-white font-semibold text-sm">@{userName}</p>
              <p className="text-blue-100 text-xs">Behance Portfolio</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <a href={behanceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1769FF] text-white text-sm font-bold hover:scale-105 transition-transform glow-cyan">
            <BehanceIcon className="w-5 h-5" />
            {lang === 'bn' ? 'বিহ্যান্সে আরও দেখুন' : 'Explore More on Behance'}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
