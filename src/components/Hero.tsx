import React from 'react';
import { Play, MessageCircle, Youtube, Facebook } from 'lucide-react';

interface HeroProps {
  language?: 'BN' | 'EN';
}

export function Hero({ language = 'BN' }: HeroProps) {
  const youtubeChannelUrl = "https://www.youtube.com/@MdNaeim-u8x";
  const behanceUrl = "https://www.behance.net";
  const facebookUrl = "https://facebook.com";
  const whatsappUrl = "https://wa.me/880123456789";

  return (
    <section className="relative py-20 overflow-hidden text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Profile Image with Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 animate-spin-slow blur-sm"></div>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
            alt="Naeim Profile"
            className="w-full h-full object-cover rounded-full relative z-10 border-2 border-slate-900"
          />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {language === 'BN' ? 'ফ্রিল্যান্স কাজের জন্য প্রস্তুত' : 'Available for Freelance & Projects'}
        </div>

        {/* Name Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
          NAEIM <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent">VISUAL</span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base font-medium mb-6">
          {language === 'BN' ? 'ভিজ্যুয়াল স্টোরিটেলার ও মেটা মার্কেটার' : 'Visual Storyteller & Meta Marketer'}
        </p>

        {/* Bio Text */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8 max-w-2xl mx-auto backdrop-blur-sm text-slate-300 text-xs md:text-sm leading-relaxed">
          {language === 'BN'
            ? 'হাই, আমি নাঈম — একজন ভিজ্যুয়াল স্টোরিটেলার এবং মেটা মার্কেটার। হাই-কোয়ালিটি ভিডিও এডিটিং, মোশন গ্রাফিক্স এবং টার্গেটেড ডিজিটাল ক্যাম্পেইনের মাধ্যমে আমি আপনার ব্র্যান্ডের ভিজ্যুয়াল রিচ বহুগুণ বাড়াতে কাজ করি।'
            : "Hi, I'm Naeim — a visual storyteller and Meta marketer crafting compelling designs, cinematic video edits, and high-converting digital campaigns. I help brands and creators stand out with visuals that connect and content that converts."}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <a
            href="#projects"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            {language === 'BN' ? 'আমার কাজসমূহ দেখুন' : 'Watch My Work'}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 text-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            {language === 'BN' ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat On WhatsApp'}
          </a>
        </div>

        {/* All Social Icons Together (YouTube, Behance, Facebook, WhatsApp) */}
        <div className="flex items-center justify-center gap-3">
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-red-500 hover:border-red-500 hover:scale-110 transition-all shadow-md"
            title="YouTube Channel"
          >
            <Youtube className="w-5 h-5 fill-current" />
          </a>
          <a
            href={behanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 hover:border-cyan-400 hover:scale-110 transition-all shadow-md font-bold text-xs"
            title="Behance Portfolio"
          >
            Be
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-blue-500 hover:border-blue-500 hover:scale-110 transition-all shadow-md"
            title="Facebook Profile"
          >
            <Facebook className="w-5 h-5 fill-current" />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 hover:border-emerald-400 hover:scale-110 transition-all shadow-md"
            title="WhatsApp Contact"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>

      </div>
    </section>
  );
}
