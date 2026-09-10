import { useEffect, useState } from 'react';
import { Heart, MessageSquare, Send, ExternalLink, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project, ProjectComment, ProjectImage } from '../lib/supabase';
import { supabase, getSessionKey } from '../lib/supabase';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [likeCount, setLikeCount] = useState(project.likes);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [commentNotice, setCommentNotice] = useState('');
  const sessionKey = getSessionKey();

  useEffect(() => {
    supabase
      .from('project_likes')
      .select('id')
      .eq('project_id', project.id)
      .eq('session_key', sessionKey)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data));

    // Increment view count once per session
    const viewedKey = `viewed_${project.id}`;
    if (!localStorage.getItem(viewedKey)) {
      supabase
        .from('projects')
        .update({ views: (project.views || 0) + 1 })
        .eq('id', project.id)
        .then(() => localStorage.setItem(viewedKey, 'true'));
    }

    // Load detailed images
    supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id)
      .order('sort_order', { ascending: true })
      .then(({ data }) => { if (data) setImages(data); });
  }, [project.id, project.views, sessionKey]);

  const refreshLikeCount = async () => {
    const { data: fresh } = await supabase
      .from('projects')
      .select('likes')
      .eq('id', project.id)
      .maybeSingle();
    if (fresh) setLikeCount(fresh.likes);
  };

  const handleLike = async () => {
    if (liked) {
      await supabase
        .from('project_likes')
        .delete()
        .eq('project_id', project.id)
        .eq('session_key', sessionKey);
      setLiked(false);
      await supabase
        .from('projects')
        .update({ likes: Math.max(0, likeCount - 1) })
        .eq('id', project.id);
      refreshLikeCount();
    } else {
      const { error } = await supabase.from('project_likes').insert({
        project_id: project.id,
        session_key: sessionKey,
      });
      if (!error) {
        setLiked(true);
        await supabase
          .from('projects')
          .update({ likes: likeCount + 1 })
          .eq('id', project.id);
        refreshLikeCount();
      }
    }
  };

  const loadComments = async () => {
    const { data } = await supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', project.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments((s) => !s);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentBody.trim()) return;
    setPosting(true);
    const { data } = await supabase
      .from('project_comments')
      .insert({
        project_id: project.id,
        author_name: commentName.trim(),
        body: commentBody.trim(),
        status: 'pending',
      })
      .select('*')
      .single();
    if (data) {
      setCommentName('');
      setCommentBody('');
      setCommentNotice('Your comment has been submitted and is awaiting admin approval.');
    }
    setPosting(false);
  };

  const categoryLabel: Record<string, string> = {
    graphic_design: 'Graphic Design',
    video_editing: 'Video Editing',
    digital_marketing: 'Digital Marketing',
  };

  const allImages = [project.cover_url, ...images.map((i) => i.image_url)];

  return (
    <>
      <div className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_8px_40px_rgba(34,211,238,0.12)] hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => { setGalleryIndex(0); setShowGallery(true); }}>
          <img
            src={project.cover_url}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-900/80 via-transparent to-transparent" />
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full glass-light text-cyan-300">
            {categoryLabel[project.category]}
          </span>
          {project.source === 'behance' && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full bg-[#1769FF] text-white">Behance</span>
          )}
          {images.length > 0 && (
            <span className="absolute bottom-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full glass-light text-slate-300">
              {allImages.length} images
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-display font-bold text-lg text-white mb-1.5">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">{project.description}</p>
          )}

          <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {(project.views || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setGalleryIndex(0); setShowGallery(true); }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                View Project
              </button>
              {project.behance_url && project.behance_url !== 'https://www.behance.net/' && (
                <a
                  href={project.behance_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-300 transition-colors"
                >
                  Behance <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  liked
                    ? 'bg-rose-500/20 text-rose-400 glow-rose'
                    : 'glass-light text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                }`}
                aria-label="Like project"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400' : ''}`} />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={toggleComments}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium glass-light text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                aria-label="Comments"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{comments.length || ''}</span>
              </button>
            </div>
          </div>

          {showComments && (
            <div className="mt-4 pt-4 border-t border-slate-700/40 animate-fade-up">
              {commentNotice && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs">
                  {commentNotice}
                </div>
              )}
              <form onSubmit={submitComment} className="mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-base-800/60 border border-slate-700/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                  />
                  <button
                    type="submit"
                    disabled={posting}
                    className="px-3 py-2 rounded-lg gradient-cyan text-white text-sm font-medium disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {comments.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-2">No comments yet. Be the first!</p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="glass-light rounded-lg p-3">
                    <p className="text-xs font-semibold text-cyan-300 mb-0.5">{c.author_name}</p>
                    <p className="text-sm text-slate-300">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery lightbox */}
      {showGallery && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowGallery(false)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white z-10" onClick={() => setShowGallery(false)}>
            <X className="w-7 h-7" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={allImages[galleryIndex]}
              alt={`${project.title} ${galleryIndex + 1}`}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setGalleryIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-light flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGalleryIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-light flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === galleryIndex ? 'border-cyan-400' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
            <h3 className="font-display font-bold text-lg text-white mt-4 text-center">{project.title}</h3>
            {project.description && (
              <p className="text-sm text-slate-400 text-center mt-1 max-w-2xl mx-auto">{project.description}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
