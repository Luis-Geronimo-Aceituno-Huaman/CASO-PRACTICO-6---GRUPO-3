import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { ChartComponent } from '../../shared/components/chart.component';
import { ReportesService } from '../../core/services/reportes.service';
import { MedicosService } from '../../core/services/medicos.service';
import { ToastService } from '../../core/services/toast.service';
import { Especialidad, ResumenEspecialidad } from '../../shared/models';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule, ChartComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
})
export class ReportesComponent implements OnInit {
  private srv = inject(ReportesService);
  private medicosSrv = inject(MedicosService);
  private toast = inject(ToastService);

  readonly cargando = signal(true);
  readonly especialidades = signal<Especialidad[]>([]);
  readonly resumen = signal<ResumenEspecialidad[]>([]);

  desde = '2026-05-01';
  hasta = '2026-06-09';
  filtroEsp = 0;

  linea: ChartConfiguration['data'] | null = null;
  barrasEsp: ChartConfiguration['data'] | null = null;
  barrasMed: ChartConfiguration['data'] | null = null;

  readonly opcHorizontal: ChartConfiguration['options'] = { indexAxis: 'y' };

  ngOnInit(): void {
    this.medicosSrv.especialidades().subscribe(e => this.especialidades.set(e));
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);

    this.srv.citasSemanales().subscribe(d => {
      this.linea = {
        labels: d.etiquetas,
        datasets: [{
          label: 'Citas por semana', data: d.valores,
          borderColor: '#1A6FBB', backgroundColor: 'rgba(26,111,187,0.12)',
          fill: true, tension: 0.35, pointBackgroundColor: '#1A6FBB',
          pointRadius: 4, borderWidth: 2,
        }],
      };
    });

    this.srv.distribucionEspecialidades().subscribe(d => {
      this.barrasEsp = {
        labels: d.map(x => x.especialidad),
        datasets: [{ label: 'Citas', data: d.map(x => x.total), backgroundColor: '#1A6FBB', borderRadius: 5 }],
      };
    });

    this.srv.medicosTop().subscribe(d => {
      this.barrasMed = {
        labels: d.map(x => x.especialidad),
        datasets: [{ label: 'Atendidas', data: d.map(x => x.total), backgroundColor: '#27AE60', borderRadius: 5 }],
      };
    });

    this.srv.resumen().subscribe(r => {
      this.resumen.set(r);
      this.cargando.set(false);
    });
  }

  exportarPDF(): void {
    this.toast.info('Generando PDF del reporte…');
    setTimeout(() => window.print(), 400);
  }
}
