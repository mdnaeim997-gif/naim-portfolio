import { useEffect, useState } from 'react';
import { Heart, MessageSquare, ExternalLink, Send } from 'lucide-react';
import type { Project, ProjectComment } from '../lib/supabase';
import { supabase, getSessionKey } from '../lib/supabase';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [likeCount, setLikeCount] = useState(project.likes);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [posting, setPosting] = useState(false);

  const sessionKey = getSessionKey();

  useEffect(() => {
    supabase
      .from('project_likes')
      .select('id')
      .eq('project_id', project.id)
      .eq('session_key', sessionKey)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data));
  }, [project.id, sessionKey]);

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
      })
      .select('*')
      .single();
    if (data) {
      setComments((c) => [data, ...c]);
      setCommentName('');
      setCommentBody('');
    }
    setPosting(false);
  };

  const categoryLabel: Record<string, string> = {
    graphic_design: 'Graphic Design',
    video_editing: 'Video Editing',
    digital_marketing: 'Digital Marketing',
  };

  return (
    <div className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_8px_40px_rgba(34,211,238,0.12)] hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
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
      </div>

      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-white mb-1.5">{project.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <a
            href={project.behance_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            View Project <ExternalLink className="w-4 h-4" />
          </a>

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
  );
}
