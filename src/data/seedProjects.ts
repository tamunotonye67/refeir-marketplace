import { Project } from '../types';
import { createMoney } from './currencies';

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-pan-africa-demo',
    title: 'Cross-Border Supply Chain Analytics & Dispatch Engine',
    client_id: 'user-client-kenya',
    client_name: 'David Kamau (Twiga Logistics)',
    client_country: 'Kenya',
    talent_id: 'talent-amaka-nwosu',
    talent_name: 'Amaka Nwosu',
    talent_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    talent_country: 'Nigeria',
    scout_id: 'scout-kofi-boateng',
    scout_name: 'Kofi Boateng',
    referral_id: 'RF-82KX29',
    currency: 'NGN',
    project_amount: createMoney(1000000, 'NGN'),
    platform_fee_percent: 5,
    platform_fee_amount: createMoney(50000, 'NGN'),
    client_total_amount: createMoney(1050000, 'NGN'),
    referral_percentage: 10,
    scout_reward_amount: createMoney(100000, 'NGN'),
    talent_net_amount: createMoney(900000, 'NGN'),
    status: 'IN_PROGRESS',
    timeline_days: 14,
    milestones: [
      {
        id: 'ms-1',
        title: 'User Research & Fleet Persona Wireframes',
        description: 'Delivery of high-level wireframes for driver and dispatcher flows.',
        amount: createMoney(350000, 'NGN'),
        due_date: '2026-07-05',
        status: 'APPROVED'
      },
      {
        id: 'ms-2',
        title: 'High-Fidelity Figma Design System & Prototype',
        description: 'Complete UI component library, tokens, and clickable prototype.',
        amount: createMoney(400000, 'NGN'),
        due_date: '2026-07-12',
        status: 'SUBMITTED'
      },
      {
        id: 'ms-3',
        title: 'Developer Handoff & Asset Export',
        description: 'Complete design specs, responsive layouts, and handoff walkthrough.',
        amount: createMoney(250000, 'NGN'),
        due_date: '2026-07-19',
        status: 'FUNDED'
      }
    ],
    deliverables: [
      {
        id: 'del-1',
        project_id: 'proj-pan-africa-demo',
        milestone_id: 'ms-1',
        title: 'Wireframes & Information Architecture v1.2',
        message: 'Here is the complete wireframe set covering dispatcher queue and driver route inspection.',
        file_name: 'Twiga_Logistics_Wireframes_v1.2.pdf',
        figma_url: 'https://figma.com/@refeir/twiga-wireframes',
        submitted_at: '2026-07-04T15:30:00Z',
        status: 'APPROVED'
      },
      {
        id: 'del-2',
        project_id: 'proj-pan-africa-demo',
        milestone_id: 'ms-2',
        title: 'Figma Prototype & Design System v2.0',
        message: 'Completed all 34 screens with dark/light themes and full interaction specs. Ready for client inspection.',
        file_name: 'Twiga_Figma_DesignSystem_v2.fig',
        figma_url: 'https://figma.com/@refeir/twiga-design-system',
        github_pr_url: 'https://github.com/refeir-africa/twiga-fleet-analytics',
        staging_url: 'https://twiga-staging.refeir.africa',
        apk_download_url: 'https://downloads.refeir.africa/builds/twiga-v1.0.apk',
        submitted_at: '2026-07-11T18:00:00Z',
        status: 'PENDING_REVIEW'
      }
    ],
    created_at: '2026-06-28T10:00:00Z'
  },
  {
    id: 'proj-ghana-api',
    title: 'High-Throughput Mobile Money Aggregation API',
    client_id: 'user-client-nigeria',
    client_name: 'Folake Balogun (Apex Health Tech)',
    client_country: 'Nigeria',
    talent_id: 'talent-kwame-mensah',
    talent_name: 'Kwame Mensah',
    talent_avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    talent_country: 'Ghana',
    scout_id: 'scout-sarah-adeyemi',
    scout_name: 'Sarah Adeyemi',
    referral_id: 'RF-99GH44',
    currency: 'GHS',
    project_amount: createMoney(18000, 'GHS'),
    platform_fee_percent: 5,
    platform_fee_amount: createMoney(900, 'GHS'),
    client_total_amount: createMoney(18900, 'GHS'),
    referral_percentage: 10,
    scout_reward_amount: createMoney(1800, 'GHS'),
    talent_net_amount: createMoney(16200, 'GHS'),
    status: 'COMPLETED',
    timeline_days: 14,
    milestones: [
      {
        id: 'ms-gh-1',
        title: 'Core Engine & Webhook Receiver',
        description: 'Golang microservice with MTLS auth and Idempotency verification.',
        amount: createMoney(18000, 'GHS'),
        due_date: '2026-06-20',
        status: 'RELEASED'
      }
    ],
    deliverables: [],
    created_at: '2026-06-05T12:00:00Z',
    completed_at: '2026-06-19T16:00:00Z',
    settled_at: '2026-06-22T09:00:00Z'
  }
];
