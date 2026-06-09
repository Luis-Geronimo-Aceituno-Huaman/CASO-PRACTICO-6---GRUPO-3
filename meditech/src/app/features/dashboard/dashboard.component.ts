import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { ChartComponent } from '../../shared/components/chart.component';
import { EstadoChipComponent } from '../../shared/components/estado-chip.component';
import { CitasService } from '../../core/services/citas.service';
import { PacientesService } from '../../core/services/pacientes.service';
import { ReportesService } from '../../core/services/reportes.service';
import { ToastService } from '../../core/services/toast.service';
import { Cita, Paciente } from '../../shared/models';

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
  private toast = inject(ToastService);

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
