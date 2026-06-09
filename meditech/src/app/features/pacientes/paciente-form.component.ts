import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Paciente, TipoSangre } from '../../shared/models';
import { PacientesService } from '../../core/services/pacientes.service';

/**
 * Modal "Nuevo / Editar Paciente". Usa formularios reactivos con
 * validadores síncronos y un validador asíncrono que verifica el DNI
 * duplicado contra la API.
 */
@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './paciente-form.component.html',
})
export class PacienteFormComponent implements OnInit {
  @Input() paciente: Paciente | null = null;
  @Output() guardado = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private srv = inject(PacientesService);

  readonly guardando = signal(false);
  readonly tiposSangre: TipoSangre[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)], [this.dniUnico()]],
    fechaNacimiento: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    correo: ['', [Validators.email]],
    direccion: [''],
    tipoSangre: ['O+' as TipoSangre],
    alergias: [''],
  });

  ngOnInit(): void {
    if (this.paciente) {
      this.form.patchValue(this.paciente);
    }
  }

  private dniUnico(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const dni = control.value;
      if (!dni || !/^\d{8}$/.test(dni)) return of(null);
      return this.srv.dniExiste(dni, this.paciente?.id).pipe(
        map(existe => (existe ? { dniDuplicado: true } : null)),
        catchError(() => of(null)),
      );
    };
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && c.touched;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    const datos = this.form.getRawValue();

    const obs = this.paciente
      ? this.srv.actualizar(this.paciente.id, datos)
      : this.srv.crear(datos);

    obs.subscribe(() => {
      this.guardando.set(false);
      this.guardado.emit();
    });
  }
}
