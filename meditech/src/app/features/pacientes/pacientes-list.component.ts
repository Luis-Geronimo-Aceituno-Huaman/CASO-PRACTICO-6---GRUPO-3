import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Paciente, EntradaHistorial } from '../../shared/models';
import { PacientesService } from '../../core/services/pacientes.service';
import { ToastService } from '../../core/services/toast.service';
import { EstadoChipComponent } from '../../shared/components/estado-chip.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { PacienteFormComponent } from './paciente-form.component';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [FormsModule, EstadoChipComponent, ConfirmModalComponent, PacienteFormComponent],
  templateUrl: './pacientes-list.component.html',
  styleUrl: './pacientes-list.component.scss',
})
export class PacientesListComponent implements OnInit {
  private srv = inject(PacientesService);
  private toast = inject(ToastService);

  readonly cargando = signal(true);
  readonly pacientes = signal<Paciente[]>([]);
  readonly total = signal(0);
  readonly pagina = signal(1);
  readonly porPagina = 8;
  busqueda = '';

  // estado de modales / drawer
  readonly formAbierto = signal(false);
  readonly editando = signal<Paciente | null>(null);
  readonly aEliminar = signal<Paciente | null>(null);
  readonly eliminando = signal(false);
  readonly drawerPaciente = signal<Paciente | null>(null);
  readonly historial = signal<EntradaHistorial[]>([]);
  readonly cargandoHistorial = signal(false);

  private busqueda$ = new Subject<string>();

  ngOnInit(): void {
    this.busqueda$.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.pagina.set(1); this.cargar(); });
    this.cargar();
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.total() / this.porPagina));
  }
  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cargar(): void {
    this.cargando.set(true);
    this.srv.listar(this.busqueda, this.pagina(), this.porPagina).subscribe(r => {
      this.pacientes.set(r.items);
      this.total.set(r.total);
      this.cargando.set(false);
    });
  }

  onBuscar(): void { this.busqueda$.next(this.busqueda); }

  irPagina(p: number): void {
    if (p < 1 || p > this.totalPaginas) return;
    this.pagina.set(p);
    this.cargar();
  }

  nuevo(): void { this.editando.set(null); this.formAbierto.set(true); }
  editar(p: Paciente): void { this.editando.set(p); this.formAbierto.set(true); }

  onGuardado(): void {
    this.formAbierto.set(false);
    this.toast.success(this.editando() ? 'Paciente actualizado correctamente.' : 'Paciente registrado correctamente.');
    this.cargar();
  }

  pedirEliminar(p: Paciente): void { this.aEliminar.set(p); }
  confirmarEliminar(): void {
    const p = this.aEliminar();
    if (!p) return;
    this.eliminando.set(true);
    this.srv.eliminar(p.id).subscribe(() => {
      this.eliminando.set(false);
      this.aEliminar.set(null);
      this.toast.success('Paciente eliminado.');
      this.cargar();
    });
  }

  /** Edad en años a partir de la fecha de nacimiento (formato YYYY-MM-DD). */
  edad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const [a, m, d] = fechaNacimiento.split('-').map(Number);
    const hoy = new Date(2026, 5, 9); // fecha de referencia del sistema
    let edad = hoy.getFullYear() - a;
    const cumpleAun = hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d);
    if (cumpleAun) edad--;
    return edad;
  }

  /** Inicial(es) para el avatar del paciente. */
  iniciales(p: Paciente): string {
    return (p.nombre.charAt(0) + p.apellido.charAt(0)).toUpperCase();
  }

  iconoTipo(tipo: string): string {
    return { Consulta: '🩺', Control: '📋', Emergencia: '🚨', Examen: '🔬' }[tipo] ?? '🩺';
  }

  verHistorial(p: Paciente): void {
    this.drawerPaciente.set(p);
    this.cargandoHistorial.set(true);
    this.historial.set([]);
    this.srv.historial(p.id).subscribe(h => {
      this.historial.set(h);
      this.cargandoHistorial.set(false);
    });
  }
  cerrarDrawer(): void { this.drawerPaciente.set(null); }
}
