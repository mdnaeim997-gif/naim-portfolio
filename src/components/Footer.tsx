import { useState } from 'react';
import { Mail, Phone, Send, MapPin } from 'lucide-react';

export function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    // Open default mail client with pre-filled content
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:naeimvisual@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <footer className="relative border-t border-slate-700/30 mt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
            Contact Me
          </h2>
          <p className="text-slate-400">Get In Touch — let's create something great together</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Contact info */}
          <div className="space-y-5">
            <a
              href="tel:+8801000000000"
              className="flex items-center gap-4 glass rounded-xl p-4 hover:border-cyan-400/30 transition-all group"
            >
              <div className="w-11 h-11 rounded-lg gradient-cyan flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                  +880 1000 000000
                </p>
              </div>
            </a>

            <a
              href="mailto:naeimvisual@gmail.com"
              className="flex items-center gap-4 glass rounded-xl p-4 hover:border-cyan-400/30 transition-all group"
            >
              <div className="w-11 h-11 rounded-lg gradient-cyan flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                  naeimvisual@gmail.com
                </p>
              </div>
            </a>

            <div className="flex items-center gap-4 glass rounded-xl p-4">
              <div className="w-11 h-11 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm font-medium text-white">Bangladesh — Remote Worldwide</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
            {sent && (
              <div className="px-4 py-3 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm">
                Your email client should have opened. If not, email me directly at naeimvisual@gmail.com
              </div>
            )}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-300 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-cyan text-white font-semibold hover:scale-[1.02] transition-transform"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-700/30 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} NAEIM VISUAL — Visual Storyteller & Meta Marketer
          </p>
          <a href="/admin" className="text-xs text-slate-600 hover:text-slate-400 transition-colors mt-2 inline-block">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
