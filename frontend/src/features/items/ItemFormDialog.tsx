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
import { Textarea } from '@/components/ui/textarea';
import { useCreateItem } from './queries';

const schema = z.object({
  sku: z.string().min(1, 'Required').max(64),
  name: z.string().min(1, 'Required').max(255),
  description: z.string().optional().or(z.literal('')),
  unit: z.string().max(16).default('EA'),
  unit_price: z
    .string()
    .regex(/^\d+(\.\d{1,4})?$/, 'Use a positive decimal (max 4 dp)')
    .default('0'),
  category: z.string().max(64).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function ItemFormDialog({ open, onOpenChange }: Props) {
  const create = useCreateItem();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { sku: '', name: '', description: '', unit: 'EA', unit_price: '0', category: '' },
  });

  const onSubmit = (values: FormValues) => {
    create.mutate(
      {
        sku: values.sku,
        name: values.name,
        description: values.description || null,
        unit: values.unit,
        unit_price: values.unit_price,
        category: values.category || null,
      },
      {
        onSuccess: () => {
          toast.success('Item created');
          form.reset();
          onOpenChange(false);
        },
        onError: (err) => {
          const detail = axios.isAxiosError(err) ? err.response?.data?.detail : null;
          toast.error(typeof detail === 'string' ? detail : 'Could not create item');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New item</DialogTitle>
          <DialogDescription>Add a catalog item. SKU must be unique.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="SKU-001" {...form.register('sku')} />
              {form.formState.errors.sku && (
                <p className="text-xs text-destructive">{form.formState.errors.sku.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="Hardware" {...form.register('category')} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Widget" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" placeholder="EA" {...form.register('unit')} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="unit_price">Unit price</Label>
              <Input id="unit_price" inputMode="decimal" {...form.register('unit_price')} />
              {form.formState.errors.unit_price && (
                <p className="text-xs text-destructive">{form.formState.errors.unit_price.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register('description')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Saving…' : 'Create item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
