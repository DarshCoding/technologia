import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth.store';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof schema>;

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export function LoginPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@technologia.local', password: 'admin123' },
  });

  const mutation = useMutation({
    mutationFn: async (values: LoginValues) => {
      const data = new URLSearchParams();
      data.set('username', values.email);
      data.set('password', values.password);
      const res = await axios.post(`${baseURL}/api/v1/auth/login`, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return res.data as { access_token: string; refresh_token: string };
    },
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      toast.success('Welcome back');
      navigate({ to: '/' });
    },
    onError: (err: unknown) => {
      const detail = axios.isAxiosError(err) ? err.response?.data?.detail : null;
      toast.error(typeof detail === 'string' ? detail : 'Login failed');
    },
  });

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-bold">
              T
            </div>
            <span className="text-base font-semibold tracking-tight">Technologia</span>
          </div>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your work email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
