// NOTE: Core types for candidate search functionality
export interface Candidate {
    id: number;
    name: string;
    email: string;
    title?: string;
    company?: string;
    experience_years?: number;
    location?: string;
    availability_status: 'available' | 'unavailable' | 'open_to_work';
    image_url?: string;
    about?: string;
    contact_locked: boolean;
    match_percent?: number;
    created_at: string;
    updated_at: string;
}

export interface CandidateExperience {
    id: number;
    candidate_id: number;
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    description?: string;
    order_index: number;
}

export interface CandidateEducation {
    id: number;
    candidate_id: number;
    institution: string;
    degree: string;
    field_of_study: string;
    graduation_year: number;
    order_index: number;
}

export interface SearchFilters {
    role?: string;
    location?: string;
    experience_min?: number;
    skills?: string[];
}

export interface SearchStage {
    name: string;
    status: 'pending' | 'loading' | 'completed' | 'failed';
    started_at?: string;
    completed_at?: string;
}

export interface SearchResult {
    searchId: number;
    results: Candidate[];
    stages: SearchStage[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    creditsUsed: number;
}

export interface CandidateDetail extends Candidate {
    strengths?: string[];
    areas_to_probe?: string[];
    ai_verdict?: string;
    experience?: CandidateExperience[];
    education?: CandidateEducation[];
}
