import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { FilterTabs } from './components/FilterTabs';
import { BehanceShowcase } from './components/BehanceShowcase';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { supabase, type Project, type BehanceProject } from './lib/supabase';
import { Plus, X, Upload, Loader2, Globe, Settings, Monitor, Tablet, Smartphone, Mail, Send } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [behanceProjects, setBehanceProjects] = useState<BehanceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useState(true);
  const [language, setLanguage] = useState<'BN' | 'EN'>('BN');
  const [deviceView, setDeviceView] = useState<'default' | 'pc' | 'tablet' | 'mobile'>('default');

  // Admin Profile & Settings State
  const [contactEmail, setContactEmail] = useState('contact@naeimvisual.com');
  const [contactPhone, setContactPhone] = useState('01610977029');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop');
  const [profileBio, setProfileBio] = useState('হাই, আমি নাঈম — একজন ভিজ্যুয়াল স্টোরিটেলার এবং মেটা মার্কেটার।');
  const [showFollowButton, setShowFollowButton] = useState(true);

  // Contact Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State for Project Upload
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Video Editing');
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean, isProfile = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (isProfile) {
        const file = files[0];
        const fileName = `profile-${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('portfolio').upload(fileName, file);
        if (error) throw error;
        const { data: publicData } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        setProfileImage(publicData.publicUrl);
      } else if (isCover) {
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
      alert(language === 'BN' ? 'ফাইল আপলোড ব্যর্থ হয়েছে! Supabase Bucket Public করা আছে কিনা চেক করুন।' : 'File upload failed!');
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
      title: title || (category === 'Video Editing' ? 'Video Project' : 'New Project'),
      category,
      cover_url: finalCoverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
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

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);
    
    // Simulate sending to email (Opens mail client or triggers API)
    setTimeout(() => {
      window.location.href = `mailto:${contactEmail}?subject=Message from ${senderName}&body=${encodeURIComponent(senderMessage)}%0D%0A%0D%0AReply Email: ${senderEmail}`;
      setSendingEmail(false);
      setEmailSentSuccess(true);
      setSenderName('');
      setSenderEmail('');
      setSenderMessage('');
      setTimeout(() => setEmailSentSuccess(false), 5000);
    }, 1000);
  };

  // Device view container styling wrapper
  const getDeviceWrapperClass = () => {
    switch(deviceView) {
      case 'pc': return 'max-w-[1280px] mx-auto border-x-4 border-slate-800 shadow-2xl my-4 rounded-xl overflow-hidden';
      case 'tablet': return 'max-w-[768px] mx-auto border-x-4 border-slate-800 shadow-2xl my-4 rounded-xl overflow-hidden';
      case 'mobile': return 'max-w-[414px] mx-auto border-x-4 border-slate-800 shadow-2xl my-4 rounded-xl overflow-hidden';
      default: return 'w-full';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent">
            NAEIM VISUAL
          </h1>

          {/* Top Controls: Device Switcher, Language & Admin buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Device View Switcher */}
            <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <button 
                onClick={() => setDeviceView('pc')} 
                className={`p-1.5 rounded ${deviceView === 'pc' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                title="PC View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setDeviceView('tablet')} 
                className={`p-1.5 rounded ${deviceView === 'tablet' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setDeviceView('mobile')} 
                className={`p-1.5 rounded ${deviceView === 'mobile' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              {deviceView !== 'default' && (
                <button 
                  onClick={() => setDeviceView('default')} 
                  className="px-2 text-[10px] text-cyan-400 font-bold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="flex items-center gap-1 text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold px-3 py-1.5 rounded-full hover:bg-cyan-500/20 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'EN' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Add Project & Settings */}
            <button
              onClick={() => { resetForm(); setShowProjectModal(true); }}
              className="flex items-center gap-1 bg-cyan-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-400 text-xs shadow-md transition"
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
      </nav>

      {/* Main Container with Device View Simulation Support */}
      <div className={getDeviceWrapperClass()}>
        <main className="pt-20">
          <Hero 
            language={language} 
            profileImage={profileImage}
            profileBio={profileBio}
            showFollowButton={showFollowButton}
            whatsappPhone={contactPhone}
          />

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

          {/* Contact Me via Email Section */}
          <section className="py-16 bg-slate-900/50 border-t border-slate-800/80">
            <div className="max-w-xl mx-auto px-4">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl mb-3 border border-cyan-500/20">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">{language === 'BN' ? 'সরাসরি ইমেইলে যোগাযোগ করুন' : 'Get in Touch via Email'}</h2>
                <p className="text-slate-400 text-xs mt-1">
                  {language === 'BN' ? `আপনার বার্তা সরাসরি চলে যাবে: ${contactEmail}` : `Your message will be sent directly to ${contactEmail}`}
                </p>
              </div>

              {emailSentSuccess && (
                <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs text-center font-medium">
                  {language === 'BN' ? '✓ আপনার ইমেইল মেসেজ সফলভাবে পাঠানো হয়েছে!' : '✓ Email message sent successfully!'}
                </div>
              )}

              <form onSubmit={handleSendEmail} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'আপনার নাম' : 'Your Name'}</label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'BN' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'আপনার ইমেইল এড্রেস' : 'Your Email Address'}</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'আপনার বার্তা / প্রজেক্ট বিবরণ' : 'Your Message / Project Details'}</label>
                  <textarea
                    required
                    rows={4}
                    placeholder={language === 'BN' ? 'কী বিষয়ে কথা বলতে চান বিস্তারিত লিখুন...' : 'Write your message here...'}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition text-xs shadow-lg shadow-cyan-500/20"
                >
                  {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {language === 'BN' ? 'ইমেইল সেন্ড করুন' : 'Send Email Message'}
                </button>
              </form>
            </div>
          </section>
        </main>

        <Footer email={contactEmail} phone={contactPhone} language={language} />
        <WhatsAppWidget phone={contactPhone} />
      </div>

      {/* Admin Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setShowSettingsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{language === 'BN' ? 'অ্যাডমিন প্রোফাইল সেটিংস' : 'Admin & Profile Settings'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'প্রোফাইল পিকচার পরিবর্তন করুন' : 'Change Profile Picture'}</label>
                <div className="flex items-center gap-3">
                  <img src={profileImage} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false, true)}
                    className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-slate-950 file:font-bold cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'ফলো বাটন চালু/বন্ধ করুন' : 'Toggle Follow Button'}</label>
                <button
                  type="button"
                  onClick={() => setShowFollowButton(!showFollowButton)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold w-full transition ${showFollowButton ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}
                >
                  {showFollowButton 
                    ? (language === 'BN' ? '✓ ফলো বাটন সক্রিয় আছে' : '✓ Follow Button Visible') 
                    : (language === 'BN' ? '✕ ফলো বাটন বন্ধ করা আছে' : '✕ Follow Button Hidden')}
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'বায়ো বিবরণ' : 'Bio Description'}</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none h-20 text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'হোয়াটসঅ্যাপ নম্বর' : 'WhatsApp Number'}</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'ইমেইল এড্রেস' : 'Contact Email'}</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-full bg-cyan-500 text-slate-950 font-bold py-2.5 rounded-xl hover:bg-cyan-400 transition text-xs"
              >
                {language === 'BN' ? 'সেটিংস সেভ করুন' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal with Dual Options (Link + Gallery Upload) */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b1329] border border-slate-800 p-6 rounded-2xl w-full max-w-lg relative my-8 shadow-2xl">
            <button onClick={() => setShowProjectModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingProject 
                ? (language === 'BN' ? 'প্রজেক্ট এডিট করুন' : 'Edit Project') 
                : (language === 'BN' ? 'নতুন প্রজেক্ট যোগ করুন' : 'Add New Project')}
            </h2>
            
            <form onSubmit={handleCreateOrUpdateProject} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'ক্যাটাগরি সিলেক্ট করুন (প্রথমে ভিডিও, নিচে ডিজাইন ও মার্কেটিং)' : 'Select Category'}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#131e3a] border border-slate-700/80 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm font-medium"
                >
                  <option value="Video Editing">{language === 'BN' ? '1. ভিডিও এডিটিং (ইউটিউব/ফেসবুক লিংক বা গ্যালারি)' : '1. Video Editing (Link or Gallery)'}</option>
                  <option value="Graphic Design">{language === 'BN' ? '2. গ্রাফিক ডিজাইন (টাইটেল, কভার ও গ্যালারি ছবি)' : '2. Graphic Design (Gallery)'}</option>
                  <option value="Meta Marketing">{language === 'BN' ? '3. ডিজিটাল মার্কেটিং / মেটা ক্যাম্পেইন' : '3. Meta Marketing (Gallery)'}</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'প্রজেক্ট টাইটেল' : 'Project Title'}</label>
                <input
                  type="text"
                  placeholder={language === 'BN' ? 'প্রজেক্টের টাইটেল দিন' : 'Project Title'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#131e3a] border border-slate-700/80 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>

              {/* Dual Options for Video or General Project */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'অপশন ১: ভিডিও লিংক দিন (ইউটিউব/ফেসবুক)' : 'Option 1: Video URL Link'}</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... বা https://fb.watch/..."
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  className="w-full bg-[#131e3a] border border-slate-700/80 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>

              <div className="border-t border-slate-800 pt-3">
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'অপশন ২: গ্যালারি থেকে কভার থাম্বনেইল আপলোড করুন' : 'Option 2: Cover Thumbnail from Gallery'}</label>
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
                    className="w-full bg-[#131e3a] border border-dashed border-slate-700/80 hover:border-cyan-500/80 px-4 py-3 rounded-xl cursor-pointer text-center text-xs text-slate-300 flex items-center justify-center gap-2 transition"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" />
                    {coverUrl ? (language === 'BN' ? 'কভার ছবি সিলেক্ট হয়েছে!' : 'Cover Uploaded!') : (language === 'BN' ? 'গ্যালারি থেকে ছবি বাছুন' : 'Choose Cover Image')}
                  </label>
                </div>
                {coverUrl && (
                  <img src={coverUrl} alt="Preview" className="mt-2 h-16 w-28 object-cover rounded-lg border border-slate-700" />
                )}
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'গ্যালারি থেকে একাধিক প্রজেক্ট ফাইল/ছবি যোগ করুন' : 'More Project Images from Gallery'}</label>
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
                  className="w-full bg-[#131e3a] border border-dashed border-slate-700/80 hover:border-cyan-500/80 px-4 py-2.5 rounded-xl cursor-pointer text-center text-xs text-slate-300 flex items-center justify-center gap-2 transition"
                >
                  <Plus className="w-4 h-4 text-cyan-400" /> {language === 'BN' ? '+ গ্যালারি থেকে ছবি যোগ করুন' : '+ Add Multiple Images'}
                </label>

                {detailImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {detailImages.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} className="w-10 h-10 object-cover rounded-lg" />
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

              <div>
                <label className="text-xs text-slate-400 mb-1 block">{language === 'BN' ? 'বিবরণ (অপশনাল)' : 'Description (Optional)'}</label>
                <textarea
                  placeholder={language === 'BN' ? 'প্রজেক্টের বিবরণ লিখুন...' : 'Write description...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#131e3a] border border-slate-700/80 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm h-20"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#00c2e0] text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00a8c2] transition shadow-lg shadow-cyan-500/20 text-sm"
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
