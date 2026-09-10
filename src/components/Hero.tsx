import { useEffect, useState } from 'react';
import { Play, MessageCircle, ArrowDown, Camera, Video, Wand2, UserPlus, Eye } from 'lucide-react';
import {
  PremiereProIcon,
  PhotoshopIcon,
  IllustratorIcon,
  AfterEffectsIcon,
  MetaIcon,
  getSocialIcon,
} from '../lib/icons';
import { supabase, type SocialLink, type SiteSettings, getSessionKey } from '../lib/supabase';

const orbitIcons = [
  { Comp: PremiereProIcon, label: 'Premiere Pro', wrap: false },
  { Comp: PhotoshopIcon, label: 'Photoshop', wrap: false },
  { Comp: IllustratorIcon, label: 'Illustrator', wrap: false },
  { Comp: AfterEffectsIcon, label: 'After Effects', wrap: false },
  { Comp: MetaIcon, label: 'Meta', wrap: false },
  { Comp: Camera, label: 'Camera', wrap: true },
  { Comp: Video, label: 'Video', wrap: true },
  { Comp: Wand2, label: 'Magic Wand', wrap: true },
];

export function Hero() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [following, setFollowing] = useState(false);
  const sessionKey = getSessionKey();

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: st }, { count: fc }, { data: views }] = await Promise.all([
        supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
        supabase.from('site_settings').select('*').maybeSingle(),
        supabase.from('follows').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('views'),
      ]);
      if (s) setSocials(s);
      if (st) setSettings(st);
      if (fc !== null) setFollowerCount(fc);
      if (views) setTotalViews(views.reduce((sum, p) => sum + (p.views || 0), 0));

      const { data: existing } = await supabase
        .from('follows')
        .select('id')
        .eq('session_key', sessionKey)
        .maybeSingle();
      setFollowing(!!existing);
    })();
  }, [sessionKey]);

  const handleFollow = async () => {
    if (following) {
      await supabase.from('follows').delete().eq('session_key', sessionKey);
      setFollowing(false);
      setFollowerCount((c) => Math.max(0, c - 1));
    } else {
      const { error } = await supabase.from('follows').insert({ session_key: sessionKey });
      if (!error) {
        setFollowing(true);
        setFollowerCount((c) => c + 1);
      }
    }
  };

  return (
    <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Orbit */}
        <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] mb-8">
          <div className="absolute inset-0 animate-orbit">
            <div className="absolute inset-0 rounded-full border border-cyan-400/15" />
            <div className="absolute inset-4 rounded-full border border-purple-400/10" />
            {orbitIcons.map((icon, i) => {
              const angle = (i / orbitIcons.length) * 360;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-12 h-12"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-150px) rotate(-${angle}deg)`,
                  }}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl glass-light shadow-lg hover:scale-125 transition-transform duration-300">
                    {icon.wrap ? (
                      <icon.Comp className="w-6 h-6 text-cyan-300" />
                    ) : (
                      <icon.Comp className="w-7 h-7" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center profile */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 blur-xl animate-pulse-glow" />
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                  alt="NAEIM VISUAL"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-emerald-300">Available for Freelance & Projects</span>
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-2 tracking-tight">
          NAEIM <span className="text-gradient-cyan">VISUAL</span>
        </h1>
        <p className="font-display font-semibold text-lg sm:text-xl text-slate-300 mb-4">
          Visual Storyteller &amp; Meta Marketer
        </p>

        {/* Stats: followers + views */}
        <div className="flex items-center gap-4 mb-6">
          {settings?.show_followers && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-light">
              <UserPlus className="w-4 h-4 text-cyan-300" />
              <span className="text-sm font-semibold text-white">{followerCount}</span>
              <span className="text-xs text-slate-400">Followers</span>
            </div>
          )}
          {settings?.show_views && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-light">
              <Eye className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-semibold text-white">{totalViews.toLocaleString()}</span>
              <span className="text-xs text-slate-400">Total Views</span>
            </div>
          )}
        </div>

        {/* Follow button */}
        <button
          onClick={handleFollow}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all mb-6 ${
            following
              ? 'bg-slate-700/50 text-slate-300 border border-slate-600/40'
              : 'gradient-cyan text-white glow-cyan hover:scale-105'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          {following ? 'Following' : 'Follow'}
        </button>

        {/* Bilingual bio box */}
        <div className="glass rounded-2xl p-6 max-w-2xl mb-6 text-left space-y-3">
          <p className="text-sm leading-relaxed text-slate-300">
            Hi, I'm Naeim — a visual storyteller and Meta marketer crafting compelling designs,
            cinematic video edits, and high-converting digital campaigns. I help brands and creators
            stand out with visuals that connect and content that converts.
          </p>
          <div className="h-px bg-slate-700/40" />
          <p className="text-sm leading-relaxed text-slate-400" dir="rtl" lang="bn">
            নাম আমার নাঈম — আমি একজন ভিজ্যুয়াল স্টোরিটেলার এবং মেটা মার্কেটার।
            আমি আকর্ষণীয় ডিজাইন, সিনেম্যাটিক ভিডিও এডিট এবং হাই-কনভার্টিং ডিজিটাল
            ক্যাম্পেইন তৈরি করে ব্র্যান্ড ও ক্রিয়েটরদের আলাদা করে তুলি।
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-cyan text-white font-semibold glow-cyan hover:scale-105 transition-transform"
          >
            <Play className="w-5 h-5 fill-white" /> Watch My Work
          </button>
          <a
            href="https://wa.me/8801000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold glow-emerald hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5" /> Chat On WhatsApp
          </a>
        </div>

        {/* Social icons — always show brand-colored icons */}
        <div className="flex items-center gap-3">
          {socials.map((s) => {
            const Icon = getSocialIcon(s.icon_key);
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-xl glass-light hover:scale-110 transition-all shadow-lg"
                aria-label={s.label}
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}
          {/* Always show Behance link */}
          <a
            href={settings?.behance_profile_url || 'https://www.behance.net/mdnaeim26'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex items-center justify-center rounded-xl glass-light hover:scale-110 transition-all shadow-lg"
            aria-label="Behance"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <rect width="24" height="24" rx="4" fill="#1769FF" />
              <path d="M22 7h-7V5.5h7V7zm1.726 10c-.442 1.297-1.635 3-4.726 3-3.1 0-5.2-1.8-5.2-5.1 0-3.1 1.9-5.3 5-5.3 3.3 0 4.9 2.3 4.9 5.4v.7h-7.3c.1 1.3.7 2 2 2 1.1 0 1.6-.4 2-1.2l2.4.5zM9 5c2 0 3.5.7 4.2 1.8.7 1.1.8 2.4.8 3.7 0 1.5-.2 2.8-1.1 3.8-.9 1-2 1.4-3.5 1.4H2V5h7zm-.2 7c1.2 0 2.2-.5 2.2-2.4 0-1.9-1-2.3-2.3-2.3H4.5V12h4.3zM4.5 14.3V17h4.4c1.4 0 2.6-.4 2.6-2.4 0-1.9-1-2.3-2.4-2.3H4.5z" fill="#fff" />
            </svg>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-12 text-slate-500 animate-bounce">
          <ArrowDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
