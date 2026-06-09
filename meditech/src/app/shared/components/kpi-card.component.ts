import { Component, Input } from '@angular/core';

/**
 * <app-kpi-card> — Tarjeta KPI reutilizable (dashboard y reportes).
 * Recibe título, valor, ícono, tendencia y color por @Input().
 */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  template: `
    <div class="kpi" [style.borderLeftColor]="color" [class.loading]="cargando">
      <div class="kpi-head">
        <span class="kpi-icon" [style.background]="colorSuave" [style.color]="color">{{ icono }}</span>
        <span class="kpi-label">{{ titulo }}</span>
      </div>

      @if (cargando) {
        <div class="skeleton kpi-skel"></div>
      } @else {
        <div class="kpi-valor">{{ valor }}</div>
        @if (tendencia) {
          <div class="kpi-trend" [class.up]="tendenciaPositiva" [class.down]="!tendenciaPositiva">
            {{ tendenciaPositiva ? '↑' : '↓' }} {{ tendencia }}
          </div>
        } @else if (subtitulo) {
          <div class="kpi-sub">{{ subtitulo }}</div>
        }
      }
    </div>
  `,
  styles: [`
    .kpi {
      background: #fff;
      border: 1px solid #DDE3EC;
      border-left: 4px solid #1A6FBB;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      padding: 20px;
      transition: box-shadow 150ms ease, transform 150ms ease;
      animation: fadeUp 400ms ease both;
    }
    .kpi:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    .kpi-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .kpi-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .kpi-label { font-size: 13px; color: #6B7A8D; font-weight: 500; line-height: 1.3; }
    .kpi-valor { font-size: 36px; font-weight: 700; color: #1C2B3A; line-height: 1.1; letter-spacing: -1px; }
    .kpi-trend { font-size: 13px; font-weight: 600; margin-top: 6px; }
    .kpi-trend.up { color: #27AE60; }
    .kpi-trend.down { color: #E74C3C; }
    .kpi-sub { font-size: 13px; color: #6B7A8D; margin-top: 6px; font-weight: 600; }
    .kpi-skel { height: 40px; width: 70%; margin-top: 4px; }
  `],
})
export class KpiCardComponent {
  @Input() titulo = '';
  @Input() valor: string | number = '';
  @Input() icono = '📊';
  @Input() tendencia = '';
  @Input() tendenciaPositiva = true;
  @Input() subtitulo = '';
  @Input() color = '#1A6FBB';
  @Input() cargando = false;

  get colorSuave(): string {
    return this.hexToRgba(this.color, 0.1);
  }
  private hexToRgba(hex: string, a: number): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
}
