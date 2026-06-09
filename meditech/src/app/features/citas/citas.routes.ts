import { Routes } from '@angular/router';

/** Rutas del módulo Citas (cargado de forma diferida). */
export const CITAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./citas.component').then(m => m.CitasComponent),
  },
];
