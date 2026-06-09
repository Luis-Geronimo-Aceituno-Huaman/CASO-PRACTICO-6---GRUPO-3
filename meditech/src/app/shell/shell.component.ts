import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';
import { LayoutService } from '../core/services/layout.service';

/**
 * Shell de la aplicación: topbar fija + sidebar fija + router-outlet
 * con scroll propio. Agrupa todas las rutas protegidas.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="shell" [class.colapsado]="layout.colapsado()">
      <app-sidebar />
      <app-topbar />
      <main class="contenido">
        <router-outlet />
      </main>
      @if (layout.movilAbierto()) {
        <div class="overlay-movil" (click)="layout.cerrarMovil()"></div>
      }
    </div>
  `,
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly layout = inject(LayoutService);
}
