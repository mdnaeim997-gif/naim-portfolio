import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { Project, ProjectImage } from '../lib/supabase';
import { type Lang, type Translation, translations, getStoredLang, subscribeLang } from '../lib/i18n';
import { useEffect } from 'react';
import { BehanceIcon } from '../lib/icons';

interface BehanceCardProps {
  project: Project;
  images: ProjectImage[];
}

export function BehanceCard({ project, images }: BehanceCardProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [index, setIndex] = useState(0);
  const [lang, setLang] = useState<Lang>(getStoredLang());

  useEffect(() => {
    const unsub = subscribeLang((l) => setLang(l));
    return unsub;
  }, []);

  const t: Translation = translations[lang];
  const allImages = [project.cover_url, ...images.map((i) => i.image_url)];

  return (
    <>
      <div
        className="group glass rounded-xl overflow-hidden cursor-pointer hover:border-[#1769FF]/40 transition-all hover:-translate-y-1"
        onClick={() => { setIndex(0); setShowLightbox(true); }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={project.cover_url} alt={project.title} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full bg-[#1769FF] text-white">
            {t.project.behance}
          </span>
          {allImages.length > 1 && (
            <span className="absolute bottom-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full glass-light text-slate-300">
              {allImages.length} {t.project.images}
            </span>
          )}
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-white truncate">{project.title}</span>
          <BehanceIcon className="w-5 h-5 shrink-0" />
        </div>
      </div>

      {/* Lightbox modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
            onClick={() => setShowLightbox(false)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Behance link */}
          {project.behance_url && (
            <a
              href={project.behance_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1769FF] text-white text-xs font-bold hover:scale-105 transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <BehanceIcon className="w-4 h-4" />
              {t.project.viewProject} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Main image */}
            <img
              src={allImages[index]}
              alt={`${project.title} ${index + 1}`}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />

            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-light flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-light flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Thumbnail strip */}
                <div className="flex gap-2 mt-4 justify-center flex-wrap max-h-24 overflow-y-auto">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        i === index ? 'border-cyan-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Title and description */}
            <h3 className="font-display font-bold text-lg text-white mt-4 text-center">{project.title}</h3>
            {project.description && (
              <p className="text-sm text-slate-400 text-center mt-1 max-w-2xl mx-auto">{project.description}</p>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <p className="text-xs text-slate-500 text-center mt-2">
                {index + 1} / {allImages.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
