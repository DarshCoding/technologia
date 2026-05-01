export type ProjectStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export type Project = {
  id: string;
  code: string;
  name: string;
  customer: string | null;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectCreate = {
  code: string;
  name: string;
  customer?: string | null;
  status?: ProjectStatus;
  start_date?: string | null;
  end_date?: string | null;
};

export type ProjectUpdate = Partial<Omit<ProjectCreate, 'code'>>;
