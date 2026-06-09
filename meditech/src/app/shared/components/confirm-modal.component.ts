import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * <app-confirm-modal> — Modal de confirmación reutilizable
 * (eliminar paciente, cancelar cita, etc.).
 */
@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div class="overlay" (click)="cancelar.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-head">
          <h3>{{ titulo }}</h3>
          <button class="btn-icon" (click)="cancelar.emit()" aria-label="Cerrar">✕</button>
        </div>
        <div class="modal-body">
          <p>{{ mensaje }}</p>
        </div>
        <div class="modal-foot">
          <button class="btn btn-secondary" (click)="cancelar.emit()">{{ textoCancelar }}</button>
          <button class="btn" [class.btn-danger]="peligro" [class.btn-primary]="!peligro"
                  (click)="confirmar.emit()" [disabled]="procesando">
            @if (procesando) { <span class="spinner"></span> } @else { {{ textoConfirmar }} }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed; inset: 0; z-index: 1500;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(2px);
      display: flex; align-items: center; justify-content: center;
      animation: ovFade 200ms ease;
    }
    .modal {
      background: #fff; border-radius: 16px;
      width: 90vw; max-width: 460px;
      box-shadow: 0 24px 60px rgba(13,27,42,0.35);
      animation: modalIn 200ms ease-out;
    }
    .modal-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; border-bottom: 1px solid #DDE3EC;
    }
    .modal-head h3 { font-size: 17px; }
    .modal-body { padding: 24px; color: #6B7A8D; font-size: 14px; line-height: 1.6; }
    .modal-foot {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 16px 24px; border-top: 1px solid #DDE3EC;
    }
    @keyframes ovFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: none; } }
  `],
})
export class ConfirmModalComponent {
  @Input() titulo = '¿Confirmar acción?';
  @Input() mensaje = '';
  @Input() textoConfirmar = 'Confirmar';
  @Input() textoCancelar = 'Cancelar';
  @Input() peligro = false;
  @Input() procesando = false;

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}
