import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LogOut, Plus, Trash2, Pencil, X, Link2, Lock } from 'lucide-react';
import { supabase, type Project, type SocialLink, type ProjectCategory } from '../lib/supabase';

interface AdminProps {
  session: Session | null;
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
    setLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

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
            <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-300 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 rounded-xl gradient-cyan text-white font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard session={session} onLogout={handleLogout} />;
}

function AdminDashboard({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const loadData = async () => {
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
    ]);
    if (p) setProjects(p);
    if (s) setSocials(s);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('projects').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      {/* Header */}
      <div className="glass border-b border-slate-700/30 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-white">NAEIM VISUAL Admin</h1>
            <p className="text-xs text-slate-500">{session.user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="px-4 py-2 rounded-lg glass-light text-sm text-slate-300 hover:text-white">
              View Site
            </a>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 text-sm font-medium hover:bg-rose-500/30"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-cyan text-white font-semibold text-sm"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
          <button
            onClick={() => setShowSocials((s) => !s)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-light text-slate-300 font-medium text-sm hover:text-white"
          >
            <Link2 className="w-4 h-4" /> Manage Social Links
          </button>
        </div>

        {/* Projects list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="glass rounded-xl overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-slate-500 mb-3 capitalize">
                  {p.category.replace('_', ' ')} • {p.likes} likes
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(p); setShowForm(true); }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg glass-light text-xs text-slate-300 hover:text-cyan-300"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-2 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social links manager */}
        {showSocials && (
          <SocialLinksManager socials={socials} onChange={loadData} onClose={() => setShowSocials(false)} />
        )}

        {/* Project form */}
        {showForm && (
          <ProjectForm
            project={editing}
            onClose={() => { setShowForm(false); setEditing(null); }}
            onSaved={() => { setShowForm(false); setEditing(null); loadData(); }}
          />
        )}
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(project?.title ?? '');
  const [category, setCategory] = useState<ProjectCategory>(project?.category ?? 'graphic_design');
  const [coverUrl, setCoverUrl] = useState(project?.cover_url ?? '');
  const [behanceUrl, setBehanceUrl] = useState(project?.behance_url ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title,
      category,
      cover_url: coverUrl,
      behance_url: behanceUrl,
      description,
    };

    let result;
    if (project) {
      result = await supabase.from('projects').update(payload).eq('id', project.id);
    } else {
      result = await supabase.from('projects').insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40"
            >
              <option value="graphic_design">Graphic Design</option>
              <option value="video_editing">Video Editing</option>
              <option value="digital_marketing">Digital Marketing</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Cover Image URL</label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              required
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Behance URL</label>
            <input
              type="url"
              value={behanceUrl}
              onChange={(e) => setBehanceUrl(e.target.value)}
              required
              placeholder="https://behance.net/..."
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-5 py-2.5 rounded-xl gradient-cyan text-white font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : project ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl glass-light text-slate-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SocialLinksManager({
  socials,
  onChange,
  onClose,
}: {
  socials: SocialLink[];
  onChange: () => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [iconKey, setIconKey] = useState('behance');
  const [sortOrder, setSortOrder] = useState(socials.length + 1);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    await supabase.from('social_links').insert({
      label: label.trim(),
      url: url.trim(),
      icon_key: iconKey,
      sort_order: sortOrder,
    });
    setLabel('');
    setUrl('');
    onChange();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('social_links').delete().eq('id', id);
    onChange();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">Social Links</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {socials.map((s) => (
            <div key={s.id} className="flex items-center justify-between glass-light rounded-lg p-3">
              <div>
                <p className="text-sm font-medium text-white">{s.label}</p>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">{s.url}</p>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-rose-400 hover:text-rose-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="space-y-3 pt-4 border-t border-slate-700/30">
          <h3 className="text-sm font-semibold text-slate-300">Add new link</h3>
          <input
            type="text"
            placeholder="Label (e.g. Behance)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40"
          />
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40"
          />
          <div className="flex gap-3">
            <select
              value={iconKey}
              onChange={(e) => setIconKey(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40"
            >
              <option value="behance">Behance</option>
              <option value="facebook">Facebook</option>
              <option value="facebook-page">Facebook Page</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <input
              type="number"
              placeholder="Order"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-24 px-4 py-2.5 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white focus:outline-none focus:border-cyan-400/40"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-2.5 rounded-xl gradient-cyan text-white font-semibold"
          >
            Add Link
          </button>
        </form>
      </div>
    </div>
  );
}
