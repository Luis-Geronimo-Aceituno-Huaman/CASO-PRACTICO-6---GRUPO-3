import { Routes } from '@angular/router';

/** Rutas del módulo Pacientes (cargado de forma diferida). */
export const PACIENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pacientes-list.component').then(m => m.PacientesListComponent),
  },
];
