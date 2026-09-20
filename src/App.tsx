import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { FilterTabs } from './components/FilterTabs';
import { BehanceShowcase } from './components/BehanceShowcase';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { supabase, type Project, type BehanceProject } from './lib/supabase';
import { Lock, Plus, LogOut, X, Upload, Trash2, Loader2, Globe, Settings } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [behanceProjects, setBehanceProjects] = useState<BehanceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [language, setLanguage] = useState<'BN' | 'EN'>('EN');

  // Admin Settings State
  const [contactEmail, setContactEmail] = useState('contact@naeimvisual.com');
  const [contactPhone, setContactPhone] = useState('+880123456789');

  // Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Graphic Design');
  const [coverUrl, setCoverUrl] = useState('');
  const [behanceUrl, setBehanceUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');
  const [detailImages, setDetailImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // 1. Permanent Admin Login Check
    const savedAdmin = localStorage.getItem('isAdmin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: behData } = await supabase
        .from('behance_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projData) setProjects(projData);
      if (behData) setBehanceProjects(behData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'naim2026') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowLoginModal(false);
      setPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  const handleCreateOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const projectData = {
      title,
      category,
      cover_url: coverUrl,
      behance_url: behanceUrl || null,
      project_url: projectUrl || null,
      description: description || null,
      detail_images: detailImages
    };

    if (editingProject) {
      await supabase.from('projects').update(projectData).eq('id', editingProject.id);
    } else {
      await supabase.from('projects').insert([projectData]);
    }

    setUploading(false);
    setShowProjectModal(false);
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Graphic Design');
    setCoverUrl('');
    setBehanceUrl('');
    setProjectUrl('');
    setDescription('');
    setDetailImages([]);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-white">
      {/* Header Navigation & Admin Controls */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent">
            NAEIM VISUAL
          </h1>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="flex items-center gap-1 text-xs bg-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-700 transition"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'EN' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Admin Buttons */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { resetForm(); setShowProjectModal(true); }}
                  className="flex items-center gap-1 bg-cyan-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-400 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <Hero language={language} />

        {/* Filter Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 my-8">
          <FilterTabs 
            activeCategory={activeCategory} 
            onSelectCategory={setActiveCategory} 
          />
        </div>

        {/* Projects Display */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <ProjectGrid 
            projects={projects} 
            activeCategory={activeCategory}
            isAdmin={isAdmin}
            onEdit={(p) => { setEditingProject(p); setShowProjectModal(true); }}
            onDelete={async (id) => {
              if (confirm('Delete this project?')) {
                await supabase.from('projects').delete().eq('id', id);
                fetchData();
              }
            }}
          />

          {/* Behance Section */}
          {(activeCategory === 'All' || activeCategory === 'Behance') && (
            <div className="mt-12">
              <BehanceShowcase projects={behanceProjects} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer email={contactEmail} phone={contactPhone} />
      <WhatsAppWidget phone={contactPhone} />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Admin Access</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500"
              />
              {loginError && <p className="text-red-400 text-xs">Incorrect password!</p>}
              <button type="submit" className="w-full bg-cyan-500 text-slate-950 font-bold py-2 rounded-xl">
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg relative my-8">
            <button onClick={() => setShowProjectModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleCreateOrUpdateProject} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white"
              >
                <option value="Video Editing">Video Editing</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Meta Marketing">Meta Marketing</option>
              </select>
              <input
                type="url"
                placeholder="Cover Image URL"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl"
              />
              <input
                type="url"
                placeholder="Video Link (YouTube / Facebook) or Behance Link"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl"
              />
              <textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl h-24"
              />
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-cyan-500 text-slate-950 font-bold py-2 rounded-xl flex items-center justify-center gap-2"
              >
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingProject ? 'Update Project' : 'Publish Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
