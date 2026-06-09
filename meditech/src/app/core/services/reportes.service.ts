import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SerieDiaria, DistribucionEspecialidad, ResumenEspecialidad } from '../../shared/models';
import { CITAS, ESPECIALIDADES } from './mock-db';

const LATENCIA = 500;

/**
 * ReportesService — simula:
 *   GET /api/v1/reportes/citas-diarias
 *   GET /api/v1/reportes/especialidades
 */
@Injectable({ providedIn: 'root' })
export class ReportesService {
  /** Citas por día — últimos 7 días (gráfico de barras / línea). */
  citasDiarias(): Observable<SerieDiaria> {
    const etiquetas = ['Mié 3', 'Jue 4', 'Vie 5', 'Sáb 6', 'Dom 7', 'Lun 8', 'Mar 9'];
    const valores = [32, 41, 38, 27, 19, 45, 48];
    return of({ etiquetas, valores }).pipe(delay(LATENCIA));
  }

  /** Evolución semanal — para el reporte (gráfico de línea). */
  citasSemanales(): Observable<SerieDiaria> {
    const etiquetas = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];
    const valores = [180, 215, 198, 240, 226, 268];
    return of({ etiquetas, valores }).pipe(delay(LATENCIA));
  }

  /** Distribución por especialidad (gráfico de dona / barras). */
  distribucionEspecialidades(): Observable<DistribucionEspecialidad[]> {
    const conteo = ESPECIALIDADES.map(e => ({
      especialidad: e.nombre,
      total: CITAS.filter(c => c.especialidad === e.nombre).length + e.numMedicos * 4,
    })).sort((a, b) => b.total - a.total);
    return of(conteo).pipe(delay(LATENCIA));
  }

  /** Médicos con más citas atendidas. */
  medicosTop(): Observable<DistribucionEspecialidad[]> {
    return of([
      { especialidad: 'Dr. R. Linares', total: 64 },
      { especialidad: 'Dra. P. Cordero', total: 58 },
      { especialidad: 'Dr. M. Ávalos', total: 51 },
      { especialidad: 'Dra. E. Bravo', total: 47 },
      { especialidad: 'Dr. A. Paredes', total: 39 },
    ]).pipe(delay(LATENCIA));
  }

  /** Tabla resumen exportable por especialidad. */
  resumen(): Observable<ResumenEspecialidad[]> {
    const filas = ESPECIALIDADES.map(e => {
      const total = CITAS.filter(c => c.especialidad === e.nombre).length + e.numMedicos * 6;
      const canceladas = Math.round(total * 0.12);
      const atendidas = total - canceladas - Math.round(total * 0.1);
      return {
        especialidad: e.nombre, total, atendidas, canceladas,
        asistencia: Math.round((atendidas / total) * 100),
      };
    });
    return of(filas).pipe(delay(LATENCIA));
  }
}
