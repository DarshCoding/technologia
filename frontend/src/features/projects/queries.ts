import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type Page } from '@/lib/api';
import type { Project, ProjectCreate, ProjectStatus, ProjectUpdate } from './types';

export const projectKeys = {
  all: ['projects'] as const,
  list: (params: { page: number; q?: string; status?: ProjectStatus | '' }) =>
    [...projectKeys.all, 'list', params] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

export function useProjectsQuery(params: {
  page: number;
  pageSize: number;
  q?: string;
  status?: ProjectStatus | '';
}) {
  return useQuery({
    queryKey: projectKeys.list({ page: params.page, q: params.q, status: params.status }),
    queryFn: async () => {
      const { data } = await api.get<Page<Project>>('/projects', {
        params: {
          page: params.page,
          page_size: params.pageSize,
          q: params.q || undefined,
          status: params.status || undefined,
        },
      });
      return data;
    },
  });
}

export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => (await api.get<Project>(`/projects/${id}`)).data,
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProjectCreate) => (await api.post<Project>('/projects', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProjectUpdate) =>
      (await api.patch<Project>(`/projects/${id}`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/projects/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
