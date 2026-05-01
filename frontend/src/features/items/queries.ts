import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type Page } from '@/lib/api';
import type { Item, ItemCreate } from './types';

export const itemKeys = {
  all: ['items'] as const,
  list: (params: { page: number; q?: string }) => [...itemKeys.all, 'list', params] as const,
};

export function useItemsQuery(params: { page: number; pageSize: number; q?: string }) {
  return useQuery({
    queryKey: itemKeys.list({ page: params.page, q: params.q }),
    queryFn: async () => {
      const { data } = await api.get<Page<Item>>('/items', {
        params: {
          page: params.page,
          page_size: params.pageSize,
          q: params.q || undefined,
        },
      });
      return data;
    },
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ItemCreate) => (await api.post<Item>('/items', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: itemKeys.all }),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/items/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: itemKeys.all }),
  });
}
