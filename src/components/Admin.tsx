import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Check, AlertCircle, Loader2, ArrowLeft, Upload, Link as LinkIcon } from 'lucide-react';
import { supabase, type Project, type ProjectImage } from '../lib/supabase';

interface AdminProps {
  onClose?: () => void;
  project?: Project | null;
}

export function Admin({ onClose, project }: AdminProps) {
  const [title, setTitle] = useState(project?.title || '');
  const [category, setCategory] = useState(project?.category || 'Graphic Design');
  const [coverUrl, setCoverUrl] = useState(project?.cover_url || '');
  const [behanceUrl, setBehanceUrl] = useState(project?.behance_url || '');
  const [projectUrl, setProjectUrl] = useState(project?.project_url || '');
  const [description, setDescription] = useState(project?.description || '');
  const [detailImages, setDetailImages] = useState<ProjectImage[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (project?.id) {
      supabase
        .from('project_images')
        .select('*')
        .eq('project_id', project.id)
        .order('sort_order', { ascending: true })
        .then(({ data }) => {
          if (data) setDetailImages(data);
        });
    }
  }, [project]);

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
      behance_url: behanceUrl || 'https://www.behance.net/',
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
    setSuccess('Project saved successfully!');
    setTimeout(() => {
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-xl border border-border my-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold">{project ? 'Edit Project' : 'Add New Project'}</h2>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background"
            placeholder="Project Title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background"
          >
            <option value="Graphic Design">Graphic Design</option>
            <option value="Video Editing">Video Editing</option>
            <option value="Motion Graphics">Motion Graphics</option>
            <option value="UI/UX Design">UI/UX Design</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cover / Thumbnail Image</label>
          {coverUrl && (
            <div className="relative mb-3 aspect-video max-w-md rounded-lg overflow-hidden border border-border">
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer text-sm font-medium">
            {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{coverUrl ? 'Change Cover' : 'Upload Cover'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Detailed Showcase Images (Optional)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
            {detailImages.map((img) => (
              <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden border border-border group">
                <img src={img.image_url} alt="Detail" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeDetailImage(img)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer text-sm font-medium">
            {uploadingDetail ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            <span>Add Detail Images</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e, false)} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Behance URL (Optional)</label>
            <input
              type="url"
              value={behanceUrl}
              onChange={(e) => setBehanceUrl(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background"
              placeholder="https://behance.net/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Video Link (YouTube / Facebook)</label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background"
              placeholder="https://youtube.com/watch?v=... or Facebook video URL"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{saving ? 'Saving Project...' : 'Save Project'}</span>
        </button>
      </form>
    </div>
  );
}
