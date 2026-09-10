import { useEffect, useState, useRef } from 'react';
import {
  LogOut, Plus, Trash2, Pencil, X, Link2, Lock, UploadCloud, Loader2,
  MessageSquare, Check, Eye, EyeOff, Settings,
} from 'lucide-react';
import {
  supabase, type Project, type SocialLink, type ProjectCategory,
  type ProjectComment, type ProjectImage, type SiteSettings,
} from '../lib/supabase';

const ADMIN_EMAIL = 'mdnaeim997@gmail.com';
const ADMIN_PASSWORD = 'naeim@#%';
const ADMIN_FLAG_KEY = 'naeim_admin_authed';

interface AdminProps {
  session: boolean;
}

export function Admin({ session }: AdminProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_FLAG_KEY, 'true');
      window.dispatchEvent(new Event('naeim-admin-login'));
      setLoading(false);
      return;
    }
    setAuthError('Invalid email or password.');
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_FLAG_KEY);
    window.dispatchEvent(new Event('naeim-admin-login'));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-base-900 flex items-center justify-center px-4">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
        </div>
        <div className="relative glass rounded-2xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-cyan flex items-center justify-center mb-3">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">NAEIM VISUAL Admin</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to manage your portfolio</p>
          </div>
          {authError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-300 text-sm">{authError}</div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full px-5 py-3 rounded-xl gradient-cyan text-white font-semibold disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">← Back to site</a>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

type AdminTab = 'projects' | 'comments' | 'settings' | 'socials';

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>('projects');

  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      <div className="glass border-b border-slate-700/30 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-white">NAEIM VISUAL Admin</h1>
            <p className="text-xs text-slate-500">{ADMIN_EMAIL}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="px-4 py-2 rounded-lg glass-light text-sm text-slate-300 hover:text-white">View Site</a>
            <button onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 text-sm font-medium hover:bg-rose-500/30">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 pb-2">
          {([
            { key: 'projects', label: 'Projects' },
            { key: 'comments', label: 'Comments' },
            { key: 'settings', label: 'Settings' },
            { key: 'socials', label: 'Social Links' },
          ] as { key: AdminTab; label: string }[]).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? 'gradient-cyan text-white' : 'text-slate-400 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {tab === 'projects' && <ProjectsTab />}
        {tab === 'comments' && <CommentsTab />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'socials' && <SocialsTab />}
      </div>
    </div>
  );
}

function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const loadData = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('projects').delete().eq('id', id);
    loadData();
  };

  return (
    <div>
      <button onClick={() => { setEditing(null); setShowForm(true); }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-cyan text-white font-semibold text-sm mb-6">
        <Plus className="w-4 h-4" /> Add Project
      </button>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="glass rounded-xl overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-slate-500 mb-3 capitalize">
                {p.category.replace('_', ' ')} • {p.likes} likes • {(p.views || 0)} views
              </p>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(p); setShowForm(true); }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg glass-light text-xs text-slate-300 hover:text-cyan-300">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)}
                  className="px-3 py-2 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ProjectForm project={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); loadData(); }} />
      )}
    </div>
  );
}

function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `covers/${fileName}`;
    supabase.storage.from('project-covers').upload(filePath, file, { cacheControl: '3600', upsert: false })
      .then(({ error }) => {
        if (error) { reject(error); return; }
        const { data: urlData } = supabase.storage.from('project-covers').getPublicUrl(filePath);
        if (urlData?.publicUrl) resolve(urlData.publicUrl);
        else reject(new Error('Failed to get public URL'));
      });
  });
}

