import { useEffect, useState } from 'react';
import { supabase, type Project } from '../lib/supabase';
import { ProjectCard } from './ProjectCard';
import { FilterTabs, type TabKey } from './FilterTabs';
import { BehanceShowcase } from './BehanceShowcase';
import { type Lang, type Translation, translations, getStoredLang, subscribeLang } from '../lib/i18n';

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState<TabKey>('all');
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>(getStoredLang());

  useEffect(() => {
    const unsub = subscribeLang((l) => setLang(l));
    return unsub;
  }, []);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setProjects(data);
        setLoading(false);
      });
  }, []);

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active);
  const t: Translation = translations[lang];

  return (
    <div>
      <FilterTabs active={active} onChange={setActive} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-base-700/50" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-2/3 rounded bg-base-700/50" />
                <div className="h-4 w-full rounded bg-base-700/40" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">{t.work.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Behance showcase module — always visible below the project grid */}
      <div className="mt-16">
        <BehanceShowcase />
      </div>
    </div>
  );
}
