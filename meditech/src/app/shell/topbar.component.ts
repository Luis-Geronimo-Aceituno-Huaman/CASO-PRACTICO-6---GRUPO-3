import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LayoutService } from '../core/services/layout.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  readonly layout = inject(LayoutService);
  readonly auth = inject(AuthService);
  private router = inject(Router);

  readonly breadcrumb = signal<string[]>(['Dashboard']);
  readonly menuAbierto = signal(false);
  readonly notifAbierto = signal(false);

  readonly notificaciones = signal([
    { id: 1, ico: '📅', titulo: 'Nueva cita registrada', detalle: 'Carmen Vargas — Cardiología, hoy 16:00', tiempo: 'Hace 5 min', leida: false },
    { id: 2, ico: '🩺', titulo: 'Médico agregó disponibilidad', detalle: 'Dr. Roberto Linares actualizó sus horarios', tiempo: 'Hace 1 h', leida: false },
    { id: 3, ico: '⚠️', titulo: 'Cita próxima a vencer', detalle: 'Juan Pérez no ha confirmado su cita de mañana', tiempo: 'Hace 3 h', leida: false },
    { id: 4, ico: '✅', titulo: 'Paciente registrado', detalle: 'Lucía Mendoza fue añadida al sistema', tiempo: 'Ayer', leida: true },
  ]);

  readonly noLeidas = () => this.notificaciones().filter(n => !n.leida).length;

  toggleNotif() {
    this.notifAbierto.update(v => !v);
    this.menuAbierto.set(false);
  }
  marcarTodas() {
    this.notificaciones.update(list => list.map(n => ({ ...n, leida: true })));
  }

  private readonly nombres: Record<string, string> = {
    dashboard: 'Dashboard', pacientes: 'Pacientes', medicos: 'Médicos',
    citas: 'Citas', reportes: 'Reportes', nuevo: 'Nuevo', nueva: 'Nueva', editar: 'Editar',
  };

  constructor() {
    this.actualizar(this.router.url);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => this.actualizar((e as NavigationEnd).urlAfterRedirects));
  }

  private actualizar(url: string): void {
    const segs = url.split('?')[0].split('/').filter(Boolean);
    const crumbs = segs
      .filter(s => isNaN(Number(s)))
      .map(s => this.nombres[s] ?? s);
    this.breadcrumb.set(crumbs.length ? crumbs : ['Dashboard']);
  }

  toggleMenu() { this.menuAbierto.update(v => !v); this.notifAbierto.set(false); }

  cerrarSesion(): void {
    this.menuAbierto.set(false);
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
