import { Job } from '../types';
import { createMoney } from './currencies';

export const SEED_JOBS: Job[] = [
  {
    id: 'job-1',
    client_id: 'user-client-kenya',
    client_name: 'David Kamau (Twiga Logistics)',
    client_country: 'Kenya',
    title: 'Senior React & Node.js Developer for Cross-Border Cargo Platform',
    description: 'We need an experienced full-stack engineer to build our real-time GPS tracking interface, multi-currency invoice generator, and driver dispatch dashboard.',
    category: 'Development & Tech',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Google Maps API', 'TypeScript'],
    budget: createMoney(350000, 'KES'),
    deadline: '30 Days',
    country_preference: 'Africa-wide',
    remote: true,
    proposals_count: 7,
    status: 'OPEN',
    created_at: '2026-06-25T14:00:00Z'
  },
  {
    id: 'job-2',
    client_id: 'user-client-nigeria',
    client_name: 'Folake Balogun (Apex Health Tech)',
    client_country: 'Nigeria',
    title: 'Complete Mobile App Design & Prototyping for Telemedicine App',
    description: 'Looking for a world-class UI/UX designer with experience in digital health. Need doctor booking flows, prescription tracking, and consultation screens.',
    category: 'Design & Creative',
    skills: ['Product Design', 'Figma', 'Mobile UX', 'Design Systems', 'Healthcare UX'],
    budget: createMoney(750000, 'NGN'),
    deadline: '20 Days',
    country_preference: 'West Africa',
    remote: true,
    proposals_count: 12,
    status: 'OPEN',
    created_at: '2026-06-26T09:30:00Z'
  },
  {
    id: 'job-3',
    client_id: 'user-client-sa',
    client_name: 'Liam Botha (Vanguard Retail)',
    client_country: 'South Africa',
    title: 'Flutter Cross-Platform Mobile Engineer for Loyalty & POS App',
    description: 'We are launching our retail loyalty and instant payment scanner app across South Africa and Namibia. Seeking a Flutter pro for a 2-month contract.',
    category: 'Development & Tech',
    skills: ['Flutter', 'Dart', 'Firebase', 'State Management', 'Payment APIs'],
    budget: createMoney(55000, 'ZAR'),
    deadline: '45 Days',
    country_preference: 'Southern Africa',
    remote: true,
    proposals_count: 5,
    status: 'OPEN',
    created_at: '2026-06-27T11:20:00Z'
  },
  {
    id: 'job-4',
    client_id: 'user-client-ghana',
    client_name: 'Abena Osei (GoldCoast Fin)',
    client_country: 'Ghana',
    title: 'Cybersecurity Penetration Testing & API Vulnerability Assessment',
    description: 'Need a certified cybersecurity auditor to review our GraphQL API endpoints, JWT token handling, and database encryption before launch.',
    category: 'Development & Tech',
    skills: ['Cybersecurity', 'Penetration Testing', 'API Security', 'DevSecOps'],
    budget: createMoney(25000, 'GHS'),
    deadline: '15 Days',
    country_preference: 'Africa-wide',
    remote: true,
    proposals_count: 4,
    status: 'OPEN',
    created_at: '2026-06-28T16:45:00Z'
  }
];
