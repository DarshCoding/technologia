import type { ComponentType } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  ClipboardList,
  Contact2,
  Factory,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  PackageCheck,
  Settings,
  ShoppingCart,
  Sun,
  Tag,
  User2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  to?: string;
};

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { label: 'To Do List', icon: ListTodo },
  { label: 'Reports', icon: BarChart3 },
  { to: '/items', label: 'Items', icon: Tag },
  { to: '/projects', label: 'Projects / BOM', icon: FolderKanban },
  { label: 'Purchase Requisitions', icon: ClipboardList },
  { label: 'Purchase Order', icon: ShoppingCart },
  { label: 'Goods Received Notes / Receive Inventory', icon: PackageCheck },
  { label: 'Material Releases / To Shop Floor', icon: Factory },
  { label: 'Delivery Challans', icon: FileText },
  { label: 'Contacts', icon: Contact2 },
  { label: 'Business Entities', icon: BriefcaseBusiness },
  { label: 'Configuration', icon: Settings },
];

export function AppShell() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const { location } = useRouterState();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-60 flex-col border-r bg-card p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-bold">
            T
          </div>
          <span className="text-base font-semibold tracking-tight">Technologia</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const isLink = Boolean(to);
            const active = to
              ? to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(to)
              : false;

            if (isLink && to) {
              return (
                <Link
                  key={label}
                  to={to}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                </Link>
              );
            }

            return (
              <div
                key={label}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/90"
                title="Coming soon"
              >
                <Icon className="h-4 w-4" />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                <ChevronRight className="h-4 w-4 opacity-70" />
              </div>
            );
          })}
        </nav>
        <div className="mt-auto border-t pt-4">
          <div className="flex items-center gap-2 px-2 py-2 text-sm">
            <User2 className="h-4 w-4 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{user?.full_name ?? 'Guest'}</div>
              <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
          <div className="text-sm text-muted-foreground">
            {NAV.find((n) =>
              n.to ? (n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to)) : false,
            )
              ?.label ?? ''}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
