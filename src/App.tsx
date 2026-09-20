import React, { useState } from 'react';
import { Github, Facebook, Youtube, Mail, ExternalLink, User, Briefcase, Image as ImageIcon, TrendingUp, Send, ChevronRight, Play } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // ১. প্রজেক্ট প্যানেলের ডাটা
  const projects = [
    {
      title: "ওয়েব ডেভেলপমেন্ট প্রজেক্ট ১",
      description: "রিয়্যাক্ট এবং টেলউইড সিএসএস দিয়ে তৈরি আধুনিক পোর্টফোলিও ওয়েবসাইট।",
      tags: ["React", "Tailwind CSS"],
      link: "https://github.com"
    }
  ];

  // ২. ইউটিউব ও ফেসবুক ভিডিওর তালিকা (থাম্বনেইল ও লিংক সহ)
  const socialVideos = [
    {
      title: "আমার ইউটিউব প্লেলিস্ট বা ভিডিও",
      platform: "YouTube",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80",
      link: "https://www.youtube.com"
    },
    {
      title: "ফেসবুক ভিডিও বা কন্টেন্ট",
      platform: "Facebook",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8d57fbe?w=600&auto=format&fit=crop&q=80",
      link: "https://facebook.com"
    }
  ];

  // ৩. গ্রাফিক্স ডিজাইন গ্যালারি
  const graphicsImages = [
    "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            নাঈম ইসলাম
          </h1>
          <div className="flex gap-6 text-sm font-medium">
            <button onClick={() => setActiveTab('home')} className={`hover:text-blue-400 transition ${activeTab === 'home' ? 'text-blue-400' : 'text-slate-400'}`}>হোম</button>
            <button onClick={() => setActiveTab('projects')} className={`hover:text-blue-400 transition ${activeTab === 'projects' ? 'text-blue-400' : 'text-slate-400'}`}>প্রজেক্টস</button>
            <button onClick={() => setActiveTab('videos')} className={`hover:text-blue-400 transition ${activeTab === 'videos' ? 'text-blue-400' : 'text-slate-400'}`}>ভিডিওজ</button>
            <button onClick={() => setActiveTab('graphics')} className={`hover:text-blue-400 transition ${activeTab === 'graphics' ? 'text-blue-400' : 'text-slate-400'}`}>গ্রাফিক্স ডিজাইন</button>
            <button onClick={() => setActiveTab('marketing')} className={`hover:text-blue-400 transition ${activeTab === 'marketing' ? 'text-blue-400' : 'text-slate-400'}`}>ডিজিটাল মার্কেটিং</button>
            <button onClick={() => setActiveTab('contact')} className={`hover:text-blue-400 transition ${activeTab === 'contact' ? 'text-blue-400' : 'text-slate-400'}`}>যোগাযোগ</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Home Section */}
        {activeTab === 'home' && (
          <div className="py-20 flex flex-col items-center text-center">
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
              ওয়েব ডেভেলপার, ডিজাইনার ও মার্কেটার
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              আসসালামু আলাইকুম, আমি <span className="text-blue-400">নাঈম ইসলাম</span>
            </h2>
            <p className="text-slate-400 max-w-2xl text-lg mb-8">
              আমার প্রফেশনাল পোর্টফোলিও সাইটে স্বাগতম। এখানে আমার ওয়েব প্রজেক্ট, ভিডিও কন্টেন্ট, গ্রাফিক্স ডিজাইন এবং ডিজিটাল মার্কেটিংয়ের কাজগুলো দেখতে পাবেন।
            </p>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab('projects')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition flex items-center gap-2">
                প্রজেক্টগুলো দেখুন <ChevronRight size={18} />
              </button>
              <button onClick={() => setActiveTab('contact')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition">
                যোগাযোগ করুন
              </button>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <div className="py-12">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Briefcase className="text-blue-400" /> প্রজেক্ট প্যানেল
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg">
                  <h4 className="text-xl font-bold mb-2 text-slate-100">{project.title}</h4>
                  <p className="text-slate-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tIndex) => (
                      <span key={tIndex} className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-blue-300 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl text-sm font-medium transition border border-blue-500/30">
                    লাইভ প্রিভিউ <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {activeTab === 'videos' && (
          <div className="py-12">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Youtube className="text-red-500" /> ইউটিউব ও ফেসবুক ভিডিও
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {socialVideos.map((video, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative aspect-video">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <a href={video.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                      <Play className="text-white w-12 h-12 fill-white" />
                    </a>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{video.platform}</span>
                    <h4 className="text-lg font-bold mt-1 text-slate-100">{video.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graphics Design Section */}
        {activeTab === 'graphics' && (
          <div className="py-12">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 border-b border-slate-800 pb-4">
              <ImageIcon className="text-blue-400" /> গ্রাফিক্স ডিজাইন গ্যালারি
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {graphicsImages.map((imgUrl, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-2">
                  <img src={imgUrl} alt="Graphics Work" className="w-full h-64 object-cover rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Marketing Section */}
        {activeTab === 'marketing' && (
          <div className="py-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <TrendingUp className="text-blue-400" /> ডিজিটাল মার্কেটিং
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              এখানে আপনার ডিজিটাল মার্কেটিং ও ক্যাম্পেইনের বিভিন্ন স্ট্র্যাটেজি ও কাজগুলো প্রদর্শন করা হয়েছে।
            </p>
          </div>
        )}

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
              <div className="flex items-center gap-4 text-slate-300">
                <Facebook className="text-blue-400" />
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition">ফেসবুক প্রোফাইল</a>
              </div>
            </div>
          </div>
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
