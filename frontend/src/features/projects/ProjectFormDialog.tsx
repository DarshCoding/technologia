import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/select';
import { useCreateProject } from './queries';
import type { ProjectStatus } from './types';

const schema = z.object({
  code: z.string().min(1, 'Required').max(64),
  name: z.string().min(1, 'Required').max(255),
  customer: z.string().max(255).optional().or(z.literal('')),
  status: z.enum(['draft', 'active', 'on_hold', 'completed', 'cancelled']),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

const STATUSES: ProjectStatus[] = ['draft', 'active', 'on_hold', 'completed', 'cancelled'];

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function ProjectFormDialog({ open, onOpenChange }: Props) {
  const create = useCreateProject();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', name: '', customer: '', status: 'draft', start_date: '', end_date: '' },
  });

  const onSubmit = (values: FormValues) => {
    create.mutate(
      {
        code: values.code,
        name: values.name,
        customer: values.customer || null,
        status: values.status,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
      },
      {
        onSuccess: () => {
          toast.success('Project created');
          form.reset();
          onOpenChange(false);
        },
        onError: (err) => {
          const detail = axios.isAxiosError(err) ? err.response?.data?.detail : null;
          toast.error(typeof detail === 'string' ? detail : 'Could not create project');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>Create a project. Code must be unique.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="PRJ-001" {...form.register('code')} />
              {form.formState.errors.code && (
                <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="status">Status</Label>
              <NativeSelect id="status" {...form.register('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Pilot Project" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="customer">Customer</Label>
            <Input id="customer" placeholder="Acme Corp" {...form.register('customer')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="start_date">Start</Label>
              <Input id="start_date" type="date" {...form.register('start_date')} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="end_date">End</Label>
              <Input id="end_date" type="date" {...form.register('end_date')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Saving…' : 'Create project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
