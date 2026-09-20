import { useEffect, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
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
        .order('created_at', { ascending: false });
      if (projs) {
        setProjects(projs);
        projs.forEach(async (p) => {
          const { data: imgs } = await supabase
            .from('project_images')
            .select('*')
            .eq('project_id', p.id)
            .order('sort_order', { ascending: true });
          if (imgs) {
            setAllImages((prev) => ({ ...prev, [p.id]: imgs }));
          }
        });
      }
    })();
  }, []);

  const t: Translation = translations[lang];

  // Helper function to extract YouTube Thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url ? url.match(regExp) : null;
    return (match && match[2].length === 11)
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
      : null;
  };

  return (
    <>
      {projects.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-[#1769FF] animate-pulse" />
                  <span className="text-xs font-mono tracking-widest text-[#1769FF] uppercase">
                    {t.behanceShowcaseTag}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {t.behanceShowcaseTitle}
                </h2>
                <p className="mt-2 text-muted-foreground text-sm max-w-md">
                  {t.behanceShowcaseSubtitle}
                </p>
              </div>

              <a
                href={settings?.behance_url || DEFAULT_BEHANCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#1769FF]/10 hover:bg-[#1769FF] text-[#1769FF] hover:text-white transition-all duration-300 text-sm font-medium border border-[#1769FF]/20 group self-start md:self-auto"
              >
                <BehanceIcon className="w-4 h-4" />
                <span>{t.viewBehanceProfile}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const ytThumb = project.project_url ? getYouTubeThumbnail(project.project_url) : null;

                return (
                  <div key={project.id} className="relative group rounded-xl overflow-hidden bg-card border border-border">
                    {/* If Project has external video link */}
                    {project.project_url ? (
                      <a 
                        href={project.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block relative aspect-video overflow-hidden group/video"
                      >
                        <img 
                          src={ytThumb || project.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/video:bg-black/20 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      </a>
                    ) : (
                      /* Default Behance Showcase */
                      <BehanceCard
                        project={project}
                        images={allImages[project.id] || []}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
