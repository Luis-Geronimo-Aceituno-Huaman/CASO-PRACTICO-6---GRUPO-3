import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medico, Paciente } from '../../shared/models';
import { CitasService } from '../../core/services/citas.service';
import { MedicosService } from '../../core/services/medicos.service';
import { PacientesService } from '../../core/services/pacientes.service';

/**
 * Modal "Nueva Cita". Buscador autocomplete de paciente, select de médico
 * con auto-fill de especialidad, fecha/hora y motivo.
 */
@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './cita-form.component.html',
  styleUrl: './cita-form.component.scss',
})
export class CitaFormComponent implements OnInit {
  @Output() guardado = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private citasSrv = inject(CitasService);
  private medicosSrv = inject(MedicosService);
  private pacientesSrv = inject(PacientesService);

  readonly guardando = signal(false);
  readonly medicos = signal<Medico[]>([]);
  readonly especialidad = signal('');

  // autocomplete paciente
  busquedaPac = '';
  readonly sugerencias = signal<Paciente[]>([]);
  readonly pacienteSel = signal<Paciente | null>(null);
  readonly mostrarSug = signal(false);
  private todosPacientes: Paciente[] = [];

  form = this.fb.nonNullable.group({
    idMedico: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    motivo: [''],
  });

  ngOnInit(): void {
    this.medicosSrv.listar(undefined, '', 1, 100).subscribe(r => this.medicos.set(r.items));
    this.pacientesSrv.listar('', 1, 100).subscribe(r => this.todosPacientes = r.items);
  }

  buscarPac(): void {
    const q = this.busquedaPac.trim().toLowerCase();
    this.pacienteSel.set(null);
    if (!q) { this.sugerencias.set([]); this.mostrarSug.set(false); return; }
    this.sugerencias.set(this.todosPacientes.filter(p =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) || p.dni.includes(q)).slice(0, 6));
    this.mostrarSug.set(true);
  }

  elegirPac(p: Paciente): void {
    this.pacienteSel.set(p);
    this.busquedaPac = `${p.nombre} ${p.apellido}`;
    this.mostrarSug.set(false);
  }

  onMedico(): void {
    const id = Number(this.form.value.idMedico);
    const m = this.medicos().find(x => x.id === id);
    this.especialidad.set(m?.especialidad ?? '');
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && c.touched;
  }

  guardar(): void {
    if (this.form.invalid || !this.pacienteSel()) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    const v = this.form.getRawValue();
    this.citasSrv.crear({
      idPaciente: this.pacienteSel()!.id,
      idMedico: Number(v.idMedico),
      fecha: v.fecha, hora: v.hora, motivo: v.motivo,
    }).subscribe(() => {
      this.guardando.set(false);
      this.guardado.emit();
    });
  }
}
