import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="glass rounded-2xl p-5 w-72 animate-scale-in shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-sm">WhatsApp Chat</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Hi! Have a project in mind? Send me a message on WhatsApp and I'll get back to you quickly.
          </p>
          <a
            href="https://wa.me/8801000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:scale-[1.02] transition-transform"
          >
            <MessageCircle className="w-4 h-4" /> Start Chatting
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center glow-emerald hover:scale-110 transition-transform"
        aria-label="Open WhatsApp chat"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
        {open ? <X className="w-6 h-6 text-white relative" /> : <MessageCircle className="w-6 h-6 text-white relative" />}
      </button>
    </div>
  );
}
