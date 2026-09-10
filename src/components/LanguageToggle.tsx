import { useState } from 'react';
import { Languages } from 'lucide-react';
import { type Lang, getStoredLang, setStoredLang } from '../lib/i18n';

export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>(getStoredLang());

  const toggle = () => {
    const next: Lang = lang === 'en' ? 'bn' : 'en';
    setStoredLang(next);
    setLang(next);
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-light text-xs font-semibold transition-all hover:scale-105"
      aria-label="Toggle language"
    >
      <Languages className="w-3.5 h-3.5 text-cyan-300" />
      <span className={lang === 'en' ? 'text-cyan-300' : 'text-slate-500'}>EN</span>
      <span className="text-slate-600">|</span>
      <span className={lang === 'bn' ? 'text-cyan-300' : 'text-slate-500'}>BN</span>
    </button>
  );
}
