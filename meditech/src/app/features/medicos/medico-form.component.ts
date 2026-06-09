import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medico, Especialidad, Turno } from '../../shared/models';
import { MedicosService } from '../../core/services/medicos.service';

/** Modal "Nuevo / Editar Médico" con formularios reactivos. */
@Component({
  selector: 'app-medico-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './medico-form.component.html',
})
export class MedicoFormComponent implements OnInit {
  @Input() medico: Medico | null = null;
  @Input() especialidades: Especialidad[] = [];
  @Output() guardado = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private srv = inject(MedicosService);

  readonly guardando = signal(false);
  readonly turnos: Turno[] = ['Mañana', 'Tarde', 'Noche'];

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    cmp: ['', [Validators.required, Validators.pattern(/^CMP-\d{4,6}$/)]],
    especialidadId: [0, [Validators.required, Validators.min(1)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    correo: ['', [Validators.required, Validators.email]],
    turno: ['Mañana' as Turno, Validators.required],
  });

  ngOnInit(): void {
    if (this.medico) {
      this.form.patchValue({
        nombre: this.medico.nombre, apellido: this.medico.apellido, cmp: this.medico.cmp,
        especialidadId: this.medico.especialidadId, telefono: this.medico.telefono,
        correo: this.medico.correo, turno: this.medico.turno,
      });
    }
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && c.touched;
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);
    const v = this.form.getRawValue();
    const esp = this.especialidades.find(e => e.id === Number(v.especialidadId));
    const payload = {
      nombre: v.nombre, apellido: v.apellido, cmp: v.cmp,
      especialidadId: Number(v.especialidadId), especialidad: esp?.nombre ?? '',
      telefono: v.telefono, correo: v.correo, turno: v.turno,
    };
    const obs = this.medico
      ? this.srv.actualizar(this.medico.id, payload)
      : this.srv.crear(payload);
    obs.subscribe(() => { this.guardando.set(false); this.guardado.emit(); });
  }
}
