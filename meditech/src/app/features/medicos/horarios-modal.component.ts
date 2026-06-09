import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { Medico, Horario } from '../../shared/models';
import { MedicosService } from '../../core/services/medicos.service';
import { ToastService } from '../../core/services/toast.service';

/** Modal "Horarios de [médico]" — grilla 7 días x franjas, celdas clicables. */
@Component({
  selector: 'app-horarios-modal',
  standalone: true,
  templateUrl: './horarios-modal.component.html',
  styleUrl: './horarios-modal.component.scss',
})
export class HorariosModalComponent implements OnInit {
  @Input() medico!: Medico;
  @Output() cerrar = new EventEmitter<void>();

  private srv = inject(MedicosService);
  private toast = inject(ToastService);

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly horario = signal<Horario | null>(null);

  ngOnInit(): void {
    this.srv.horarios(this.medico.id).subscribe(h => {
      this.horario.set(h);
      this.cargando.set(false);
    });
  }

  toggle(dia: number, franja: number): void {
    const h = this.horario();
    if (!h) return;
    const copia = h.disponibilidad.map(r => [...r]);
    copia[dia][franja] = !copia[dia][franja];
    this.horario.set({ ...h, disponibilidad: copia });
  }

  guardar(): void {
    const h = this.horario();
    if (!h) return;
    this.guardando.set(true);
    this.srv.guardarHorarios(h).subscribe(() => {
      this.guardando.set(false);
      this.toast.success('Disponibilidad actualizada.');
      this.cerrar.emit();
    });
  }
}
