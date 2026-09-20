import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { FilterTabs } from './components/FilterTabs';
import { BehanceShowcase } from './components/BehanceShowcase';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { AdminModal } from './components/Admin';
import { supabase, type Project, type BehanceProject } from './lib/supabase';
import { Lock, Plus, LogOut, X, Upload, Trash2, Loader2 } from 'lucide-react';

export function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [behanceProjects, setBehanceProjects] = useState<BehanceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Project Modal State
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
    const sessionAdmin = sessionStorage.getItem('isAdmin');
    if (sessionAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, behanceRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('behance_projects').select('*').order('created_at', { ascending: false })
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (behanceRes.data) setBehanceProjects(behanceRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'naim2026') {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      setShowLoginModal(false);
      setPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('Graphic Design');
    setCoverUrl('');
    setBehanceUrl('');
    setProjectUrl('');
    setDescription('');
    setDetailImages([]);
    setFormError('');
    setShowProjectModal(true);
  };

  const openEditModal = async (project: Project) => {
    setEditingProject(project);
    setTitle(project.title || '');
    setCategory(project.category || 'Graphic Design');
    setCoverUrl(project.cover_url || '');
    setBehanceUrl(project.behance_url || '');
    setProjectUrl(project.project_url || project.behance_url || '');
    setDescription(project.description || '');
    setFormError('');

    const { data } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id)
      .order('sort_order', { ascending: true });

    if (data) setDetailImages(data);
    setShowProjectModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isCover) setUploadingCover(true);
    else setUploadingDetail(true);
    setFormError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath);

        if (isCover) {
          setCoverUrl(publicUrl);
          break;
        } else {
          setDetailImages((prev) => [
            ...prev,
            {
              id: `temp-${Date.now()}-${i}`,
              project_id: editingProject?.id || '',
              image_url: publicUrl,
              sort_order: prev.length + i,
            },
          ]);
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Error uploading image');
    } finally {
      if (isCover) setUploadingCover(false);
      else setUploadingDetail(false);
    }
  };

  const removeDetailImage = async (img: any) => {
    if (img.id && !img.id.startsWith('temp-')) {
      await supabase.from('project_images').delete().eq('id', img.id);
    }
    setDetailImages((prev) => prev.filter((d) => d !== img));
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    if (!coverUrl) {
      setFormError('Please upload a cover image.');
      setSaving(false);
      return;
    }

    const payload = {
      title,
      category,
      cover_url: coverUrl,
      behance_url: projectUrl || behanceUrl || 'https://www.behance.net/',
      project_url: projectUrl,
      description,
      source: 'website' as const,
    };

    let projectId = editingProject?.id;

    if (editingProject) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id);
      if (error) { setFormError(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from('projects').insert(payload).select('*').single();
      if (error) { setFormError(error.message); setSaving(false); return; }
      projectId = data.id;
    }

    const newImages = detailImages.filter((d) => d.id && d.id.startsWith('temp-'));
    if (projectId && newImages.length > 0) {
      await supabase.from('project_images').insert(
        newImages.map((img, i) => ({
          project_id: projectId,
          image_url: img.image_url,
          sort_order: i,
        }))
      );
    }

    setSaving(false);
    setShowProjectModal(false);
    fetchData();
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar Bar for Admin */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {isAdmin ? (
          <>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-full shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="p-2 bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-full backdrop-blur-md transition-colors"
            title="Admin Login"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>

      <main>
        <Hero />
        <FilterTabs activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        <ProjectGrid
          projects={projects}
          activeCategory={activeCategory}
          loading={loading}
          isAdmin={isAdmin}
          onEdit={openEditModal}
          onDelete={handleDeleteProject}
        />
        <BehanceShowcase projects={behanceProjects} />
      </main>

      <Footer />
      <WhatsAppWidget />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Admin Access</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
                {loginError && <p className="text-red-400 text-xs mt-1">Incorrect Password</p>}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h2 className="text-lg font-semibold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setShowProjectModal(false)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleProjectSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Project Title"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Motion Graphics">Motion Graphics</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Cover / Thumbnail Image</label>
                <div className="border-2 border-dashed border-slate-800 rounded-xl p-4 text-center bg-slate-900/50">
                  {coverUrl ? (
                    <div className="relative aspect-video max-w-xs mx-auto rounded-lg overflow-hidden border border-slate-700">
                      <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer py-2">
                      {uploadingCover ? <Loader2 className="w-6 h-6 animate-spin text-cyan-500" /> : <Upload className="w-6 h-6 text-slate-500 mb-1" />}
                      <span className="text-xs text-slate-400">Click to upload cover image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Detailed Images (4-5 showcase images)</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {detailImages.map((img, i) => (
                    <div key={img.id || i} className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 group">
                      <img src={img.image_url} alt="Detail" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeDetailImage(img)}
                        className="absolute top-1 right-1 p-1 bg-red-600/80 text-white rounded opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer text-xs font-medium text-slate-300">
                  {uploadingDetail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Add detail images</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e, false)} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Video Link (YouTube / Facebook) or Behance Link</label>
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => {
                    setProjectUrl(e.target.value);
                    setBehanceUrl(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://youtube.com/watch?v=... or Facebook video URL"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
