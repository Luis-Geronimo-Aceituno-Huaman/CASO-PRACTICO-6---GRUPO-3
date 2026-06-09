import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico, Especialidad, Horario, Paginado } from '../../shared/models';
import { MEDICOS, ESPECIALIDADES, HORARIO_DIAS, HORARIO_FRANJAS } from './mock-db';

const LATENCIA = 450;

/**
 * MedicosService — simula:
 *   GET /api/v1/medicos        POST/PUT/DELETE /api/v1/medicos/{id}
 *   GET /api/v1/medicos/{id}/horarios
 *   GET /api/v1/especialidades
 */
@Injectable({ providedIn: 'root' })
export class MedicosService {
  private data: Medico[] = MEDICOS.map(m => ({ ...m }));
  private seq = MEDICOS.length;

  listar(especialidadId?: number, busqueda = '', pagina = 1, porPagina = 8): Observable<Paginado<Medico>> {
    const q = busqueda.trim().toLowerCase();
    const filtrados = this.data.filter(m =>
      (!especialidadId || m.especialidadId === especialidadId) &&
      (!q || `${m.nombre} ${m.apellido}`.toLowerCase().includes(q) || m.cmp.toLowerCase().includes(q)));
    const total = filtrados.length;
    const ini = (pagina - 1) * porPagina;
    return of({ items: filtrados.slice(ini, ini + porPagina), total, pagina, porPagina }).pipe(delay(LATENCIA));
  }

  obtener(id: number): Observable<Medico | undefined> {
    return of(this.data.find(m => m.id === id)).pipe(delay(LATENCIA));
  }

  crear(m: Omit<Medico, 'id' | 'estado'>): Observable<Medico> {
    const nuevo: Medico = { ...m, id: ++this.seq, estado: 'Activo' };
    this.data.unshift(nuevo);
    return of(nuevo).pipe(delay(LATENCIA));
  }

  actualizar(id: number, cambios: Partial<Medico>): Observable<Medico> {
    const i = this.data.findIndex(m => m.id === id);
    this.data[i] = { ...this.data[i], ...cambios };
    return of(this.data[i]).pipe(delay(LATENCIA));
  }

  eliminar(id: number): Observable<void> {
    this.data = this.data.filter(m => m.id !== id);
    return of(void 0).pipe(delay(LATENCIA));
  }

  especialidades(): Observable<Especialidad[]> {
    return of(ESPECIALIDADES.map(e => ({ ...e }))).pipe(delay(300));
  }

  horarios(idMedico: number): Observable<Horario> {
    // Disponibilidad pseudo-determinística por médico
    const disponibilidad = HORARIO_DIAS.map((_, d) =>
      HORARIO_FRANJAS.map((_, f) => ((idMedico + d * 3 + f * 2) % 5) !== 0 && d < 6));
    return of({
      idMedico, dias: HORARIO_DIAS, franjas: HORARIO_FRANJAS, disponibilidad,
    }).pipe(delay(LATENCIA));
  }

  guardarHorarios(_h: Horario): Observable<void> {
    return of(void 0).pipe(delay(LATENCIA));
  }
}
