import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cita, Medico, EstadoCita } from '../../shared/models';
import { CitasService } from '../../core/services/citas.service';
import { MedicosService } from '../../core/services/medicos.service';
import { ToastService } from '../../core/services/toast.service';
import { EstadoChipComponent } from '../../shared/components/estado-chip.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { CitaFormComponent } from './cita-form.component';

interface DiaCalendario {
  fecha: string;
  numero: number;
  delMes: boolean;
  citas: Cita[];
}

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [FormsModule, EstadoChipComponent, ConfirmModalComponent, CitaFormComponent],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss',
})
export class CitasComponent implements OnInit {
  private srv = inject(CitasService);
  private medicosSrv = inject(MedicosService);
  private toast = inject(ToastService);

  readonly modo = signal<'lista' | 'calendario'>('lista');
  readonly cargando = signal(true);
  readonly citas = signal<Cita[]>([]);
  readonly medicos = signal<Medico[]>([]);

  // filtros
  filtroFecha = '';
  filtroMedico = 0;
  filtroEstado = '';

  // modales
  readonly formAbierto = signal(false);
  readonly aCancelar = signal<Cita | null>(null);
  readonly cancelando = signal(false);
  readonly reprogramar = signal<Cita | null>(null);
  repFecha = '';
  repHora = '';

  // calendario
  readonly anio = signal(2026);
  readonly mes = signal(5); // junio (0-index)
  readonly diaSel = signal<string | null>(null);
  readonly nombresMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  readonly diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  readonly diasCalendario = computed<DiaCalendario[]>(() => this.construirMes());
  readonly citasDelDia = computed<Cita[]>(() => {
    const d = this.diaSel();
    return d ? this.citas().filter(c => c.fecha === d).sort((a, b) => a.hora.localeCompare(b.hora)) : [];
  });

  estados: EstadoCita[] = ['Pendiente', 'Atendida', 'Cancelada'];

  ngOnInit(): void {
    this.medicosSrv.listar(undefined, '', 1, 100).subscribe(r => this.medicos.set(r.items));
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.srv.listar({
      fecha: this.filtroFecha || undefined,
      idMedico: this.filtroMedico || undefined,
      estado: (this.filtroEstado || undefined) as EstadoCita | undefined,
    }).subscribe(c => {
      this.citas.set(c);
      this.cargando.set(false);
    });
  }

  limpiarFiltros(): void {
    this.filtroFecha = ''; this.filtroMedico = 0; this.filtroEstado = '';
    this.cargar();
  }

  // ---- acciones ----
  nueva(): void { this.formAbierto.set(true); }
  onGuardado(): void {
    this.formAbierto.set(false);
    this.toast.success('Cita registrada correctamente.');
    this.cargar();
  }

  marcarAtendida(c: Cita): void {
    this.srv.cambiarEstado(c.id, 'Atendida').subscribe(() => {
      this.toast.success(`Cita de ${c.paciente} marcada como atendida.`);
      this.cargar();
    });
  }

  abrirReprogramar(c: Cita): void {
    this.reprogramar.set(c);
    this.repFecha = c.fecha;
    this.repHora = c.hora;
  }
  confirmarReprogramar(): void {
    const c = this.reprogramar();
    if (!c || !this.repFecha || !this.repHora) return;
    this.srv.reprogramar(c.id, this.repFecha, this.repHora).subscribe(() => {
      this.reprogramar.set(null);
      this.toast.success('Cita reprogramada.');
      this.cargar();
    });
  }

  pedirCancelar(c: Cita): void { this.aCancelar.set(c); }
  confirmarCancelar(): void {
    const c = this.aCancelar();
    if (!c) return;
    this.cancelando.set(true);
    this.srv.cambiarEstado(c.id, 'Cancelada').subscribe(() => {
      this.cancelando.set(false);
      this.aCancelar.set(null);
      this.toast.warning('Cita cancelada.');
      this.cargar();
    });
  }

  // ---- calendario ----
  cambiarMes(delta: number): void {
    let m = this.mes() + delta;
    let a = this.anio();
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    this.mes.set(m); this.anio.set(a);
    this.diaSel.set(null);
  }

  seleccionarDia(d: DiaCalendario): void {
    if (d.citas.length) this.diaSel.set(d.fecha);
  }

  claseDia(c: Cita): string {
    return { Pendiente: 'pt', Atendida: 'at', Cancelada: 'cl' }[c.estado];
  }

  private fmt(a: number, m: number, d: number): string {
    return `${a}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  private construirMes(): DiaCalendario[] {
    const a = this.anio(), m = this.mes();
    const primer = new Date(a, m, 1);
    const offset = (primer.getDay() + 6) % 7; // lunes = 0
    const diasMes = new Date(a, m + 1, 0).getDate();
    const diasPrev = new Date(a, m, 0).getDate();
    const celdas: DiaCalendario[] = [];

    for (let i = offset - 1; i >= 0; i--) {
      const num = diasPrev - i;
      const fecha = this.fmt(m === 0 ? a - 1 : a, m === 0 ? 11 : m - 1, num);
      celdas.push({ fecha, numero: num, delMes: false, citas: this.citasEn(fecha) });
    }
    for (let d = 1; d <= diasMes; d++) {
      const fecha = this.fmt(a, m, d);
      celdas.push({ fecha, numero: d, delMes: true, citas: this.citasEn(fecha) });
    }
    let next = 1;
    while (celdas.length % 7 !== 0 || celdas.length < 42) {
      const fecha = this.fmt(m === 11 ? a + 1 : a, m === 11 ? 0 : m + 1, next);
      celdas.push({ fecha, numero: next++, delMes: false, citas: this.citasEn(fecha) });
      if (celdas.length >= 42) break;
    }
    return celdas;
  }

  private citasEn(fecha: string): Cita[] {
    return this.citas().filter(c => c.fecha === fecha);
  }
}
