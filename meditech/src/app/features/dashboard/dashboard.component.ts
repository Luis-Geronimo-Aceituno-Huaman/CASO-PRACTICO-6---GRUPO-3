import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { ChartComponent } from '../../shared/components/chart.component';
import { EstadoChipComponent } from '../../shared/components/estado-chip.component';
import { CitasService } from '../../core/services/citas.service';
import { PacientesService } from '../../core/services/pacientes.service';
import { ReportesService } from '../../core/services/reportes.service';
import { MedicosService } from '../../core/services/medicos.service';
import { ToastService } from '../../core/services/toast.service';
import { Cita, Paciente, Medico, DistribucionEspecialidad } from '../../shared/models';

type DetalleKpi = 'citas' | 'atendidos' | 'medicos' | 'especialidades';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, KpiCardComponent, ChartComponent, EstadoChipComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private citasSrv = inject(CitasService);
  private pacientesSrv = inject(PacientesService);
  private reportesSrv = inject(ReportesService);
  private medicosSrv = inject(MedicosService);
  private toast = inject(ToastService);

  // ---- Detalle al hacer clic en un KPI ----
  readonly detalle = signal<DetalleKpi | null>(null);
  readonly cargandoDetalle = signal(false);
  readonly detCitas = signal<Cita[]>([]);
  readonly detMedicos = signal<Medico[]>([]);
  readonly detEspecialidades = signal<DistribucionEspecialidad[]>([]);

  readonly titulosDetalle: Record<DetalleKpi, string> = {
    citas: '📅 Citas de hoy',
    atendidos: '👥 Pacientes atendidos',
    medicos: '🩺 Médicos disponibles',
    especialidades: '🏥 Especialidades más solicitadas',
  };

  abrirDetalle(tipo: DetalleKpi): void {
    this.detalle.set(tipo);
    this.cargandoDetalle.set(true);

    if (tipo === 'citas') {
      this.citasSrv.listar({ fecha: this.hoy }).subscribe(c => {
        this.detCitas.set(c); this.cargandoDetalle.set(false);
      });
    } else if (tipo === 'atendidos') {
      this.citasSrv.listar({ estado: 'Atendida' }).subscribe(c => {
        this.detCitas.set(c); this.cargandoDetalle.set(false);
      });
    } else if (tipo === 'medicos') {
      this.medicosSrv.listar(undefined, '', 1, 100).subscribe(r => {
        this.detMedicos.set(r.items.filter(m => m.estado === 'Activo'));
        this.cargandoDetalle.set(false);
      });
    } else {
      this.reportesSrv.distribucionEspecialidades().subscribe(d => {
        this.detEspecialidades.set(d); this.cargandoDetalle.set(false);
      });
    }
  }

  cerrarDetalle(): void { this.detalle.set(null); }

  readonly cargando = signal(true);
  readonly hoy = '2026-06-09';
  readonly fechaLarga = 'Martes, 9 de junio de 2026';

  readonly proximas = signal<Cita[]>([]);
  readonly recientes = signal<Paciente[]>([]);

  barras: ChartConfiguration['data'] | null = null;
  dona: ChartConfiguration['data'] | null = null;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);

    this.reportesSrv.citasDiarias().subscribe(d => {
      this.barras = {
        labels: d.etiquetas,
        datasets: [{
          label: 'Citas', data: d.valores,
          backgroundColor: '#1A6FBB', borderRadius: 6, maxBarThickness: 38,
        }],
      };
    });

    this.reportesSrv.distribucionEspecialidades().subscribe(d => {
      this.dona = {
        labels: d.slice(0, 5).map(x => x.especialidad),
        datasets: [{
          data: d.slice(0, 5).map(x => x.total),
          backgroundColor: ['#1A6FBB', '#27AE60', '#F39C12', '#9B59B6', '#E74C3C'],
          borderWidth: 0,
        }],
      };
    });

    this.citasSrv.proximasDeHoy(this.hoy, 5).subscribe(c => this.proximas.set(c));
    this.pacientesSrv.recientes(5).subscribe(p => {
      this.recientes.set(p);
      this.cargando.set(false);
    });
  }

  actualizar(): void {
    this.cargar();
    this.toast.info('Datos del dashboard actualizados');
  }
}
