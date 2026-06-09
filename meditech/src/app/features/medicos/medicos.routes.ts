import { Routes } from '@angular/router';

/** Rutas del módulo Médicos (cargado de forma diferida). */
export const MEDICOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./medicos-list.component').then(m => m.MedicosListComponent),
  },
];
