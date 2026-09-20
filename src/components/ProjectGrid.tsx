import React from 'react';
import { Play, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { type Project } from '../lib/supabase';

interface ProjectGridProps {
  projects: Project[];
  activeCategory: string;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectGrid({ projects, activeCategory, isAdmin, onEdit, onDelete }: ProjectGridProps) {
  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'All') return true;
    return project.category.toLowerCase().trim() === activeCategory.toLowerCase().trim();
  });

  const getSocialThumbnail = (project: Project) => {
    if (project.cover_url && !project.cover_url.includes('default/hqdefault.jpg')) {
      return project.cover_url;
    }
    const url = project.project_url || '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2]) {
        return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
      }
    }
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
  };

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        কোনো প্রজেক্ট পাওয়া যায়নি!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => {
        const thumbnailUrl = getSocialThumbnail(project);
        const isVideo = project.category === 'Video Editing' || (project.project_url && (project.project_url.includes('youtube') || project.project_url.includes('facebook') || project.project_url.includes('youtu.be')));

        return (
          <div 
            key={project.id} 
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img 
                  src={thumbnailUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {project.project_url && (
                    <a 
                      href={project.project_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-cyan-500 text-slate-950 rounded-full font-bold shadow-lg hover:scale-110 transition-transform flex items-center gap-2 text-sm"
                    >
                      {isVideo ? <Play className="w-5 h-5 fill-current" /> : <ExternalLink className="w-5 h-5" />}
                      <span>{isVideo ? 'Watch Video' : 'View Project'}</span>
                    </a>
                  )}
                </div>
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-medium">
                  {project.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex justify-end gap-2">
                <button
                  onClick={() => onEdit(project)}
                  className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
