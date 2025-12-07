/*
  # Siraaj Job Platform Database Schema

  ## Overview
  This migration creates the complete database schema for Siraaj, a platform connecting fresh graduates with enterprises for entry-level jobs.

  ## New Tables

  ### 1. `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, not null)
  - `full_name` (text, not null)
  - `user_type` (text, not null) - either 'graduate' or 'employer'
  - `company_name` (text) - for employers only
  - `phone` (text)
  - `location` (text)
  - `bio` (text)
  - `skills` (text array) - for graduates
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `jobs`
  - `id` (uuid, primary key)
  - `employer_id` (uuid, references profiles)
  - `title` (text, not null)
  - `description` (text, not null)
  - `requirements` (text array)
  - `location` (text, not null)
  - `salary_range` (text)
  - `job_type` (text) - full-time, part-time, contract
  - `experience_level` (text) - entry-level, junior
  - `status` (text) - open, closed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `applications`
  - `id` (uuid, primary key)
  - `job_id` (uuid, references jobs)
  - `graduate_id` (uuid, references profiles)
  - `cover_letter` (text)
  - `status` (text) - pending, reviewed, accepted, rejected
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can read all profiles, update their own
  - Jobs: Everyone can read open jobs, only employers can create/update their own jobs
  - Applications: Graduates can create and view their own applications, employers can view applications for their jobs
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('graduate', 'employer')),
  company_name text,
  phone text,
  location text,
  bio text,
  skills text[] DEFAULT '{}',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  location text NOT NULL,
  salary_range text,
  job_type text DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  experience_level text DEFAULT 'entry-level' CHECK (experience_level IN ('entry-level', 'junior')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  graduate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, graduate_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_graduate_id ON applications(graduate_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Anyone can view open jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'open' OR employer_id = auth.uid());

CREATE POLICY "Employers can create jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'employer'
    )
  );

CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (employer_id = auth.uid());

-- Applications policies
CREATE POLICY "Graduates can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    graduate_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "Graduates can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    graduate_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'graduate'
    )
  );

CREATE POLICY "Graduates can update their own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (graduate_id = auth.uid())
  WITH CHECK (graduate_id = auth.uid());

CREATE POLICY "Employers can update application status for their jobs"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );