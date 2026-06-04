import { Term } from '@/types/index';
import {
  cybersecurityTerms as cybersecurityTermsData,
  frontendTerms as frontendTermsData,
  backendTerms as backendTermsData,
  databaseTerms as databaseTermsData,
  devopsTerms as devopsTermsData,
  networkingTerms as networkingTermsData,
  allTerms as allTermsData,
  allTermsByArea as allTermsByAreaData,
} from './terms-1000';

// Re-export all terms from their respective files
export const cybersecurityTerms: Term[] = cybersecurityTermsData;
export const frontendTerms: Term[] = frontendTermsData;
export const backendTerms: Term[] = backendTermsData;
export const databaseTerms: Term[] = databaseTermsData;
export const devopsTerms: Term[] = devopsTermsData;
export const networkingTerms: Term[] = networkingTermsData;

// Consolidated exports for easy access
export const allTermsByArea = allTermsByAreaData;

export const allTerms: Term[] = allTermsData;

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
