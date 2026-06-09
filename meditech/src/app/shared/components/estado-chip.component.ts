import { Component, Input } from '@angular/core';

/** <app-estado-chip estado="Activo"> — Chip de estado con color automático. */
@Component({
  selector: 'app-estado-chip',
  standalone: true,
  template: `<span class="chip" [class]="clase">{{ estado }}</span>`,
})
export class EstadoChipComponent {
  @Input() estado = '';

  get clase(): string {
    switch (this.estado) {
      case 'Activo':
      case 'Activa':
      case 'Atendida':
      case 'Disponible':
        return this.estado === 'Atendida' ? 'chip-info' : 'chip-success';
      case 'Pendiente':
        return 'chip-warning';
      case 'Cancelada':
      case 'Inactivo':
      case 'Inactiva':
        return 'chip-error';
      default:
        return 'chip-info';
    }
  }
}
