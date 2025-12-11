export interface GrantSearchRequest {
  sector: string;
  projectType: string;
  keywords: string;
  regionScope: 'POLISH' | 'EUROPEAN';
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface GrantOpportunity {
  title: string;
  organization: string;
  deadline: string;
  amount: string;
  description: string;
  competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  successRateEstimate: string;
  matchScore: number; // 0-100 relevancy
  // Advanced Analysis Fields
  coFinancing: string; // e.g. "0% (100% Funded)" or "20% Own Contribution"
  fundingType: string; // e.g. "Lump Sum", "Real Costs", "Unit Costs"
  adminBurden: 'Low' | 'Medium' | 'High'; // Paperwork intensity
  consortiumReq: string; // e.g. "Single Entity", "Min 3 Partners"
  projectDuration: string; // e.g. "12-24 months"
  paymentModel: string; // e.g. "Pre-financing available", "Reimbursement only"
  url?: string; // Direct link to the grant call
}

export interface SearchResult {
  opportunities: GrantOpportunity[];
  rawMarkdown: string;
  sources: WebSource[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export const SECTORS = [
  'Education & Youth',
  'Civic Participation & Democracy',
  'Environment, Climate & Ecology',
  'Culture, Art & Heritage',
  'Digitalization & Technology',
  'Social Inclusion & Welfare',
  'Research & Innovation',
  'Regional Development & Infrastructure',
  'Humanitarian Aid & Health',
  'Sports & Tourism'
];

export const PROJECT_TYPES = [
  'Capacity Building',
  'Cross-border Cooperation',
  'Infrastructure',
  'Training & Mobility',
  'Research',
  'Awareness Raising',
  'Direct Services / Aid',
  'Event Organization'
];