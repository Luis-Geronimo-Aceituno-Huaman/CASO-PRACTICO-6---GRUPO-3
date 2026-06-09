import {
  Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild, AfterViewInit,
} from '@angular/core';
import {
  Chart, ChartConfiguration, ChartType, registerables,
} from 'chart.js';

Chart.register(...registerables);

/**
 * <app-chart> — Envoltura reutilizable de Chart.js.
 * Mantiene la paleta del sistema por defecto.
 */
@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<div class="chart-wrap"><canvas #canvas></canvas></div>`,
  styles: [`
    .chart-wrap { position: relative; width: 100%; height: 100%; min-height: 220px; }
    canvas { max-width: 100%; }
  `],
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() type: ChartType = 'bar';
  @Input() data!: ChartConfiguration['data'];
  @Input() options: ChartConfiguration['options'] = {};

  private chart?: Chart;
  private ready = false;

  ngAfterViewInit(): void {
    this.ready = true;
    this.render();
  }

  ngOnChanges(): void {
    if (this.ready) this.render();
  }

  private render(): void {
    if (!this.data || !this.canvasRef) return;
    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { font: { family: 'Inter', size: 12 }, color: '#6B7A8D', usePointStyle: true, padding: 16 },
          },
        },
        scales: this.type === 'doughnut' || this.type === 'pie' ? undefined : {
          x: { grid: { display: false }, ticks: { font: { family: 'Inter' }, color: '#6B7A8D' } },
          y: { grid: { color: '#F0F2F5' }, ticks: { font: { family: 'Inter' }, color: '#6B7A8D' }, beginAtZero: true },
        },
        ...this.options,
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
