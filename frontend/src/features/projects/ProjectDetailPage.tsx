import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { useProjectQuery } from './queries';

export function ProjectDetailPage() {
  const { projectId } = useParams({ strict: false }) as { projectId: string };
  const query = useProjectQuery(projectId);

  if (query.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (query.isError || !query.data) return <p className="text-sm text-destructive">Project not found.</p>;
  const p = query.data;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/projects" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{p.name}</h1>
            <Badge variant="secondary">{p.code}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{p.customer ?? 'No customer'}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/projects">Close</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <Field label="Status" value={p.status.replace('_', ' ')} />
            <Field label="Start date" value={formatDate(p.start_date)} />
            <Field label="End date" value={formatDate(p.end_date)} />
            <Field label="Created" value={formatDate(p.created_at)} />
            <Field label="Updated" value={formatDate(p.updated_at)} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
