import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: number;
  tipo: ToastTipo;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private seq = 0;

  show(mensaje: string, tipo: ToastTipo = 'info', duracion = 4000): void {
    const id = ++this.seq;
    this.toasts.update(list => [...list, { id, tipo, mensaje }]);
    setTimeout(() => this.dismiss(id), duracion);
  }

  success(m: string) { this.show(m, 'success'); }
  warning(m: string) { this.show(m, 'warning'); }
  error(m: string)   { this.show(m, 'error'); }
  info(m: string)    { this.show(m, 'info'); }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
