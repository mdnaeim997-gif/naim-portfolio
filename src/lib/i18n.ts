export type Lang = 'en' | 'bn';

export interface Translation {
  hero: {
    badge: string;
    titleFirst: string;
    titleSecond: string;
    subtitle: string;
    followers: string;
    totalViews: string;
    follow: string;
    following: string;
    bio: string;
    watchWork: string;
    chatWhatsApp: string;
  };
  work: {
    heading: string;
    headingAccent: string;
    all: string;
    graphicDesign: string;
    videoEditing: string;
    digitalMarketing: string;
    empty: string;
    behanceShowcase: string;
    viewProfile: string;
  };
  project: {
    viewProject: string;
    behance: string;
    images: string;
    yourName: string;
    writeComment: string;
    noComments: string;
    commentSubmitted: string;
  };
  footer: {
    contact: string;
    subtitle: string;
    phone: string;
    email: string;
    location: string;
    locationValue: string;
    yourName: string;
    yourEmail: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sentNotice: string;
    copyright: string;
  };
  whatsapp: {
    title: string;
    message: string;
    startChatting: string;
  };
}

export const translations: Record<Lang, Translation> = {
  en: {
    hero: {
      badge: 'Available for Freelance & Projects',
      titleFirst: 'NAEIM',
      titleSecond: 'VISUAL',
      subtitle: 'Visual Storyteller & Meta Marketer',
      followers: 'Followers',
      totalViews: 'Total Views',
      follow: 'Follow',
      following: 'Following',
      bio: "Hi, I'm Naeim — a visual storyteller and Meta marketer crafting compelling designs, cinematic video edits, and high-converting digital campaigns. I help brands and creators stand out with visuals that connect and content that converts.",
      watchWork: 'Watch My Work',
      chatWhatsApp: 'Chat On WhatsApp',
    },
    work: {
      heading: 'My',
      headingAccent: 'Work',
      all: 'Home (All Work)',
      graphicDesign: 'Graphic Design',
      videoEditing: 'Video Editing',
      digitalMarketing: 'Digital Marketing',
      empty: 'No projects in this category yet.',
      behanceShowcase: 'Behance Showcase',
      viewProfile: 'View Full Behance Profile',
    },
    project: {
      viewProject: 'View Project',
      behance: 'Behance',
      images: 'images',
      yourName: 'Your name',
      writeComment: 'Write a comment...',
      noComments: 'No comments yet. Be the first!',
      commentSubmitted: 'Your comment has been submitted and is awaiting admin approval.',
    },
    footer: {
      contact: 'Contact Me',
      subtitle: "Get In Touch — let's create something great together",
      phone: 'Phone',
      email: 'Email',
      location: 'Location',
      locationValue: 'Bangladesh — Remote Worldwide',
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      message: 'Message',
      messagePlaceholder: 'Tell me about your project...',
      send: 'Send Message',
      sentNotice: 'Your email client should have opened. If not, email me directly at naeimvisual@gmail.com',
      copyright: 'NAEIM VISUAL — Visual Storyteller & Meta Marketer',
    },
    whatsapp: {
      title: 'WhatsApp Chat',
      message: "Hi! Have a project in mind? Send me a message on WhatsApp and I'll get back to you quickly.",
      startChatting: 'Start Chatting',
    },
  },
  bn: {
    hero: {
      badge: 'ফ্রিল্যান্স ও প্রজেক্টের জন্য উপলব্ধ',
      titleFirst: 'নাঈম',
      titleSecond: 'ভিজ্যুয়াল',
      subtitle: 'ভিজ্যুয়াল স্টোরিটেলার ও মেটা মার্কেটার',
      followers: 'ফলোয়ার',
      totalViews: 'মোট ভিউ',
      follow: 'ফলো করুন',
      following: 'ফলো করছেন',
      bio: 'নাম আমার নাঈম — আমি একজন ভিজ্যুয়াল স্টোরিটেলার এবং মেটা মার্কেটার। আমি আকর্ষণীয় ডিজাইন, সিনেম্যাটিক ভিডিও এডিট এবং হাই-কনভার্টিং ডিজিটাল ক্যাম্পেইন তৈরি করে ব্র্যান্ড ও ক্রিয়েটরদের আলাদা করে তুলি।',
      watchWork: 'আমার কাজ দেখুন',
      chatWhatsApp: 'হোয়াটসঅ্যাপে চ্যাট করুন',
    },
    work: {
      heading: 'আমার',
      headingAccent: 'কাজ',
      all: 'হোম (সব কাজ)',
      graphicDesign: 'গ্রাফিক ডিজাইন',
      videoEditing: 'ভিডিও এডিটিং',
      digitalMarketing: 'ডিজিটাল মার্কেটিং',
      empty: 'এই ক্যাটাগরিতে এখনো কোনো প্রজেক্ট নেই।',
      behanceShowcase: 'বিহ্যান্স শোকেস',
      viewProfile: 'সম্পূর্ণ বিহ্যান্স প্রোফাইল দেখুন',
    },
    project: {
      viewProject: 'প্রজেক্ট দেখুন',
      behance: 'বিহ্যান্স',
      images: 'ছবি',
      yourName: 'আপনার নাম',
      writeComment: 'মন্তব্য লিখুন...',
      noComments: 'এখনো কোনো মন্তব্য নেই। প্রথম হোন!',
      commentSubmitted: 'আপনার মন্তব্য জমা হয়েছে এবং অ্যাডমিন অনুমোদনের অপেক্ষায় আছে।',
    },
    footer: {
      contact: 'যোগাযোগ করুন',
      subtitle: 'যোগাযোগ করুন — একসাথে কিছু দুর্দান্ত তৈরি করি',
      phone: 'ফোন',
      email: 'ইমেইল',
      location: 'অবস্থান',
      locationValue: 'বাংলাদেশ — সারা বিশ্বে রিমোট',
      yourName: 'আপনার নাম',
      yourEmail: 'আপনার ইমেইল',
      message: 'বার্তা',
      messagePlaceholder: 'আপনার প্রজেক্ট সম্পর্কে বলুন...',
      send: 'বার্তা পাঠান',
      sentNotice: 'আপনার ইমেইল ক্লায়েন্ট খোলা উচিত ছিল। না হলে, naeimvisual@gmail.com এ সরাসরি ইমেইল করুন',
      copyright: 'নাঈম ভিজ্যুয়াল — ভিজ্যুয়াল স্টোরিটেলার ও মেটা মার্কেটার',
    },
    whatsapp: {
      title: 'হোয়াটসঅ্যাপ চ্যাট',
      message: 'হাই! কোনো প্রজেক্ট মাথায় আছে? হোয়াটসঅ্যাপে আমাকে মেসেজ পাঠান, আমি দ্রুত উত্তর দেব।',
      startChatting: 'চ্যাট শুরু করুন',
    },
  },
};

const LANG_KEY = 'naeim_lang';

export function getStoredLang(): Lang {
  const stored = localStorage.getItem(LANG_KEY);
  return stored === 'bn' ? 'bn' : 'en';
}

export function setStoredLang(lang: Lang) {
  localStorage.setItem(LANG_KEY, lang);
  window.dispatchEvent(new Event('naeim-lang-change'));
}

export function subscribeLang(cb: (lang: Lang) => void) {
  const handler = () => cb(getStoredLang());
  window.addEventListener('naeim-lang-change', handler);
  return () => window.removeEventListener('naeim-lang-change', handler);
}
