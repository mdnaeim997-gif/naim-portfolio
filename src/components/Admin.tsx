import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Check, AlertCircle, Loader2, X, Upload } from 'lucide-react';
import { supabase, type Project, type ProjectImage } from '../lib/supabase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSuccess: () => void;
}

export function AdminModal({ isOpen, onClose, project, onSuccess }: AdminModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Graphic Design');
  const [coverUrl, setCoverUrl] = useState('');
  const [behanceUrl, setBehanceUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');
  const [detailImages, setDetailImages] = useState<ProjectImage[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setCategory(project.category || 'Graphic Design');
      setCoverUrl(project.cover_url || '');
      setBehanceUrl(project.behance_url || '');
      setProjectUrl(project.project_url || '');
      setDescription(project.description || '');

      supabase
        .from('project_images')
        .select('*')
        .eq('project_id', project.id)
        .order('sort_order', { ascending: true })
        .then(({ data }) => {
          if (data) setDetailImages(data);
        });
    } else {
      setTitle('');
      setCategory('Graphic Design');
      setCoverUrl('');
      setBehanceUrl('');
      setProjectUrl('');
      setDescription('');
      setDetailImages([]);
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isCover) setUploadingCover(true);
    else setUploadingDetail(true);
    setError('');

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
              project_id: project?.id || '',
              image_url: publicUrl,
              sort_order: prev.length + i,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
    } finally {
      if (isCover) setUploadingCover(false);
      else setUploadingDetail(false);
    }
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
    setSaving(true);
    setError('');

    if (!coverUrl) {
      setError('Please upload a cover image first.');
      setSaving(false);
      return;
    }

    const payload = {
      title,
      category,
      cover_url: coverUrl,
      behance_url: behanceUrl || projectUrl || 'https://www.behance.net/',
      project_url: projectUrl,
      description,
      source: 'website' as const,
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

    const newImages = detailImages.filter((d) => d.id.startsWith('temp-'));
    if (projectId && newImages.length > 0) {
      const { error: ie } = await supabase.from('project_images').insert(
        newImages.map((img, i) => ({
          project_id: projectId,
          image_url: img.image_url,
          sort_order: detailImages.filter((d) => !d.id.startsWith('temp-')).length + i,
        }))
      );
      if (ie) { setError(ie.message); setSaving(false); return; }
    }

    setSaving(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <h2 className="text-xl font-semibold">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Project Title"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
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
                <div className="relative aspect-video max-w-sm mx-auto rounded-lg overflow-hidden border border-slate-700">
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                  {uploadingCover ? <Loader2 className="w-8 h-8 animate-spin text-cyan-500" /> : <Upload className="w-8 h-8 text-slate-500 mb-2" />}
                  <span className="text-sm text-slate-400">Click to upload cover image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Detailed Images (4-5 showcase images)</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {detailImages.map((img) => (
                <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 group">
                  <img src={img.image_url} alt="Detail" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeDetailImage(img)}
                    className="absolute top-1 right-1 p-1 bg-red-600/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg cursor-pointer text-xs font-medium text-slate-300">
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
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="https://youtube.com/watch?v=... or Facebook video URL"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{saving ? 'Saving...' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Admin() {
  return null;
}
