import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-stack">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast toast-{{ t.tipo }}">
          <span class="ico">{{ icono(t.tipo) }}</span>
          <span class="msg">{{ t.mensaje }}</span>
          <button class="x" (click)="toast.dismiss(t.id)" aria-label="Cerrar">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed; top: 80px; right: 24px;
      display: flex; flex-direction: column; gap: 12px;
      z-index: 2000; max-width: 360px;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      background: #fff; border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 8px 24px rgba(13,27,42,0.18);
      border-left: 4px solid #6B7A8D;
      animation: slideIn 300ms ease-out;
      font-size: 14px;
    }
    .toast .ico { font-size: 16px; }
    .toast .msg { flex: 1; color: #1C2B3A; }
    .toast .x {
      background: none; border: none; cursor: pointer;
      color: #6B7A8D; font-size: 13px; padding: 2px;
    }
    .toast-success { border-left-color: #27AE60; }
    .toast-warning { border-left-color: #F39C12; }
    .toast-error   { border-left-color: #E74C3C; }
    .toast-info    { border-left-color: #1A6FBB; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class ToastContainerComponent {
  readonly toast = inject(ToastService);
  icono(t: string): string {
    return { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' }[t] ?? 'ℹ️';
  }
}
