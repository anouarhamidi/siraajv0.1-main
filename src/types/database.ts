export type UserType = 'graduate' | 'employer';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry-level' | 'junior';
export type JobStatus = 'open' | 'closed';
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  company_name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary_range?: string;
  job_type: JobType;
  experience_level: ExperienceLevel;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  employer?: Profile;
}

export interface Application {
  id: string;
  job_id: string;
  graduate_id: string;
  cover_letter?: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  job?: Job;
  graduate?: Profile;
}
