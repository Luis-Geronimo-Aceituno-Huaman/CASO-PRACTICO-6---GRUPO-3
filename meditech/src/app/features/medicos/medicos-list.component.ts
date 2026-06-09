import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Medico, Especialidad } from '../../shared/models';
import { MedicosService } from '../../core/services/medicos.service';
import { ToastService } from '../../core/services/toast.service';
import { EstadoChipComponent } from '../../shared/components/estado-chip.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { MedicoFormComponent } from './medico-form.component';
import { HorariosModalComponent } from './horarios-modal.component';

@Component({
  selector: 'app-medicos-list',
  standalone: true,
  imports: [FormsModule, EstadoChipComponent, ConfirmModalComponent, MedicoFormComponent, HorariosModalComponent],
  templateUrl: './medicos-list.component.html',
  styleUrl: './medicos-list.component.scss',
})
export class MedicosListComponent implements OnInit {
  private srv = inject(MedicosService);
  readonly toast = inject(ToastService);

  readonly cargando = signal(true);
  readonly medicos = signal<Medico[]>([]);
  readonly especialidades = signal<Especialidad[]>([]);
  readonly total = signal(0);
  readonly pagina = signal(1);
  readonly porPagina = 8;
  filtroEsp = 0;

  readonly formAbierto = signal(false);
  readonly editando = signal<Medico | null>(null);
  readonly aEliminar = signal<Medico | null>(null);
  readonly eliminando = signal(false);
  readonly horariosDe = signal<Medico | null>(null);

  ngOnInit(): void {
    this.srv.especialidades().subscribe(e => this.especialidades.set(e));
    this.cargar();
  }

  get totalPaginas(): number { return Math.max(1, Math.ceil(this.total() / this.porPagina)); }
  get paginas(): number[] { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }

  cargar(): void {
    this.cargando.set(true);
    this.srv.listar(this.filtroEsp || undefined, '', this.pagina(), this.porPagina).subscribe(r => {
      this.medicos.set(r.items);
      this.total.set(r.total);
      this.cargando.set(false);
    });
  }

  onFiltro(): void { this.pagina.set(1); this.cargar(); }
  irPagina(p: number): void {
    if (p < 1 || p > this.totalPaginas) return;
    this.pagina.set(p); this.cargar();
  }

  nuevo(): void { this.editando.set(null); this.formAbierto.set(true); }
  editar(m: Medico): void { this.editando.set(m); this.formAbierto.set(true); }
  onGuardado(): void {
    this.formAbierto.set(false);
    this.toast.success(this.editando() ? 'Médico actualizado.' : 'Médico registrado correctamente.');
    this.cargar();
  }

  pedirEliminar(m: Medico): void { this.aEliminar.set(m); }
  confirmarEliminar(): void {
    const m = this.aEliminar();
    if (!m) return;
    this.eliminando.set(true);
    this.srv.eliminar(m.id).subscribe(() => {
      this.eliminando.set(false);
      this.aEliminar.set(null);
      this.toast.success('Médico eliminado.');
      this.cargar();
    });
  }

  verHorarios(m: Medico): void { this.horariosDe.set(m); }
}