function ProjectForm({ project, onClose, onSaved }: {
  project: Project | null; onClose: () => void; onSaved: () => void;
}) {
  const [title, setTitle] = useState(project?.title ?? '');
  const [category, setCategory] = useState<ProjectCategory>(project?.category ?? 'graphic_design');
  const [coverUrl, setCoverUrl] = useState(project?.cover_url ?? '');
  const [behanceUrl, setBehanceUrl] = useState(project?.behance_url ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [detailImages, setDetailImages] = useState<ProjectImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingDetails, setUploadingDetails] = useState(false);
  const [error, setError] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      supabase.from('project_images').select('*').eq('project_id', project.id).order('sort_order', { ascending: true })
        .then(({ data }) => { if (data) setDetailImages(data); });
    }
  }, [project]);

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(''); setUploadingCover(true);
    try { setCoverUrl(await uploadImage(file)); } catch (err: any) { setError(err.message); }
    setUploadingCover(false);
  };

  const handleDetailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError(''); setUploadingDetails(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      const newImages = urls.map((url, i) => ({
        id: `temp-${Date.now()}-${i}`,
        project_id: project?.id || '',
        image_url: url,
        sort_order: detailImages.length + i,
        created_at: new Date().toISOString(),
      }));
      setDetailImages((prev) => [...prev, ...newImages]);
    } catch (err: any) { setError(err.message); }
    setUploadingDetails(false);
  };

  const removeDetailImage = async (img: ProjectImage) => {
    if (img.id.startsWith('temp-')) {
      setDetailImages((prev) => prev.filter((d) => d.id !== img.id));
    } else {
      await supabase.from('project_images').delete().eq('id', img.id);
      setDetailImages((prev) => prev.filter((d) => d.id !== img.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    if (!coverUrl) { setError('Please upload a cover image first.'); setSaving(false); return; }

    const payload = {
      title, category, cover_url: coverUrl,
      behance_url: behanceUrl || 'https://www.behance.net/',
      description, source: 'website' as const,
    };

    let projectId = project?.id;
    if (project) {
      const { error: e2 } = await supabase.from('projects').update(payload).eq('id', project.id);
      if (e2) { setError(e2.message); setSaving(false); return; }
    } else {
      const { data, error: e2 } = await supabase.from('projects').insert(payload).select('*').single();
      if (e2) { setError(e2.message); setSaving(false); return; }
      projectId = data.id;
    }

    // Save new detail images (those with temp IDs)
    const newImages = detailImages.filter((d) => d.id.startsWith('temp-'));
    if (projectId && newImages.length > 0) {
      const { error: ie } = await supabase.from('project_images').insert(
        newImages.map((img, i) => ({
          project_id: projectId, image_url: img.image_url,
          sort_order: detailImages.filter((d) => !d.id.startsWith('temp-')).length + i,
        }))
      );
      if (ie) { setError(ie.message); setSaving(false); return; }
    }

    setSaving(false); onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-300 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40">
              <option value="graphic_design">Graphic Design</option>
              <option value="video_editing">Video Editing</option>
              <option value="digital_marketing">Digital Marketing</option>
            </select>
          </div>

          {/* Cover image upload */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Cover / Thumbnail Image</label>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
            {coverUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-700/40 group">
                <img src={coverUrl} alt="Cover preview" className="w-full h-40 object-cover" />
                <button type="button" onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm font-medium">
                  <UploadCloud className="w-5 h-5" /> Change Image
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover}
                className="w-full h-40 rounded-lg border-2 border-dashed border-slate-600/50 hover:border-cyan-400/40 bg-base-800/40 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-cyan-300 transition-all disabled:opacity-50">
                {uploadingCover ? (<><Loader2 className="w-7 h-7 animate-spin" /><span className="text-sm">Uploading...</span></>)
                  : (<><UploadCloud className="w-7 h-7" /><span className="text-sm">Click to upload cover image</span></>)}
              </button>
            )}
          </div>

          {/* Detail images upload */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Detailed Images (4-5 showcase images)</label>
            <input ref={detailInputRef} type="file" accept="image/*" multiple onChange={handleDetailSelect} className="hidden" />
            {detailImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {detailImages.map((img) => (
                  <div key={img.id} className="relative rounded-lg overflow-hidden border border-slate-700/40 group">
                    <img src={img.image_url} alt="" className="w-full h-20 object-cover" />
                    <button type="button" onClick={() => removeDetailImage(img)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => detailInputRef.current?.click()} disabled={uploadingDetails}
              className="w-full py-3 rounded-lg border-2 border-dashed border-slate-600/50 hover:border-cyan-400/40 bg-base-800/40 flex items-center justify-center gap-2 text-slate-400 hover:text-cyan-300 transition-all disabled:opacity-50">
              {uploadingDetails ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              <span className="text-sm">{uploadingDetails ? 'Uploading...' : 'Add detail images'}</span>
            </button>
          </div>

          {/* Behance link */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">External Link / Behance Link (optional)</label>
            <input type="url" value={behanceUrl === 'https://www.behance.net/' ? '' : behanceUrl}
              onChange={(e) => setBehanceUrl(e.target.value)}
              placeholder="https://behance.net/your-project"
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40" />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Description (optional)</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40 resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploadingCover || uploadingDetails}
              className="flex-1 px-5 py-2.5 rounded-xl gradient-cyan text-white font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : project ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl glass-light text-slate-300 font-medium">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CommentsTab() {
  const [comments, setComments] = useState<(ProjectComment & { project_title?: string })[]>([]);

  const loadData = async () => {
    const { data: comments } = await supabase.from('project_comments').select('*').order('created_at', { ascending: false });
    if (!comments) return;
    const { data: projects } = await supabase.from('projects').select('id, title');
    const titleMap = new Map((projects || []).map((p) => [p.id, p.title]));
    setComments(comments.map((c) => ({ ...c, project_title: titleMap.get(c.project_id) || 'Unknown' })));
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (id: string, status: 'approved' | 'hidden' | 'pending') => {
    await supabase.from('project_comments').update({ status }).eq('id', id);
    loadData();
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Delete this comment permanently?')) return;
    await supabase.from('project_comments').delete().eq('id', id);
    loadData();
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    hidden: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };

  return (
    <div className="space-y-3">
      <h2 className="font-display font-bold text-lg text-white mb-4">Comment Moderation</h2>
      {comments.length === 0 && <p className="text-slate-500 text-sm">No comments yet.</p>}
      {comments.map((c) => (
        <div key={c.id} className="glass rounded-xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-sm font-semibold text-cyan-300">{c.author_name}</p>
              <p className="text-xs text-slate-500">on {c.project_title}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[c.status]}`}>{c.status}</span>
          </div>
          <p className="text-sm text-slate-300 mb-3">{c.body}</p>
          <div className="flex flex-wrap gap-2">
            {c.status !== 'approved' && (
              <button onClick={() => updateStatus(c.id, 'approved')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-medium hover:bg-emerald-500/25">
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
            )}
            {c.status !== 'hidden' && (
              <button onClick={() => updateStatus(c.id, 'hidden')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-500/15 text-slate-400 text-xs font-medium hover:bg-slate-500/25">
                <EyeOff className="w-3.5 h-3.5" /> Hide
              </button>
            )}
            {c.status === 'hidden' && (
              <button onClick={() => updateStatus(c.id, 'pending')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 text-xs font-medium hover:bg-amber-500/25">
                <Eye className="w-3.5 h-3.5" /> Unhide
              </button>
            )}
            <button onClick={() => deleteComment(c.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 text-xs font-medium hover:bg-rose-500/25">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('*').maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const toggle = async (field: 'show_followers' | 'show_views') => {
    if (!settings) return;
    const newValue = !settings[field];
    setSettings({ ...settings, [field]: newValue });
    await supabase.from('site_settings').update({ [field]: newValue }).eq('id', settings.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateBehanceUrl = async (url: string) => {
    if (!settings) return;
    setSettings({ ...settings, behance_profile_url: url });
  };

  const saveBehanceUrl = async () => {
    if (!settings) return;
    await supabase.from('site_settings').update({ behance_profile_url: settings.behance_profile_url }).eq('id', settings.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <div className="text-slate-500 text-sm">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-lg text-white">Site Settings</h2>

      {saved && (
        <div className="px-4 py-3 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm">Settings saved!</div>
      )}

      {/* Visibility toggles */}
      <div className="glass rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-300" /> Visibility Controls
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Show Follower Count</p>
            <p className="text-xs text-slate-500">Display follower count in the hero section</p>
          </div>
          <button onClick={() => toggle('show_followers')}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.show_followers ? 'bg-cyan-500' : 'bg-slate-600'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.show_followers ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Show View Count</p>
            <p className="text-xs text-slate-500">Display total views in the hero section</p>
          </div>
          <button onClick={() => toggle('show_views')}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.show_views ? 'bg-cyan-500' : 'bg-slate-600'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.show_views ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>

      {/* Behance profile URL */}
      <div className="glass rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-cyan-300" /> Behance Profile URL
        </h3>
        <p className="text-xs text-slate-500">Your Behance profile — linked from the hero social icons for auto-sync.</p>
        <div className="flex gap-2">
          <input type="url" value={settings.behance_profile_url}
            onChange={(e) => updateBehanceUrl(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40" />
          <button onClick={saveBehanceUrl}
            className="px-4 py-2.5 rounded-xl gradient-cyan text-white text-sm font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}

function SocialsTab() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [iconKey, setIconKey] = useState('behance');
  const [sortOrder, setSortOrder] = useState(1);

  const loadData = async () => {
    const { data } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
    if (data) { setSocials(data); setSortOrder(data.length + 1); }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    await supabase.from('social_links').insert({
      label: label.trim(), url: url.trim(), icon_key: iconKey, sort_order: sortOrder,
    });
    setLabel(''); setUrl('');
    loadData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('social_links').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-lg text-white">Social Links</h2>

      <div className="space-y-2">
        {socials.map((s) => (
          <div key={s.id} className="flex items-center justify-between glass rounded-lg p-3">
            <div>
              <p className="text-sm font-medium text-white">{s.label}</p>
              <p className="text-xs text-slate-500 truncate max-w-[300px]">{s.url}</p>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-rose-400 hover:text-rose-300">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="glass rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Add new link</h3>
        <input type="text" placeholder="Label (e.g. Behance)" value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40" />
        <input type="url" placeholder="https://..." value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40" />
        <div className="flex gap-3">
          <select value={iconKey} onChange={(e) => setIconKey(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40">
            <option value="behance">Behance</option>
            <option value="facebook">Facebook</option>
            <option value="facebook-page">Facebook Page</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <input type="number" placeholder="Order" value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-24 px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40" />
        </div>
        <button type="submit"
          className="w-full px-5 py-2.5 rounded-xl gradient-cyan text-white font-semibold">Add Link</button>
      </form>
    </div>
  );
}
