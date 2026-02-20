/* ═══════════════════════════════════════════════════════════════
   LES BONS BRAS — TYPES SUPABASE (v3 — with onboarding fields)
   ═══════════════════════════════════════════════════════════════ */

export type ProjectStatus = "en_cours" | "planifie" | "termine" | "en_pause";
export type PhaseStatus = "done" | "in_progress" | "pending";
export type CostCategory = "materiaux" | "main_oeuvre" | "permis" | "autre";
export type RequestStatus = "pending" | "accepted" | "declined";

export interface ClientProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string;
  license_rbq: string | null;
  specialty: string[];
  description: string | null;
  avatar_url: string | null;
  verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  // Onboarding fields (v3)
  bio: string | null;
  years_experience: number;
  service_area: string | null;
  hourly_rate: number | null;
  onboarding_complete: boolean;
}

export interface ProPortfolio {
  id: string;
  pro_id: string;
  url: string;
  caption: string | null;
  category: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  pro_id: string | null;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  address: string | null;
  start_date: string | null;
  estimated_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  status: PhaseStatus;
  start_date: string | null;
  end_date: string | null;
  order_index: number;
  created_at: string;
}

export interface ProjectPhoto {
  id: string;
  project_id: string;
  url: string;
  caption: string | null;
  phase: string | null;
  created_at: string;
}

export interface ProjectCost {
  id: string;
  project_id: string;
  label: string;
  amount: number;
  category: CostCategory;
  date: string;
  paid: boolean;
  created_at: string;
}

export interface ProjectRequest {
  id: string;
  project_id: string;
  client_id: string;
  pro_id: string;
  status: RequestStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
}

/* ─── Joined types ─── */

export interface ProjectWithDetails extends Project {
  phases: ProjectPhase[];
  photos: ProjectPhoto[];
  costs: ProjectCost[];
  pro?: ProProfile | null;
}

export interface ProjectRequestWithDetails extends ProjectRequest {
  project: Project;
  client: ClientProfile;
}

export interface ProProfileWithPortfolio extends ProProfile {
  portfolio: ProPortfolio[];
}

/* ─── Database interface for generic usage ─── */

export interface Database {
  public: {
    Tables: {
      client_profiles: { Row: ClientProfile };
      pro_profiles: { Row: ProProfile };
      pro_portfolio: { Row: ProPortfolio };
      projects: { Row: Project };
      project_phases: { Row: ProjectPhase };
      project_photos: { Row: ProjectPhoto };
      project_costs: { Row: ProjectCost };
      project_requests: { Row: ProjectRequest };
    };
  };
}