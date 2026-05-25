import { Term } from '@/types/index';
import { cybersecurityTerms as cybersecurityTermsData } from './cybersecurity-terms';
import { frontendTerms as frontendTermsData } from './frontend-terms';
import { backendTerms as backendTermsData } from './backend-terms';
import { databaseTerms as databaseTermsData } from './database-terms';
import { devopsTerms as devopsTermsData } from './devops-terms';
import { networkingTerms as networkingTermsData } from './networking-terms';

// Re-export all terms from their respective files
export const cybersecurityTerms: Term[] = cybersecurityTermsData;
export const frontendTerms: Term[] = frontendTermsData;
export const backendTerms: Term[] = backendTermsData;
export const databaseTerms: Term[] = databaseTermsData;
export const devopsTerms: Term[] = devopsTermsData;
export const networkingTerms: Term[] = networkingTermsData;

// Consolidated exports for easy access
export const allTermsByArea = {
  cybersecurity: cybersecurityTerms,
  frontend: frontendTerms,
  backend: backendTerms,
  database: databaseTerms,
  devops: devopsTerms,
  networking: networkingTerms
};

export const allTerms: Term[] = [
  ...cybersecurityTerms,
  ...frontendTerms,
  ...backendTerms,
  ...databaseTerms,
  ...devopsTerms,
  ...networkingTerms
];

// Helper functions
export const getTermsByArea = (area: string): Term[] => {
  return allTermsByArea[area as keyof typeof allTermsByArea] || [];
};

export const getTermById = (id: string): Term | undefined => {
  return allTerms.find(term => term.id === id);
};

export const termStats = {
  cybersecurity: cybersecurityTerms.length,
  frontend: frontendTerms.length,
  backend: backendTerms.length,
  database: databaseTerms.length,
  devops: devopsTerms.length,
  networking: networkingTerms.length,
  total: allTerms.length
};

console.log('📚 Loaded terms statistics:', termStats);
