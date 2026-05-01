import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
  RouterProvider,
  redirect,
} from '@tanstack/react-router';
import { AppShell } from '@/app/layout/AppShell';
import { LoginPage } from '@/features/auth/LoginPage';
import { useBootstrapMe } from '@/features/auth/useBootstrapMe';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ItemsPage } from '@/features/items/ItemsPage';
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage';
import { ProjectsPage } from '@/features/projects/ProjectsPage';
import { useAuthStore } from '@/stores/auth.store';

const rootRoute = createRootRoute({
  component: () => {
    useBootstrapMe();
    return <Outlet />;
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppShell,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: DashboardPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'projects',
  component: ProjectsPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'projects/$projectId',
  component: ProjectDetailPage,
});

const itemsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'items',
  component: ItemsPage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: () => <Navigate to="/" />,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([dashboardRoute, projectsRoute, projectDetailRoute, itemsRoute]),
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
