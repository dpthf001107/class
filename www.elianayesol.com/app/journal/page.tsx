'use client'

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import { journalEntries } from '../data/mockData';
import { TagFilter } from '../components/TagFilter';

// Next.js 16에서 빌드 타임 정적 생성 방지
export const dynamic = 'force-dynamic';

export default function JournalPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    journalEntries.forEach((entry) => {
      entry.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const filteredEntries = useMemo(() => {
    if (!selectedTag) {
      return journalEntries;
    }
    return journalEntries.filter((entry) => entry.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Journal
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Study notes, tutorials, and insights from my learning journey in ESG, AI, and development.
          </p>
          <TagFilter tags={allTags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />
        </motion.div>

        <div className="space-y-6">
          {filteredEntries.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                    {entry.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {entry.excerpt}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No journal entries found with this tag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

