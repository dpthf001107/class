export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'team' | 'personal' | 'data' | 'business';
  tags: string[];
  thumbnail?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Team AIFix',
    description: 'ESG service project focused on sustainable AI solutions for environmental monitoring',
    category: 'team',
    tags: ['ESG', 'AI', 'Team'],
  },
  {
    id: '2',
    title: 'Marketer Profile Generator',
    description: 'AI-powered tool to create comprehensive marketing profiles for business analysis',
    category: 'business',
    tags: ['Business', 'AI', 'Marketing'],
  },
  {
    id: '3',
    title: 'Titanic Data Analysis',
    description: 'Machine learning exercise analyzing Titanic dataset for survival prediction',
    category: 'data',
    tags: ['AI', 'Data Science', 'ML'],
  },
  {
    id: '4',
    title: 'Soccer Performance Analytics',
    description: 'Data analysis project examining player performance metrics in professional soccer',
    category: 'data',
    tags: ['Data Science', 'Analytics', 'Sports'],
  },
  {
    id: '5',
    title: 'ESG Score Dashboard',
    description: 'Interactive dashboard for visualizing company ESG scores and trends',
    category: 'personal',
    tags: ['ESG', 'Visualization', 'Dev'],
  },
  {
    id: '6',
    title: 'Carbon Footprint Calculator',
    description: 'Business model for sustainable carbon tracking and reduction recommendations',
    category: 'business',
    tags: ['ESG', 'Business', 'Sustainability'],
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Getting Started with ESG Full-Stack Development',
    date: '2024-12-15',
    excerpt: 'My journey into building sustainable and responsible technology solutions starts here...',
    tags: ['ESG', 'Learning', 'Dev'],
  },
  {
    id: '2',
    title: 'Understanding AI Ethics in Business',
    date: '2024-12-10',
    excerpt: 'Exploring the intersection of artificial intelligence and ethical business practices...',
    tags: ['AI', 'Business', 'Ethics'],
  },
  {
    id: '3',
    title: 'Building Responsive Dashboards with React',
    date: '2024-12-05',
    excerpt: 'Tutorial on creating data-driven dashboards with modern React patterns...',
    tags: ['Dev', 'React', 'Tutorial'],
  },
  {
    id: '4',
    title: 'ESG Data Collection Methods',
    date: '2024-11-28',
    excerpt: 'Overview of different approaches to collecting and validating ESG data...',
    tags: ['ESG', 'Data Science'],
  },
];

