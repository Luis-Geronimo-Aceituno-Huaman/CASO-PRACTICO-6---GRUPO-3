import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './shell/shell.component';

/**
 * Rutas de la aplicación. Cada módulo de negocio se carga de forma
 * diferida (lazy loading con loadComponent / loadChildren), reduciendo
 * el bundle inicial. El shell agrupa las rutas protegidas por AuthGuard.
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'pacientes',
        loadChildren: () =>
          import('./features/pacientes/pacientes.routes').then(m => m.PACIENTES_ROUTES),
        data: { breadcrumb: 'Pacientes' },
      },
      {
        path: 'medicos',
        loadChildren: () =>
          import('./features/medicos/medicos.routes').then(m => m.MEDICOS_ROUTES),
        data: { breadcrumb: 'Médicos' },
      },
      {
        path: 'citas',
        loadChildren: () =>
          import('./features/citas/citas.routes').then(m => m.CITAS_ROUTES),
        data: { breadcrumb: 'Citas' },
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reportes/reportes.component').then(m => m.ReportesComponent),
        data: { breadcrumb: 'Reportes' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
