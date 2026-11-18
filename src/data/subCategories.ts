// ============================================================================
// REFEIR — TALENT SUB-CATEGORIES
// Used by the "Explore Talent Categories" expandable showcase on the HomePage.
// `keywords` are matched (case-insensitive) against talent skills + headline.
// ============================================================================

export interface TalentSubCategory {
  id: string;
  name: string;
  count: string;
  keywords: string[];
}

export const TALENT_SUB_CATEGORIES: Record<string, TalentSubCategory[]> = {
  'Software & Mobile': [
    { id: 'sw-frontend', name: 'Front-End Engineers', count: '380+', keywords: ['react', 'next.js', 'typescript', 'tailwind', 'front'] },
    { id: 'sw-backend', name: 'Back-End Engineers', count: '310+', keywords: ['node.js', 'go', 'postgresql', 'graphql', 'fastapi', 'back'] },
    { id: 'sw-fullstack', name: 'Full-Stack Developers', count: '290+', keywords: ['full stack', 'full-stack', 'react', 'node.js'] },
    { id: 'sw-mobile', name: 'Mobile App Developers', count: '240+', keywords: ['flutter', 'ios', 'swift', 'react native', 'mobile'] },
    { id: 'sw-web3', name: 'Blockchain & Web3', count: '120+', keywords: ['solidity', 'web3', 'smart contract', 'rust', 'defi', 'blockchain'] },
    { id: 'sw-qa', name: 'QA & Test Automation', count: '80+', keywords: ['qa', 'testing', 'test', 'ci/cd'] },
  ],
  'AI & Data Science': [
    { id: 'ai-ml', name: 'Machine Learning Engineers', count: '170+', keywords: ['machine learning', 'pytorch', 'fine-tuning', 'custom llms'] },
    { id: 'ai-llm', name: 'LLM & Agentic Systems', count: '140+', keywords: ['llm', 'langchain', 'rag', 'autonomous agents', 'vector db', 'openai'] },
    { id: 'ai-chatbot', name: 'Chatbot Developers', count: '120+', keywords: ['chatbot', 'bot', 'dialogflow', 'conversational', 'voice ai'] },
    { id: 'ai-data', name: 'Data Analysts', count: '110+', keywords: ['data analytics', 'data', 'python'] },
    { id: 'ai-prompt', name: 'Prompt Engineers', count: '80+', keywords: ['prompt', 'claude', 'multilingual models', 'ai safety'] },
    { id: 'ai-nlp', name: 'NLP Specialists', count: '60+', keywords: ['nlp', 'multilingual', 'support ai'] },
  ],
  'Product & UI/UX Design': [
    { id: 'ds-product', name: 'Product Designers', count: '260+', keywords: ['product design', 'design systems', 'figma'] },
    { id: 'ds-uiux', name: 'UI/UX Designers', count: '230+', keywords: ['ui/ux', 'ux', 'user research', 'conversational ux'] },
    { id: 'ds-brand', name: 'Brand Identity Designers', count: '150+', keywords: ['brand identity', 'art direction', 'typography', 'packaging'] },
    { id: 'ds-pm', name: 'Product Managers', count: '130+', keywords: ['product management', 'agile', 'roadmapping', 'user stories', 'jira'] },
    { id: 'ds-research', name: 'UX Researchers', count: '70+', keywords: ['user research', 'research', 'ux'] },
    { id: 'ds-motion', name: 'Motion Designers', count: '50+', keywords: ['motion graphics', 'motion'] },
  ],
  'DevSecOps & Cloud': [
    { id: 'ops-devops', name: 'DevOps Engineers', count: '160+', keywords: ['devops', 'ci/cd', 'docker', 'kubernetes'] },
    { id: 'ops-cloud', name: 'Cloud Architects', count: '130+', keywords: ['cloud architecture', 'aws', 'terraform', 'cloud'] },
    { id: 'ops-security', name: 'Cybersecurity Analysts', count: '110+', keywords: ['cybersecurity', 'penetration testing', 'security'] },
    { id: 'ops-sre', name: 'Site Reliability Engineers', count: '60+', keywords: ['monitoring', 'kubernetes', 'site reliability'] },
    { id: 'ops-compliance', name: 'Compliance & Audit', count: '50+', keywords: ['compliance', 'ndpr', 'gdpr'] },
  ],
  'Growth & Marketing': [
    { id: 'gm-growth', name: 'Growth Marketers', count: '210+', keywords: ['growth marketing', 'growth'] },
    { id: 'gm-seo', name: 'SEO Specialists', count: '160+', keywords: ['seo'] },
    { id: 'gm-paid', name: 'Paid Social & Ads', count: '140+', keywords: ['paid social', 'ads'] },
    { id: 'gm-content', name: 'Content Strategists', count: '130+', keywords: ['content strategy', 'content'] },
    { id: 'gm-ecom', name: 'E-commerce Managers', count: '100+', keywords: ['e-commerce'] },
  ],
  'Legal & FinTech IP': [
    { id: 'lg-corporate', name: 'Corporate Lawyers', count: '90+', keywords: ['corporate law'] },
    { id: 'lg-ip', name: 'IP & Trademark Counsel', count: '70+', keywords: ['ip protection', 'intellectual property'] },
    { id: 'lg-privacy', name: 'Data Privacy (NDPR/GDPR)', count: '60+', keywords: ['ndpr', 'gdpr', 'compliance'] },
    { id: 'lg-contracts', name: 'Contract Drafting', count: '60+', keywords: ['contracts'] },
    { id: 'lg-venture', name: 'Venture & Startup Legal', count: '40+', keywords: ['venture tech', 'venture'] },
  ],
  'Finance & Accounting': [
    { id: 'fn-accounting', name: 'Accountants & Bookkeepers', count: '150+', keywords: ['accounting', 'bookkeeping'] },
    { id: 'fn-fpa', name: 'Financial Analysts (FP&A)', count: '110+', keywords: ['financial', 'analytics', 'data analytics'] },
    { id: 'fn-tax', name: 'Tax Consultants', count: '80+', keywords: ['tax'] },
    { id: 'fn-fraud', name: 'Fraud & Risk Analysts', count: '70+', keywords: ['fraud prevention', 'risk'] },
    { id: 'fn-cfo', name: 'Fractional CFOs', count: '50+', keywords: ['cfo', 'venture'] },
  ],
  'Video & Animation': [
    { id: 'va-editing', name: 'Video Editors', count: '190+', keywords: ['video editing', 'video'] },
    { id: 'va-motion', name: 'Motion Graphics Artists', count: '150+', keywords: ['motion graphics', 'motion'] },
    { id: 'va-2d3d', name: '2D & 3D Animators', count: '120+', keywords: ['animation', '3d'] },
    { id: 'va-explainer', name: 'Explainer Videos', count: '80+', keywords: ['explainer', 'storytelling'] },
    { id: 'va-art', name: 'Art Directors', count: '50+', keywords: ['art direction', 'brand identity'] },
  ],
  'Writing & Translation': [
    { id: 'wr-copy', name: 'Copywriters', count: '130+', keywords: ['copywriting', 'content strategy', 'content'] },
    { id: 'wr-tech', name: 'Technical Writers', count: '90+', keywords: ['technical writing', 'documentation', 'user stories'] },
    { id: 'wr-translate', name: 'Translators', count: '110+', keywords: ['translation', 'multilingual', 'arabic'] },
    { id: 'wr-seo', name: 'SEO Content Writers', count: '60+', keywords: ['seo', 'content'] },
    { id: 'wr-grant', name: 'Grant & Proposal Writers', count: '40+', keywords: ['grant', 'proposal', 'contracts'] },
  ],
  'Photography & Media': [
    { id: 'ph-product', name: 'Product Photographers', count: '110+', keywords: ['product photography', 'packaging'] },
    { id: 'ph-event', name: 'Event Photographers', count: '90+', keywords: ['event photography', 'photography'] },
    { id: 'ph-retouch', name: 'Photo Retouchers', count: '70+', keywords: ['retouching', 'photo editing'] },
    { id: 'ph-visual', name: 'Visual Storytellers', count: '60+', keywords: ['storytelling', 'art direction', 'brand identity'] },
    { id: 'ph-drone', name: 'Drone & Aerial Media', count: '50+', keywords: ['drone', 'aerial'] },
  ],
};
