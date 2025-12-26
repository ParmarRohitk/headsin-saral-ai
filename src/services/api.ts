import axios from 'axios';
import { SearchFilters, CandidateDetail } from '../types/candidate';

// NOTE: Configure API base URL from environment or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// NOTE: API functions for candidate search module
export const candidateApi = {
    // Initiate a new search
    search: async (query: string, filters?: SearchFilters, page: number = 1, limit: number = 12) => {
        const response = await api.post('/candidates/search', {
            query,
            filters,
            page,
            limit,
        });
        return response.data;
    },

    // Get search status and stages
    getSearchStatus: async (searchId: number) => {
        const response = await api.get(`/candidates/search/${searchId}/status`);
        return response.data;
    },

    // Get search results with pagination and filters
    getSearchResults: async (searchId: number, page: number = 1, limit: number = 12, filters?: SearchFilters) => {
        const response = await api.get(`/candidates/search/${searchId}/results`, {
            params: { page, limit, ...filters },
        });
        return response.data;
    },

    // Get candidate details
    getCandidateDetails: async (candidateId: number): Promise<{ success: boolean; data: CandidateDetail }> => {
        const response = await api.get(`/candidates/${candidateId}`);
        return response.data;
    },

    // Unlock candidate contact
    unlockContact: async (candidateId: number) => {
        const response = await api.post(`/candidates/${candidateId}/unlock`);
        return response.data;
    },

    // Add to shortlist
    addToShortlist: async (candidateId: number) => {
        const response = await api.post(`/candidates/${candidateId}/shortlist`);
        return response.data;
    },

    // Get shortlisted candidates
    getShortlisted: async () => {
        const response = await api.get('/candidates/shortlist');
        return response.data;
    },
};

// NOTE: API functions for campaigns module
export const campaignApi = {
    getAll: async () => {
        const response = await api.get('/campaigns');
        return response.data;
    },
    getSequences: async (id: number) => {
        const response = await api.get(`/campaigns/${id}/sequences`);
        return response.data;
    },
    getAnalytics: async (id: number) => {
        const response = await api.get(`/campaigns/${id}/analytics`);
        return response.data;
    },
    create: async (name: string, type: 'email' | 'linkedin') => {
        const response = await api.post('/campaigns', { name, type });
        return response.data;
    }
};

// NOTE: API functions for credits
export const creditApi = {
    getUserCredits: async () => {
        const response = await api.get('/credits');
        return response.data;
    },
};

export default api;
