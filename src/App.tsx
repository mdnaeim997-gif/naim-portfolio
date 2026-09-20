import React, { useState } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code, User, Briefcase, Send, ChevronRight, Youtube } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // আপনার ইউটিউব ভিডিও বা প্লেলিস্টগুলোর তালিকা এখানে যোগ করতে পারবেন
  const youtubeVideos = [
    {
      title: "আমার ইউটিউব প্লেলিস্ট (সব ভিডিও একসাথে)",
      description: "এখানে ক্লিক করে আমার প্লেলিস্টের সবগুলো ভিডিও একসাথে দেখে নিতে পারেন।",
      link: "https://www.youtube.com/playlist?list=PLVPT7cMDABy0"
    }
    // চাইলে নিচে আরও ভিডিওর লিংক যোগ করতে পারেন:
    // {
    //   title: "ভিডিও শিরোনাম",
    //   description: "ভিডিওর বিবরণ...",
    //   link: "আপনার_ভিডিওর_লিংক"
    // }
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
            <button onClick={() => setActiveTab('about')} className={`hover:text-blue-400 transition ${activeTab === 'about' ? 'text-blue-400' : 'text-slate-400'}`}>সম্পর্কে</button>
            <button onClick={() => setActiveTab('projects')} className={`hover:text-blue-400 transition ${activeTab === 'projects' ? 'text-blue-400' : 'text-slate-400'}`}>প্রজেক্ট ও ভিডিও</button>
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
              ওয়েব ডেভেলপার ও কন্টেন্ট ক্রিয়েটর
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              আসসালামু আলাইকুম, আমি <span className="text-blue-400">নাঈম ইসলাম</span>
            </h2>
            <p className="text-slate-400 max-w-2xl text-lg mb-8">
              আমার তৈরি বিভিন্ন প্রজেক্ট এবং ইউটিউব ভিডিওগুলো নিচে দেখতে পাবেন।
            </p>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab('projects')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition flex items-center gap-2">
                প্রজেক্ট ও ভিডিও দেখুন <ChevronRight size={18} />
              </button>
              <button onClick={() => setActiveTab('contact')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition">
                যোগাযোগ করুন
              </button>
            </div>
          </div>
        )}

        {/* About Section */}
        {activeTab === 'about' && (
          <div className="py-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <User className="text-blue-400" /> আমার সম্পর্কে
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              আমি ওয়েব ডেভেলপমেন্টের পাশাপাশি ইউটিউবে বিভিন্ন ভিডিও ও টিউটোরিয়াল তৈরি করে থাকি। গিটহাব এবং ভেরসেল ব্যবহার করে আমার কাজগুলো পরিচালনা করি।
            </p>
          </div>
        )}

        {/* Projects & Videos Section */}
        {activeTab === 'projects' && (
          <div className="py-12">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Youtube className="text-red-500" /> ইউটিউব প্লেলিস্ট ও ভিডিওসমূহ
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {youtubeVideos.map((video, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                      <Youtube size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100">{video.title}</h4>
                  </div>
                  <p className="text-slate-400 mb-6">{video.description}</p>
                  <a 
                    href={video.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition shadow-md shadow-red-900/20"
                  >
                    প্লেলিস্ট দেখুন (YouTube) <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
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
                <Github className="text-blue-400" />
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition">গিটহাব প্রোফাইল</a>
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
