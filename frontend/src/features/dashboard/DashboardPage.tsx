import { useQuery } from '@tanstack/react-query';
import { Boxes, FolderKanban, Sparkles } from 'lucide-react';
import { api, type Page } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Stat = { label: string; value: number | string; icon: React.ComponentType<{ className?: string }> };

export function DashboardPage() {
  const projects = useQuery({
    queryKey: ['projects', { page: 1, page_size: 1 }],
    queryFn: async () => (await api.get<Page<unknown>>('/projects', { params: { page_size: 1 } })).data,
  });
  const items = useQuery({
    queryKey: ['items', { page: 1, page_size: 1 }],
    queryFn: async () => (await api.get<Page<unknown>>('/items', { params: { page_size: 1 } })).data,
  });

  const stats: Stat[] = [
    { label: 'Projects', value: projects.data?.total ?? '—', icon: FolderKanban },
    { label: 'Items', value: items.data?.total ?? '—', icon: Boxes },
    { label: 'Modules ready', value: '2', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to Technologia</h1>
        <p className="text-sm text-muted-foreground">
          A modern Python + React starter, inspired by the QuotePlan domain.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>Where to add functionality as you port from QuotePlan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Backend modules live at{' '}
            <code className="rounded bg-muted px-1">backend/app/api/v1/routes/</code>. Add a new
            route file, wire it in <code className="rounded bg-muted px-1">router.py</code>, then
            create matching service, repository, and SQLAlchemy model.
          </p>
          <p>
            Frontend features live at <code className="rounded bg-muted px-1">src/features/</code>.
            Each module owns its routes, queries, and forms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
