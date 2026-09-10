import { useEffect, useState } from 'react';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { LanguageToggle } from './components/LanguageToggle';
import { Admin } from './components/Admin';

const ADMIN_FLAG_KEY = 'naeim_admin_authed';

function App() {
  const [authed, setAuthed] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    setAuthed(localStorage.getItem(ADMIN_FLAG_KEY) === 'true');
    setAuthReady(true);

    const onLogin = () => setAuthed(localStorage.getItem(ADMIN_FLAG_KEY) === 'true');
    window.addEventListener('naeim-admin-login', onLogin);
    return () => window.removeEventListener('naeim-admin-login', onLogin);
  }, []);

  if (isAdminRoute) {
    if (!authReady) return null;
    return <Admin session={authed} />;
  }

  return (
    <div className="relative min-h-screen bg-base-900 text-slate-200 overflow-hidden">
      {/* Ambient radial glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      {/* Top nav bar with language toggle */}
      <div className="relative z-20 flex justify-end px-4 sm:px-6 pt-4">
        <LanguageToggle />
      </div>

      <div className="relative z-10">
        <Hero />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <ProjectGrid />
        </main>
        <Footer />
      </div>

      <WhatsAppWidget />
    </div>
  );
}

export default App;
