import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { FilterTabs } from './components/FilterTabs';
import { BehanceShowcase } from './components/BehanceShowcase';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { supabase, type Project, type BehanceProject } from './lib/supabase';
import { Lock, Plus, LogOut, X, Upload, Loader2, Globe, Youtube } from 'lucide-react';

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

  const [contactEmail] = useState('contact@naeimvisual.com');
  const [contactPhone] = useState('+880123456789');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Video Editing');
  const [coverUrl, setCoverUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const youtubeChannelUrl = "https://www.youtube.com/@MdNaeim-u8x";

  useEffect(() => {
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

  const getAutoThumbnail = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2]) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
    return '';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (isCover) {
        const file = files[0];
        const fileName = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('portfolio').upload(fileName, file);
        if (error) throw error;
        const { data: publicData } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        setCoverUrl(publicData.publicUrl);
      } else {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from('portfolio').upload(fileName, file);
          if (error) throw error;
          const { data: publicData } = supabase.storage.from('portfolio').getPublicUrl(fileName);
          uploadedUrls.push(publicData.publicUrl);
        }
        setDetailImages([...detailImages, ...uploadedUrls]);
      }
    } catch (error) {
      console.error(error);
      alert('ফাইল আপলোড করতে সমস্যা হয়েছে!');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalCoverUrl = coverUrl;
    if (!finalCoverUrl && projectUrl) {
      finalCoverUrl = getAutoThumbnail(projectUrl);
    }

    const projectData = {
      title,
      category,
      cover_url: finalCoverUrl || 'https://img.youtube.com/vi/default/hqdefault.jpg',
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
    setCategory('Video Editing');
    setCoverUrl('');
    setProjectUrl('');
    setDescription('');
    setDetailImages([]);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent">
            NAEIM VISUAL
          </h1>

          <div className="flex items-center gap-3">
            {/* Youtube Channel Social Icon */}
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-800 rounded-full flex items-center justify-center"
              title="Visit YouTube Channel"
            >
              <Youtube className="w-5 h-5 text-red-500 fill-current" />
            </a>

            <button 
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="flex items-center gap-1 text-xs bg-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-700 transition"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'EN' ? 'বাংলা' : 'English'}</span>
            </button>

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
              <button onClick={() => setShowLoginModal(true)} className="p-2 text-slate-400 hover:text-white">
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <Hero language={language} />

        <div className="max-w-7xl mx-auto px-4 my-8">
          <FilterTabs activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <ProjectGrid 
            projects={projects} 
            activeCategory={activeCategory}
            isAdmin={isAdmin}
            onEdit={(p) => { 
              setEditingProject(p); 
              setTitle(p.title);
              setCategory(p.category);
              setCoverUrl(p.cover_url);
              setProjectUrl(p.project_url || '');
              setDescription(p.description || '');
              setDetailImages(p.detail_images || []);
              setShowProjectModal(true); 
            }}
            onDelete={async (id) => {
              if (confirm('প্রজেক্টটি মুছে ফেলতে চান?')) {
                await supabase.from('projects').delete().eq('id', id);
                fetchData();
              }
            }}
          />

          {(activeCategory === 'All' || activeCategory === 'Behance') && (
            <div className="mt-12">
              <BehanceShowcase projects={behanceProjects} />
            </div>
          )}
        </div>
      </main>

      <Footer email={contactEmail} phone={contactPhone} />
      <WhatsAppWidget phone={contactPhone} />

      {/* Admin Login Modal */}
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
              {loginError && <p className="text-red-400 text-xs">ভুল পাসওয়ার্ড!</p>}
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
              <div>
                <label className="text-xs text-slate-400 mb-1 block">ক্যাটাগরি সিলেক্ট করুন</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500"
                >
                  <option value="Video Editing">Video Editing</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Meta Marketing">Meta Marketing</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Title (শিরোনাম)</label>
                <input
                  type="text"
                  placeholder="প্রজেক্ট টাইটেল"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>

              {category === 'Video Editing' ? (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Video Link (YouTube / Facebook)</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=... অথবা https://youtu.be/..."
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500"
                  />
                  <p className="text-[10px] text-cyan-400 mt-1">
                    * ভিডিওর থাম্বনেইল অরিজিনাল লিংক থেকে অটোমেটিক শো করবে।
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">মূল থাম্বনেইল ছবি (গ্যালারি থেকে)</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, true)}
                        className="hidden"
                        id="cover-file-input"
                      />
                      <label
                        htmlFor="cover-file-input"
                        className="flex-1 bg-slate-800 border border-dashed border-slate-600 hover:border-cyan-500 px-4 py-3 rounded-xl cursor-pointer text-center text-sm text-slate-300 flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-cyan-400" />
                        {coverUrl ? 'থাম্বনেইল আপলোড হয়েছে!' : 'গ্যালারি থেকে থাম্বনেইল সিলেক্ট করুন'}
                      </label>
                    </div>
                    {coverUrl && (
                      <img src={coverUrl} alt="Preview" className="mt-2 h-20 w-32 object-cover rounded-lg border border-slate-700" />
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">অন্যান্য ছবিসমূহ (গ্যালারি থেকে একাধিক ছবি)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                      id="detail-files-input"
                    />
                    <label
                      htmlFor="detail-files-input"
                      className="w-full bg-slate-800 border border-dashed border-slate-600 hover:border-cyan-500 px-4 py-2 rounded-xl cursor-pointer text-center text-sm text-slate-300 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-cyan-400" /> + গ্যালারি থেকে আরও ছবি আপলোড করুন
                    </label>

                    {detailImages.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {detailImages.map((url, idx) => (
                          <div key={idx} className="relative">
                            <img src={url} className="w-12 h-12 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => setDetailImages(detailImages.filter((_, i) => i !== idx))}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description (অপশনাল)</label>
                <textarea
                  placeholder="প্রজেক্টের বিবরণ লিখুন..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none h-20"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-cyan-500 text-slate-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-400 transition"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editingProject ? 'Update Project' : 'Publish Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
