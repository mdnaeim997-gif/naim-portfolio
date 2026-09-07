import { useEffect, useState } from 'react';
import { Play, MessageCircle, ArrowDown, Camera, Video, Wand2, Facebook } from 'lucide-react';
import {
  PremiereProIcon,
  PhotoshopIcon,
  IllustratorIcon,
  AfterEffectsIcon,
  MetaIcon,
  BehanceIcon,
} from '../lib/icons';
import { supabase, type SocialLink } from '../lib/supabase';

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

function socialIconFor(key: string) {
  if (key === 'behance') return BehanceIcon;
  if (key === 'facebook' || key === 'facebook-page') return Facebook;
  return MessageCircle;
}

export function Hero() {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    supabase
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setSocials(data);
      });
  }, []);

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
        <p className="font-display font-semibold text-lg sm:text-xl text-slate-300 mb-6">
          Visual Storyteller &amp; Meta Marketer
        </p>

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

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {socials.map((s) => {
            const Icon = socialIconFor(s.icon_key);
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl glass-light text-slate-400 hover:text-cyan-300 hover:border-cyan-400/30 transition-all hover:scale-110"
                aria-label={s.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Scroll hint */}
        <div className="mt-12 text-slate-500 animate-bounce">
          <ArrowDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
