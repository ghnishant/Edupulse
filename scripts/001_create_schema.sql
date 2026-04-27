-- EduPulse AI Database Schema
-- Run this script to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Institutions table
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('university', 'college', 'institute')),
  location TEXT,
  established_year INTEGER,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'faculty' CHECK (role IN ('super_admin', 'institution_admin', 'faculty', 'reviewer')),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  department_id UUID,
  phone TEXT,
  designation TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  hod_name TEXT,
  faculty_count INTEGER DEFAULT 0,
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(institution_id, code)
);

-- Add foreign key for department_id in profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;

-- Faculty table
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  designation TEXT NOT NULL,
  qualifications TEXT[],
  specializations TEXT[],
  publications_count INTEGER DEFAULT 0,
  experience_years INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'csv', 'xlsx', 'doc', 'docx')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  category TEXT NOT NULL CHECK (category IN ('academic', 'research', 'administrative', 'accreditation', 'financial', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('naac', 'nba', 'iqac', 'annual', 'custom')),
  content JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'published')),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics data table
CREATE TABLE IF NOT EXISTS public.analytics_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN (
    'student_enrollment', 'faculty_ratio', 'research_output', 
    'placement_rate', 'pass_rate', 'satisfaction_score',
    'infrastructure_score', 'accreditation_readiness'
  )),
  value DECIMAL NOT NULL,
  previous_value DECIMAL,
  period TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Chat history table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read their own profile, admins can read all in their institution
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_institution" ON public.profiles 
  FOR SELECT USING (
    institution_id IN (
      SELECT institution_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Institutions: Readable by members, editable by admins
CREATE POLICY "institutions_select" ON public.institutions 
  FOR SELECT USING (
    id IN (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "institutions_insert_super_admin" ON public.institutions 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "institutions_update_admin" ON public.institutions 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role = 'super_admin' OR (role = 'institution_admin' AND institution_id = institutions.id))
    )
  );

-- Departments: Readable by institution members
CREATE POLICY "departments_select" ON public.departments 
  FOR SELECT USING (
    institution_id IN (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "departments_insert_admin" ON public.departments 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role IN ('super_admin', 'institution_admin'))
      AND (role = 'super_admin' OR institution_id = departments.institution_id)
    )
  );

CREATE POLICY "departments_update_admin" ON public.departments 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role IN ('super_admin', 'institution_admin'))
      AND (role = 'super_admin' OR institution_id = departments.institution_id)
    )
  );

-- Documents: Users can manage their own, admins can see all in institution
CREATE POLICY "documents_select_own" ON public.documents 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "documents_select_institution" ON public.documents 
  FOR SELECT USING (
    institution_id IN (
      SELECT institution_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('institution_admin', 'super_admin')
    )
  );

CREATE POLICY "documents_insert_own" ON public.documents 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "documents_update_own" ON public.documents 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "documents_delete_own" ON public.documents 
  FOR DELETE USING (user_id = auth.uid());

-- Reports: Similar to documents
CREATE POLICY "reports_select_own" ON public.reports 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "reports_select_institution" ON public.reports 
  FOR SELECT USING (
    institution_id IN (
      SELECT institution_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('institution_admin', 'super_admin', 'reviewer')
    )
  );

CREATE POLICY "reports_insert_own" ON public.reports 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "reports_update_own" ON public.reports 
  FOR UPDATE USING (user_id = auth.uid());

-- Analytics: Readable by institution members
CREATE POLICY "analytics_select" ON public.analytics_data 
  FOR SELECT USING (
    institution_id IN (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "analytics_insert_admin" ON public.analytics_data 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'institution_admin')
    )
  );

-- Notifications: Users can only see their own
CREATE POLICY "notifications_select_own" ON public.notifications 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON public.notifications 
  FOR DELETE USING (user_id = auth.uid());

-- Chat messages: Users can only see their own
CREATE POLICY "chat_select_own" ON public.chat_messages 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "chat_insert_own" ON public.chat_messages 
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    COALESCE(new.raw_user_meta_data ->> 'role', 'faculty')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_institution ON public.profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_departments_institution ON public.departments(institution_id);
CREATE INDEX IF NOT EXISTS idx_documents_institution ON public.documents(institution_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_reports_institution ON public.reports(institution_id);
CREATE INDEX IF NOT EXISTS idx_analytics_institution ON public.analytics_data(institution_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON public.analytics_data(metric_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
