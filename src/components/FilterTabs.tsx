import { type Lang, type Translation, translations, getStoredLang, subscribeLang } from '../lib/i18n';
import { useEffect, useState } from 'react';
import { type TabKey } from './FilterTabs';

interface FilterTabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  const [lang, setLang] = useState<Lang>(getStoredLang());

  useEffect(() => {
    const unsub = subscribeLang((l) => setLang(l));
    return unsub;
  }, []);

  const t: Translation = translations[lang];

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: t.work.all },
    { key: 'graphic_design', label: t.work.graphicDesign },
    { key: 'video_editing', label: t.work.videoEditing },
    { key: 'digital_marketing', label: t.work.digitalMarketing },
  ];

  return (
    <div id="projects" className="scroll-mt-8">
      <div className="flex items-center justify-center mb-8">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
          {t.work.heading} <span className="text-gradient-cyan">{t.work.headingAccent}</span>
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === tab.key
                ? 'gradient-cyan text-white glow-cyan'
                : 'glass-light text-slate-400 hover:text-white hover:border-cyan-400/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
