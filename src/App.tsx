import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Mail, Phone, Globe, Heart, MessageSquare, 
  Share2, Camera, User, Settings, Check, X, Loader2, Play, 
  ExternalLink, Laptop, Tablet, Smartphone, Eye, Send, Code, ShieldCheck, Lock, Unlock 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [language, setLanguage] = useState<'BN' | 'EN'>('BN');
  
  // Security & Admin Authentication States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const ADMIN_SECRET_PASSWORD = 'NaeimVisual@2026#Secure'; // আপনি এখানে আপনার পছন্দমতো পাসওয়ার্ড পরিবর্তন করতে পারেন

  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Profile & Settings States
  const [profile, setProfile] = useState({
    name: 'Md Naeim',
    bio: 'হাই, আমি নাঈম — একজন ভিজুয়াল স্টোরিটেলার এবং মেটা মার্কেটার।',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    whatsapp: '01610977029',
    email: 'contact@naeimvisual.com',
    showFollowBtn: true
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Modal & Form States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const [category, setCategory] = useState('Video Editing');
  const [title, setTitle] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState(''); // Video Thumbnail for FB/YouTube preview
  const [coverUrl, setCoverUrl] = useState('');
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
      if (data) setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  // File Upload Helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'videoThumb' | 'gallery') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('portfolio').upload(fileName, file);
        
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        uploadedUrls.push(publicUrlData.publicUrl);
      }

      if (type === 'cover') {
        setCoverUrl(uploadedUrls[0]);
      } else if (type === 'videoThumb') {
        setVideoThumbnail(uploadedUrls[0]);
      } else {
        setDetailImages(prev => [...prev, ...uploadedUrls]);
      }
    } catch (error: any) {
      alert('ফাইল আপলোড ব্যর্থ হয়েছে: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const projectData = {
        title,
        category,
        project_url: category === 'Video Editing' ? projectUrl : '',
        cover_url: category === 'Video Editing' ? videoThumbnail : (category === 'Graphic Design' ? coverUrl : ''),
        detail_images: detailImages,
        description,
      };

      if (editingProject) {
        const { error } = await supabase.from('projects').update(projectData).eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([projectData]);
        if (error) throw error;
      }

      setShowProjectModal(false);
      resetForm();
      fetchProjects();
      alert(language === 'BN' ? 'প্রজেক্ট সফলভাবে সেভ হয়েছে!' : 'Project saved successfully!');
    } catch (error: any) {
      alert('ত্রুটি: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setTitle('');
    setProjectUrl('');
    setVideoThumbnail('');
    setCoverUrl('');
    setDetailImages([]);
    setDescription('');
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm(language === 'BN' ? 'আপনি কি প্রজেক্টটি ডিলিট করতে চান?' : 'Are you sure to delete?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_SECRET_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setAdminPasswordInput('');
      alert(language === 'BN' ? 'সফলভাবে অ্যাডমিন প্যানেলে প্রবেশ করেছেন!' : 'Logged in as Admin successfully!');
    } else {
      alert(language === 'BN' ? 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।' : 'Incorrect password!');
import React, { useState } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code, User, Briefcase, Send, ChevronRight } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // আপনার প্রজেক্টের তালিকা এখানে দেখতে ও যোগ করতে পারবেন
  const projects = [
    {
      title: "পোর্টফোলিও ওয়েবসাইট",
      description: "রিয়্যাক্ট এবং টাইপস্ক্রিপ্ট দিয়ে তৈরি আমার পার্সোনাল পোর্টফোলিও ওয়েবসাইট।",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      link: "#"
    },
    {
      title: "অন্যান্য প্রজেক্ট",
      description: "এখানে আপনার বাকি প্রজেক্টগুলোর বিবরণ যোগ করতে পারবেন।",
      tags: ["JavaScript", "HTML/CSS"],
      link: "#"
    }
  };
  ];

  return (
    <div className="bg-[#050b18] text-slate-100 min-h-screen font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <div className="bg-[#0b1329] border-b border-slate-800 px-4 py-2.5 flex flex-wrap justify-between items-center text-xs sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {isAdminLoggedIn ? (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 
              {language === 'BN' ? 'অ্যাডমিন মোড সচল' : 'Admin Mode Active'}
            </span>
          ) : (
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> 
              {language === 'BN' ? 'পাবলিক ভিউ (দর্শক মোড)' : 'Public View Mode'}
            </span>
          )}

          {!isAdminLoggedIn ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" /> {language === 'BN' ? 'অ্যাডমিন লগইন' : 'Admin Login'}
            </button>
          ) : (
            <button 
              onClick={() => setIsAdminLoggedIn(false)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" /> {language === 'BN' ? 'লগআউট / পাবলিক ভিউতে যান' : 'Logout to Public View'}
            </button>
          )}
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}><Laptop className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('tablet')} className={`p-1.5 rounded ${viewMode === 'tablet' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}><Tablet className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}><Smartphone className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setLanguage(language === 'BN' ? 'EN' : 'BN')} className="font-bold text-cyan-400 hover:underline">
            {language === 'BN' ? 'English' : 'বাংলা'}
          </button>
          {isAdminLoggedIn && (
            <button onClick={() => setShowSettingsModal(true)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg text-slate-300">
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Container Wrapper */}
      <div className={`mx-auto transition-all duration-300 ${
        viewMode === 'tablet' ? 'max-w-2xl border-x border-slate-800 my-4 shadow-2xl rounded-2xl overflow-hidden' :
        viewMode === 'mobile' ? 'max-w-sm border-x border-slate-800 my-4 shadow-2xl rounded-3xl overflow-hidden' : 'max-w-6xl'
      }`}>

        {/* Hero Section with Big Rotating Orbit Avatar */}
        <header className="py-16 px-6 text-center relative overflow-hidden flex flex-col items-center justify-center">
          
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 mb-6 flex items-center justify-center">
            {/* Rotating Orbit Skills Animation */}
            <div className="absolute inset-0 animate-spin-slow border border-cyan-500/20 rounded-full flex items-center justify-center pointer-events-none">
              <span className="absolute -top-3 bg-[#0b1329] text-cyan-400 border border-cyan-500/40 text-[10px] px-2 py-0.5 rounded-full shadow">Meta Ads</span>
              <span className="absolute -bottom-3 bg-[#0b1329] text-purple-400 border border-purple-500/40 text-[10px] px-2 py-0.5 rounded-full shadow">Premiere Pro</span>
              <span className="absolute -left-4 bg-[#0b1329] text-pink-400 border border-pink-500/40 text-[10px] px-2 py-0.5 rounded-full shadow">Photoshop</span>
              <span className="absolute -right-4 bg-[#0b1329] text-amber-400 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full shadow">After Effects</span>
              <span className="absolute top-1/4 -right-6 bg-[#0b1329] text-blue-400 border border-blue-500/40 text-[10px] px-2 py-0.5 rounded-full shadow">AI Tools</span>
              <span className="absolute bottom-1/4 -left-6 bg-[#0b1329] text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full shadow">Digital Mkt</span>
            </div>

            {/* Big Profile Avatar */}
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-44 h-44 sm:w-52 sm:h-52 rounded-full object-cover border-4 border-cyan-500/60 shadow-2xl shadow-cyan-500/30 z-10"
            />
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            নাঈম ইসলাম
          </h1>
          <div className="flex gap-6 text-sm font-medium">
            <button onClick={() => setActiveTab('home')} className={`hover:text-blue-400 transition ${activeTab === 'home' ? 'text-blue-400' : 'text-slate-400'}`}>হোম</button>
            <button onClick={() => setActiveTab('about')} className={`hover:text-blue-400 transition ${activeTab === 'about' ? 'text-blue-400' : 'text-slate-400'}`}>সম্পর্কে</button>
            <button onClick={() => setActiveTab('projects')} className={`hover:text-blue-400 transition ${activeTab === 'projects' ? 'text-blue-400' : 'text-slate-400'}`}>প্রজেক্টসমূহ</button>
            <button onClick={() => setActiveTab('contact')} className={`hover:text-blue-400 transition ${activeTab === 'contact' ? 'text-blue-400' : 'text-slate-400'}`}>যোগাযোগ</button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">{profile.name}</h1>
          <p className="text-slate-400 max-w-md text-sm sm:text-base mb-6 leading-relaxed">{profile.bio}</p>

          <div className="flex flex-wrap justify-center gap-3">
            <a 
              href={`https://wa.me/+88${profile.whatsapp}`} 
              target="_blank" 
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <Phone className="w-4 h-4" /> WhatsApp Chat
            </a>
            {profile.showFollowBtn && (
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition">
                {language === 'BN' ? 'ফলো করুন' : 'Follow'}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Home Section */}
        {activeTab === 'home' && (
          <div className="py-20 flex flex-col items-center text-center">
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
              ওয়েব ডেভেলপার ও ডিজাইনার
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              আসসালামু আলাইকুম, আমি <span className="text-blue-400">নাঈম ইসলাম</span>
            </h2>
            <p className="text-slate-400 max-w-2xl text-lg mb-8">
              আমি আধুনিক এবং রেসপন্সিভ ওয়েব অ্যাপ্লিকেশন তৈরি করতে ভালোবাস саме। গিটহাব এবং ভেরসেল ব্যবহার করে আমার প্রজেক্টগুলো ম্যানেজ করি।
            </p>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab('projects')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition flex items-center gap-2">
                প্রজেক্টগুলো দেখুন <ChevronRight size={18} />
              </button>
              <button onClick={() => setActiveTab('contact')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition">
                যোগাযোগ করুন
              </button>
            )}
          </div>
        </header>

        {/* Admin Action Bar */}
        {isAdminLoggedIn && (
          <div className="px-6 mb-8 flex justify-between items-center bg-[#0b1329] p-4 rounded-2xl border border-emerald-500/40 shadow-lg">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 
                {language === 'BN' ? 'অ্যাডমিন কন্ট্রোল প্যানেল সচল' : 'Admin Control Panel Active'}
              </h3>
              <p className="text-xs text-slate-400">{language === 'BN' ? 'এখান থেকে প্রজেক্ট যোগ বা ম্যানেজ করুন।' : 'Manage your portfolio projects securely.'}</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowProjectModal(true); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition"
            >
              <Plus className="w-4 h-4" /> {language === 'BN' ? 'নতুন প্রজেক্ট যোগ করুন' : 'Add New Project'}
            </button>
          </div>
        )}

        {/* Projects Grid Section */}
        <section className="px-6 pb-16">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-3">
            {language === 'BN' ? 'আমার প্রজেক্টসমূহ' : 'Featured Projects'}
          </h2>
        {/* About Section */}
        {activeTab === 'about' && (
          <div className="py-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <User className="text-blue-400" /> আমার সম্পর্কে
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              আমি একজন ফ্রন্টএন্ড ওয়েব ডেভেলপার। কোডিং এবং নতুন প্রযুক্তি নিয়ে কাজ করতে আমার ভালো লাগে। গিটহাব, ভেরসেল এবং আধুনিক ওয়েব টুলস ব্যবহার করে আমি আমার কাজগুলো পরিচালনা করে থাকি।
            </p>
          </div>
        )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-[#0b1329] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-cyan-500/50 transition group flex flex-col justify-between">
                
                <div>
                  {/* Category: Video Editing (Video Thumbnail Preview with Direct YouTube/Facebook Redirect Link) */}
                  {proj.category === 'Video Editing' ? (
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                      <img 
                        src={proj.cover_url || profile.avatar} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                        <a 
                          href={proj.project_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-red-600 hover:bg-red-500 text-white p-3.5 rounded-full shadow-2xl transition transform group-hover:scale-110 flex items-center justify-center"
                        >
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </a>
                      </div>
                      <span className="absolute bottom-3 left-3 text-xs bg-red-500 text-white font-bold px-2.5 py-1 rounded-md shadow">
                        Video Link
                      </span>
                    </div>
                  ) : (
                    /* Graphic Design & Meta Marketing */
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                      <img 
                        src={proj.cover_url || (proj.detail_images && proj.detail_images[0]) || profile.avatar} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute bottom-3 left-3 text-xs bg-purple-600 text-white font-bold px-2.5 py-1 rounded-md">
                        {proj.category}
        {/* Projects Section */}
        {activeTab === 'projects' && (
          <div className="py-12">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Briefcase className="text-blue-400" /> আমার প্রজেক্টসমূহ
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
                  <h4 className="text-xl font-bold mb-2 text-slate-100">{project.title}</h4>
                  <p className="text-slate-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tIndex) => (
                      <span key={tIndex} className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-blue-300 font-medium">
                        {tag}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-bold text-white text-base mb-1">{proj.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2">{proj.description || 'No description provided.'}</p>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                    লাইভ প্রিভিউ <ExternalLink size={14} />
                  </a>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4">
                  {proj.project_url ? (
                    <a href={proj.project_url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
                      {language === 'BN' ? 'ভিডিও দেখতে ক্লিক করুন' : 'Watch Video'} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : <span />}

                  {isAdminLoggedIn && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingProject(proj); setTitle(proj.title); setCategory(proj.category); setProjectUrl(proj.project_url || ''); setVideoThumbnail(proj.cover_url || ''); setCoverUrl(proj.cover_url || ''); setDetailImages(proj.detail_images || []); setDescription(proj.description || ''); setShowProjectModal(true); }} className="text-slate-400 hover:text-cyan-400 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProject(proj.id)} className="text-slate-400 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-[#0b1329] border-t border-slate-800 py-12 px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{language === 'BN' ? 'আমার সাথে যোগাযোগ করুন' : 'Get In Touch'}</h2>
            <p className="text-slate-400 text-xs mb-6">{language === 'BN' ? 'নিচের ফর্মটি পূরণ করে সরাসরি ইমেইল পাঠান।' : 'Fill out the form below to send an email.'}</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('ইমেইল সফলভাবে পাঠানো হয়েছে!'); setContactForm({ name: '', email: '', message: '' }); }} className="space-y-4 text-left">
              <input 
                type="text" 
                placeholder={language === 'BN' ? 'আপনার নাম' : 'Your Name'} 
                value={contactForm.name}
                onChange={e => setContactForm({...contactForm, name: e.target.value})}
                required
                className="w-full bg-[#131e3a] border border-slate-700 px-4 py-3 rounded-xl text-sm outline-none focus:border-cyan-500 text-white"
              />
              <input 
                type="email" 
                placeholder={language === 'BN' ? 'আপনার ইমেইল' : 'Your Email'} 
                value={contactForm.email}
                onChange={e => setContactForm({...contactForm, email: e.target.value})}
                required
                className="w-full bg-[#131e3a] border border-slate-700 px-4 py-3 rounded-xl text-sm outline-none focus:border-cyan-500 text-white"
              />
              <textarea 
                placeholder={language === 'BN' ? 'আপনার মেসেজ লিখুন...' : 'Your Message...'} 
                value={contactForm.message}
                onChange={e => setContactForm({...contactForm, message: e.target.value})}
                required
                className="w-full bg-[#131e3a] border border-slate-700 px-4 py-3 rounded-xl text-sm outline-none focus:border-cyan-500 text-white h-28"
              />
              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition">
                <Send className="w-4 h-4" /> {language === 'BN' ? 'মেসেজ পাঠান' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>

      </div>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-800 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-cyan-400">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">অ্যাডমিন পাসওয়ার্ড দিন</h2>
              <p className="text-xs text-slate-400">অ্যাডমিন প্যানেলে প্রবেশ করতে সিক্রেট পাসওয়ার্ড লিখুন।</p>
              ))}
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Secret Password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                required
                className="w-full bg-[#131e3a] border border-slate-700 px-4 py-3 rounded-xl text-white outline-none focus:border-cyan-500 text-sm text-center tracking-widest font-bold"
              />
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-cyan-500/20"
              >
                লগইন করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b1329] border border-slate-800 p-6 rounded-2xl w-full max-w-lg relative my-8 shadow-2xl">
            <button onClick={() => setShowProjectModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingProject ? 'প্রজেক্ট এডিট করুন' : 'নতুন প্রজেক্ট যোগ করুন'}
            </h2>
            
            <form onSubmit={handleCreateOrUpdateProject} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#131e3a] border border-slate-700 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm font-medium"
                >
                  <option value="Video Editing">Video Editing (Video Link & Thumbnail)</option>
                  <option value="Graphic Design">Graphic Design (Cover & Gallery)</option>
                  <option value="Meta Marketing">Meta Marketing (Gallery Images Only)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">প্রজেক্ট টাইটেল</label>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#131e3a] border border-slate-700 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>

              {/* Video Editing Fields: URL & Thumbnail */}
              {category === 'Video Editing' && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">YouTube / Facebook Video URL Link</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={projectUrl}
                      onChange={(e) => setProjectUrl(e.target.value)}
                      required
                      className="w-full bg-[#131e3a] border border-slate-700 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Video Thumbnail Image (ফটো আপলোড করুন)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'videoThumb')}
                      className="w-full bg-[#131e3a] border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-300"
                    />
                    {videoThumbnail && <img src={videoThumbnail} alt="Thumbnail Preview" className="mt-2 h-16 w-28 object-cover rounded-lg border border-slate-700" />}
                  </div>
                </>
              )}

              {category === 'Graphic Design' && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Cover Thumbnail Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'cover')}
                    className="w-full bg-[#131e3a] border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-300"
                  />
                  {coverUrl && <img src={coverUrl} alt="Cover Preview" className="mt-2 h-16 w-28 object-cover rounded-lg border border-slate-700" />}
                </div>
              )}

              {category !== 'Video Editing' && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Project Gallery Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'gallery')}
                    className="w-full bg-[#131e3a] border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-300"
                  />
                  {detailImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {detailImages.map((img, i) => (
                        <img key={i} src={img} className="w-10 h-10 object-cover rounded-lg border border-slate-700" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 mb-1 block">বিবরণ</label>
                <textarea
                  placeholder="Write description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#131e3a] border border-slate-700 px-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm h-20"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-400 transition text-sm"
              >
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingProject ? 'Update Project' : 'Publish Project'}
              </button>
            </form>
          </div>
        </div>
      )}
        )}

      {/* Admin Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-800 p-6 rounded-2xl w-full max-w-md relative">
            <button onClick={() => setShowSettingsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">অ্যাডমিন প্রোফাইল সেটিংস</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">প্রোফাইল নাম</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})} 
                  className="w-full bg-[#131e3a] border border-slate-700 px-4 py-2 rounded-xl text-sm text-white" 
                />
        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div className="py-12 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Send className="text-blue-400" /> যোগাযোগ করুন
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <Mail className="text-blue-400" />
                <span>mdnaeim977@gmail.com</span>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">হোয়াটসঅ্যাপ নম্বর</label>
                <input 
                  type="text" 
                  value={profile.whatsapp} 
                  onChange={e => setProfile({...profile, whatsapp: e.target.value})} 
                  className="w-full bg-[#131e3a] border border-slate-700 px-4 py-2 rounded-xl text-sm text-white" 
                />
              <div className="flex items-center gap-4 text-slate-300">
                <Github className="text-blue-400" />
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition">গিটহাব প্রোফাইল</a>
              </div>
              <button onClick={() => { setShowSettingsModal(false); alert('সেটিংস সেভ হয়েছে!'); }} className="w-full bg-cyan-500 text-black font-bold py-2.5 rounded-xl text-sm">
                সেটিংস সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>&copy; 2026 নাঈম ইসলাম। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}

export default App;
