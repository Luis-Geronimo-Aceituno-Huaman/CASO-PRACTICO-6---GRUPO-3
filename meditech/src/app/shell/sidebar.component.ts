import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../core/services/layout.service';

interface NavItem { ruta: string; icono: string; texto: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly layout = inject(LayoutService);

  readonly items: NavItem[] = [
    { ruta: '/dashboard', icono: '🏠', texto: 'Dashboard' },
    { ruta: '/pacientes', icono: '👥', texto: 'Pacientes' },
    { ruta: '/medicos',   icono: '🩺', texto: 'Médicos' },
    { ruta: '/citas',     icono: '📅', texto: 'Citas' },
    { ruta: '/reportes',  icono: '📊', texto: 'Reportes' },
  ];
}
