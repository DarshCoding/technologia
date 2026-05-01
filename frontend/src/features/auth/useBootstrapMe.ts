import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore, type AuthUser } from '@/stores/auth.store';

export function useBootstrapMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<AuthUser>({
    queryKey: ['me'],
    enabled: !!accessToken,
    queryFn: async () => (await api.get<AuthUser>('/users/me')).data,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}
