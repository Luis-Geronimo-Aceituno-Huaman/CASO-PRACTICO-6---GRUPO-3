import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Paciente, Paginado, EntradaHistorial } from '../../shared/models';
import { PACIENTES, HISTORIAL } from './mock-db';

const LATENCIA = 450;

/**
 * PacientesService — consume (simula) las APIs REST:
 *   GET    /api/v1/pacientes
 *   GET    /api/v1/pacientes/{id}
 *   POST   /api/v1/pacientes
 *   PUT    /api/v1/pacientes/{id}
 *   DELETE /api/v1/pacientes/{id}
 *   GET    /api/v1/historial/{idPaciente}
 */
@Injectable({ providedIn: 'root' })
export class PacientesService {
  private data: Paciente[] = PACIENTES.map(p => ({ ...p }));
  private seq = PACIENTES.length;

  listar(busqueda = '', pagina = 1, porPagina = 8): Observable<Paginado<Paciente>> {
    const q = busqueda.trim().toLowerCase();
    const filtrados = this.data.filter(p =>
      !q ||
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
      p.dni.includes(q) ||
      (p.telefono ?? '').includes(q));
    const total = filtrados.length;
    const ini = (pagina - 1) * porPagina;
    const items = filtrados.slice(ini, ini + porPagina);
    return of({ items, total, pagina, porPagina }).pipe(delay(LATENCIA));
  }

  obtener(id: number): Observable<Paciente | undefined> {
    return of(this.data.find(p => p.id === id)).pipe(delay(LATENCIA));
  }

  /** Validación asíncrona: verifica DNI duplicado en la "API". */
  dniExiste(dni: string, exceptoId?: number): Observable<boolean> {
    const existe = this.data.some(p => p.dni === dni && p.id !== exceptoId);
    return of(existe).pipe(delay(500));
  }

  crear(p: Omit<Paciente, 'id' | 'fechaRegistro' | 'estado'>): Observable<Paciente> {
    const nuevo: Paciente = {
      ...p, id: ++this.seq, estado: 'Activo', fechaRegistro: '2026-06-09',
    };
    this.data.unshift(nuevo);
    return of(nuevo).pipe(delay(LATENCIA));
  }

  actualizar(id: number, cambios: Partial<Paciente>): Observable<Paciente> {
    const i = this.data.findIndex(p => p.id === id);
    this.data[i] = { ...this.data[i], ...cambios };
    return of(this.data[i]).pipe(delay(LATENCIA));
  }

  eliminar(id: number): Observable<void> {
    this.data = this.data.filter(p => p.id !== id);
    return of(void 0).pipe(delay(LATENCIA));
  }

  historial(idPaciente: number): Observable<EntradaHistorial[]> {
    const items = HISTORIAL.filter(h => h.idPaciente === idPaciente)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    return of(items).pipe(delay(LATENCIA));
  }

  recientes(limit = 5): Observable<Paciente[]> {
    const items = [...this.data]
      .sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro))
      .slice(0, limit);
    return of(items).pipe(delay(LATENCIA));
  }
}
