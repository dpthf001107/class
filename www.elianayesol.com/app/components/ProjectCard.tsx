import { motion } from 'motion/react';
import { type Project } from '../data/mockData';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const categoryColors = {
    team: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    personal: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    data: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    business: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {project.title}
          </h3>
          <span className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${categoryColors[project.category]}`}>
            {project.category}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
