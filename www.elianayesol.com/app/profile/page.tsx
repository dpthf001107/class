'use client'

import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Code2, Database, Palette, Globe } from 'lucide-react';

// Next.js 16에서 빌드 타임 정적 생성 방지
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const skills = [
    { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'SQL'] },
    { category: 'Frontend', items: ['React', 'Tailwind CSS', 'Motion', 'Next.js'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'] },
    { category: 'AI/ML', items: ['TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy'] },
    { category: 'ESG Tools', items: ['Carbon Analytics', 'ESG Reporting', 'Data Visualization'] },
  ];

  const timeline = [
    {
      year: '2024',
      title: 'ESG Full-Stack Development',
      organization: 'Current Studies',
      description: 'Intensive program combining sustainable development practices with modern web technologies',
      icon: GraduationCap,
    },
    {
      year: '2023',
      title: 'AI & Data Science Course',
      organization: 'Learning Lab',
      description: 'Completed coursework in machine learning, data analysis, and predictive modeling',
      icon: Database,
    },
    {
      year: '2022',
      title: 'Web Development Bootcamp',
      organization: 'Tech Academy',
      description: 'Full-stack web development with focus on React and modern JavaScript',
      icon: Code2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl aspect-square mb-4 flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-8xl">👩‍💻</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                Eliana Yesol
              </h1>
              <p className="text-xl text-blue-600 dark:text-blue-400 mb-6">
                ESG Full-Stack Developer & AI Enthusiast
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Passionate about building technology that creates positive environmental and social impact. 
                Currently focused on developing full-stack solutions that integrate ESG principles with 
                cutting-edge AI and data analysis.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                  <Globe className="w-4 h-4" />
                  Seoul, South Korea
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  <Palette className="w-4 h-4" />
                  Open to Collaboration
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
            Skills & Technologies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
            Career Timeline
          </h2>
          <div className="space-y-8">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 pb-8 border-l-2 border-slate-200 dark:border-slate-700 pl-6 -ml-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold mb-1 text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {item.organization}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

