'use client'

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { projects } from '../data/mockData';
import { ProjectCard } from '../components/ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Next.js 16에서 빌드 타임 정적 생성 방지
export const dynamic = 'force-dynamic';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return projects;
    }
    return projects.filter((project) => project.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            A comprehensive collection of my work spanning team collaborations, personal experiments, 
            data analysis, and business innovations in the ESG and AI space.
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="mb-12" onValueChange={setSelectedCategory}>
          <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="data">Data Experiments</TabsTrigger>
            <TabsTrigger value="business">Business Ideas</TabsTrigger>
          </TabsList>
        </Tabs>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

