import { Injectable, signal } from '@angular/core';

/** Estado de layout compartido entre topbar y sidebar (colapso/responsive). */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly colapsado = signal(false);
  readonly movilAbierto = signal(false);

  toggleColapso() { this.colapsado.update(v => !v); }
  toggleMovil() { this.movilAbierto.update(v => !v); }
  cerrarMovil() { this.movilAbierto.set(false); }
}
