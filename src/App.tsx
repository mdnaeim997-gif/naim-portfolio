import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { FilterTabs } from './components/FilterTabs';
import { BehanceShowcase } from './components/BehanceShowcase';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { supabase, type Project, type BehanceProject } from './lib/supabase';
import { Plus, X, Upload, Loader2, Globe, Settings } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [behanceProjects, setBehanceProjects] = useState<BehanceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useState(true);
  const [language, setLanguage] = useState<'BN' | 'EN'>('BN');

  // Profile & Contact Settings
  const [contactEmail, setContactEmail] = useState('contact@naeimvisual.com');
  const [contactPhone, setContactPhone] = useState('+880123456789');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Graphic Design');
  const [coverUrl, setCoverUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
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
      alert(language === 'BN' ? 'ফাইল আপলোড ব্যর্থ হয়েছে!' : 'File upload failed!');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalCoverUrl = coverUrl;

    if (category === 'Video Editing' && projectUrl) {
      const autoThumb = getAutoThumbnail(projectUrl);
      if (autoThumb) finalCoverUrl = autoThumb;
    }

    const projectData = {
      title,
      category,
      cover_url: finalCoverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      project_url: projectUrl || null,
      description: description || null,
      detail_images: detailImages
    };

    if (category === 'Behance' || (projectUrl && projectUrl.includes('behance.net'))) {
      const behanceData = {
        title,
        cover_url: finalCoverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        behance_url: projectUrl,
        category: category
      };
      await supabase.from('behance_projects').insert([behanceData]);
    } else {
      if (editingProject) {
        await supabase.from('projects').update(projectData).eq('id', editingProject.id);
      } else {
        await supabase.from('projects').insert([projectData]);
      }
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
            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="flex items-center gap-1.5 text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold px-3 py-1.5 rounded-full hover:bg-cyan-500/20 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'EN' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Admin Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { resetForm(); setShowProjectModal(true); }}
                className="flex items-center gap-1 bg-cyan-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-400 text-sm shadow-md transition"
              >
                <Plus className="w-4 h-4" /> {language === 'BN' ? 'প্রজেক্ট যোগ করুন' : 'Add Project'}
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition"
                title={language === 'BN' ? 'সেটিংস' : 'Settings'}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <Hero language={language} />

        <div className="max-w-7xl mx-auto px-4 my-8">
          <FilterTabs activeCategory={activeCategory} onSelectCategory={setActiveCategory} language={language} />
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <ProjectGrid 
            projects={projects} 
            activeCategory={activeCategory}
            isAdmin={isAdmin}
            language={language}
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
              if (confirm(language === 'BN' ? 'প্রজেক্টটি মুছে ফেলতে চান?' : 'Delete this project?')) {
                await supabase.from('projects').delete().eq('id', id);
                fetchData();
              }
            }}
          />

          {(activeCategory === 'All' || activeCategory === 'Behance') && (
            <div className="mt-12">
              <BehanceShowcase projects={behanceProjects} language={language} />
            </div>
          )}
        </div>
      </main>

      <Footer email={contactEmail} phone={contactPhone} language={language} />
      <WhatsAppWidget phone={contactPhone} />

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md relative">
            <button onClick={() => setShowSettingsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{language === 'BN' ? 'পোর্টফোলিও সেটিংস' : 'Portfolio Settings'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'ইমেইল এড্রেস' : 'Email Address'}</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'ফোন / হোয়াটসঅ্যাপ' : 'Phone / WhatsApp'}</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-full bg-cyan-500 text-slate-950 font-bold py-2 rounded-xl hover:bg-cyan-400 transition"
              >
                {language === 'BN' ? 'সেভ করুন' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Upload Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg relative my-8">
            <button onClick={() => setShowProjectModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingProject 
                ? (language === 'BN' ? 'প্রজেক্ট এডিট করুন' : 'Edit Project') 
                : (language === 'BN' ? 'নতুন প্রজেক্ট যোগ করুন' : 'Add New Project')}
            </h2>
            
            <form onSubmit={handleCreateOrUpdateProject} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'ক্যাটাগরি সিলেক্ট করুন' : 'Select Category'}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="Graphic Design">{language === 'BN' ? 'গ্রাফিক ডিজাইন (গ্যালারি থেকে)' : 'Graphic Design (Gallery)'}</option>
                  <option value="Meta Marketing">{language === 'BN' ? 'ডিজিটাল মার্কেটিং (গ্যালারি থেকে)' : 'Meta Marketing (Gallery)'}</option>
                  <option value="Video Editing">{language === 'BN' ? 'ভিডিও এডিটিং (ইউটিউব/ফেসবুক লিংক)' : 'Video Editing (Video URL)'}</option>
                  <option value="Behance">{language === 'BN' ? 'বিহ্যান্স প্রজেক্ট' : 'Behance Project'}</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'টাইটেল (বাধ্যতামূলক)' : 'Project Title'}</label>
                <input
                  type="text"
                  placeholder={language === 'BN' ? 'প্রজেক্ট টাইটেল' : 'Project Title'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>

              {category === 'Video Editing' ? (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'ইউটিউব বা ফেসবুক ভিডিও লিংক' : 'YouTube or Facebook Video Link'}</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... বা https://fb.watch/..."
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500"
                  />
                  <p className="text-[10px] text-cyan-400 mt-1">
                    {language === 'BN' ? '* ইউটিউব/ফেসবুক ভিডিও লিংক দিলেই অরিজিনাল থাম্বনেইলসহ ভিডিও প্লেয়ার শো করবে।' : '* Thumbnail will load automatically from the link.'}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'গ্যালারি/মোবাইল/পিসি থেকে থাম্বনেইল কভার ফটো' : 'Cover Thumbnail from Gallery'}</label>
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
                        {coverUrl ? (language === 'BN' ? 'কভার ছবি সিলেক্ট হয়েছে!' : 'Cover Image Uploaded!') : (language === 'BN' ? 'গ্যালারি থেকে ছবি আপলোড করুন' : 'Choose Cover Image')}
                      </label>
                    </div>
                    {coverUrl && (
                      <img src={coverUrl} alt="Preview" className="mt-2 h-20 w-32 object-cover rounded-lg border border-slate-700" />
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'প্রজেক্টের অন্যান্য ইমেজ/ডিজাইন ফাইল' : 'More Project Images from Gallery'}</label>
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
                      <Plus className="w-4 h-4 text-cyan-400" /> {language === 'BN' ? '+ গ্যালারি থেকে একাধিক প্রজেক্ট ফাইল যুক্ত করুন' : '+ Add Multiple Images'}
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
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'বিবরণ (অপশনাল)' : 'Description (Optional)'}</label>
                <textarea
                  placeholder={language === 'BN' ? 'প্রজেক্টের বিবরণ...' : 'Write description...'}
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
                {editingProject ? (language === 'BN' ? 'আপডেট করুন' : 'Update Project') : (language === 'BN' ? 'পাবলিশ করুন' : 'Publish Project')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
