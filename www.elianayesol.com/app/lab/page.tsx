'use client'

import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, Zap } from 'lucide-react';

export default function LabPage() {
  const esgData = [
    { name: 'Environmental', score: 85 },
    { name: 'Social', score: 78 },
    { name: 'Governance', score: 92 },
  ];

  const trendData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 80 },
    { month: 'Jun', score: 85 },
  ];

  const experiments = [
    {
      title: 'ESG Score Simulator',
      description: 'Interactive tool to calculate and visualize company ESG performance metrics',
      status: 'Active',
      icon: TrendingUp,
    },
    {
      title: 'Carbon Footprint Tracker',
      description: 'Real-time monitoring and analysis of carbon emissions data',
      status: 'Testing',
      icon: Activity,
    },
    {
      title: 'AI Prompt Laboratory',
      description: 'Experimentation with various AI prompts for ESG data analysis',
      status: 'Development',
      icon: Zap,
    },
  ];

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
            AI & ESG Lab
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            An experimental workspace for testing AI models, analyzing ESG data, and prototyping 
            innovative solutions for sustainable business practices.
          </p>
        </motion.div>

        {/* Experiments Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {experiments.map((experiment, index) => {
            const Icon = experiment.icon;
            return (
              <motion.div
                key={experiment.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="px-2 py-1 text-xs rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    {experiment.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                  {experiment.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {experiment.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Data Visualizations */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <h3 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">
              ESG Performance Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={esgData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" className="text-slate-600 dark:text-slate-400" />
                <YAxis className="text-slate-600 dark:text-slate-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <h3 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">
              ESG Score Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="month" className="text-slate-600 dark:text-slate-400" />
                <YAxis className="text-slate-600 dark:text-slate-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-8"
        >
          <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
            About the Lab
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            This experimental space showcases various AI and ESG data analysis projects. The visualizations 
            and tools demonstrated here are part of ongoing research into sustainable business practices 
            and the application of artificial intelligence in environmental and social governance.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            <strong>Note:</strong> All data shown is simulated for demonstration purposes.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

