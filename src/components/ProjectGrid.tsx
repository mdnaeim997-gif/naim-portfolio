import { useEffect, useState } from 'react';
import { supabase, type Project } from '../lib/supabase';
import { ProjectCard } from './ProjectCard';
import { FilterTabs, type TabKey } from './FilterTabs';
import { BehanceShowcase } from './BehanceShowcase';
import { type Lang, type Translation, translations, getStoredLang, subscribeLang } from '../lib/i18n';
import { RefreshCw, Loader2 } from 'lucide-react';

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState<TabKey>('all');
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>(getStoredLang());
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  useEffect(() => {
    const unsub = subscribeLang((l) => setLang(l));
    return unsub;
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
    // Auto-sync Behance on first load
    syncBehance();
  }, []);

  const syncBehance = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-behance`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        setSyncMsg(result.message || 'Sync complete');
        await loadProjects();
      }
    } catch {
      // Silent fail — local projects still show
    }
    setSyncing(false);
    setTimeout(() => setSyncMsg(''), 5000);
  };

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active);
  const t: Translation = translations[lang];

  return (
    <div>
      <FilterTabs active={active} onChange={setActive} />

      {/* Behance sync indicator */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={syncBehance}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-light text-xs text-slate-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
        >
          {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {syncing ? 'Syncing Behance...' : 'Sync Behance'}
        </button>
        {syncMsg && (
          <span className="text-xs text-emerald-400">{syncMsg}</span>
        )}
      </div>

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
