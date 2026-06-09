import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cita, EstadoCita } from '../../shared/models';
import { CITAS, PACIENTES, MEDICOS } from './mock-db';

const LATENCIA = 450;

export interface FiltrosCita {
  fecha?: string;
  idMedico?: number;
  estado?: EstadoCita;
}

/**
 * CitasService — simula:
 *   GET    /api/v1/citas (con filtros)
 *   POST   /api/v1/citas
 *   PUT    /api/v1/citas/{id}         (reprogramar)
 *   PATCH  /api/v1/citas/{id}/estado  (cambiar estado)
 *   DELETE /api/v1/citas/{id}         (cancelar)
 */
@Injectable({ providedIn: 'root' })
export class CitasService {
  private data: Cita[] = CITAS.map(c => ({ ...c }));
  private seq = CITAS.length;

  listar(filtros: FiltrosCita = {}): Observable<Cita[]> {
    const items = this.data.filter(c =>
      (!filtros.fecha || c.fecha === filtros.fecha) &&
      (!filtros.idMedico || c.idMedico === filtros.idMedico) &&
      (!filtros.estado || c.estado === filtros.estado))
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    return of(items).pipe(delay(LATENCIA));
  }

  proximasDeHoy(fechaHoy: string, limit = 5): Observable<Cita[]> {
    const items = this.data
      .filter(c => c.fecha === fechaHoy && c.estado !== 'Cancelada')
      .sort((a, b) => a.hora.localeCompare(b.hora))
      .slice(0, limit);
    return of(items).pipe(delay(LATENCIA));
  }

  crear(c: Omit<Cita, 'id' | 'paciente' | 'medico' | 'especialidad' | 'estado'>): Observable<Cita> {
    const p = PACIENTES.find(x => x.id === c.idPaciente);
    const m = MEDICOS.find(x => x.id === c.idMedico);
    const nueva: Cita = {
      ...c, id: ++this.seq,
      paciente: p ? `${p.nombre} ${p.apellido}` : 'Paciente',
      medico: m ? `Dr. ${m.nombre} ${m.apellido}` : 'Médico',
      especialidad: m ? m.especialidad : '',
      estado: 'Pendiente',
    };
    this.data.push(nueva);
    return of(nueva).pipe(delay(LATENCIA));
  }

  reprogramar(id: number, fecha: string, hora: string): Observable<Cita> {
    const i = this.data.findIndex(c => c.id === id);
    this.data[i] = { ...this.data[i], fecha, hora };
    return of(this.data[i]).pipe(delay(LATENCIA));
  }

  cambiarEstado(id: number, estado: EstadoCita): Observable<Cita> {
    const i = this.data.findIndex(c => c.id === id);
    this.data[i] = { ...this.data[i], estado };
    return of(this.data[i]).pipe(delay(300));
  }

  eliminar(id: number): Observable<void> {
    this.data = this.data.filter(c => c.id !== id);
    return of(void 0).pipe(delay(LATENCIA));
  }
}
