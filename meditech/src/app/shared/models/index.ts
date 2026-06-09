// ============================================================
//  Modelos de dominio — Meditech Salud Digital
// ============================================================

export type EstadoActivo = 'Activo' | 'Inactivo';
export type EstadoCita = 'Pendiente' | 'Atendida' | 'Cancelada';
export type Turno = 'Mañana' | 'Tarde' | 'Noche';
export type TipoSangre = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'medico';
  avatar?: string;
}

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  telefono: string;
  correo?: string;
  direccion?: string;
  tipoSangre?: TipoSangre;
  alergias?: string;
  ultimaCita?: string;
  estado: EstadoActivo;
  fechaRegistro: string;
}

export interface SignosVitales {
  presion: string;      // ej: '120/80 mmHg'
  frecuencia: string;   // ej: '72 lpm'
  temperatura: string;  // ej: '36.6 °C'
  peso: string;         // ej: '74 kg'
}

export interface EntradaHistorial {
  id: number;
  idPaciente: number;
  fecha: string;
  medico: string;
  especialidad: string;
  motivo: string;
  tipo: 'Consulta' | 'Control' | 'Emergencia' | 'Examen';
  signos: SignosVitales;
  diagnostico: string;
  resultados: string;
  recetas: string;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
  estado?: 'Activa' | 'Inactiva';
  numMedicos: number;
}

export interface Medico {
  id: number;
  nombre: string;
  apellido: string;
  cmp: string;
  especialidad: string;
  especialidadId: number;
  telefono: string;
  correo: string;
  turno: Turno;
  estado: EstadoActivo;
}

/** Disponibilidad semanal: 7 días x N franjas. true = disponible */
export interface Horario {
  idMedico: number;
  franjas: string[];      // ej: ['08:00', '09:00', ...]
  dias: string[];         // ['Lun','Mar',...]
  disponibilidad: boolean[][]; // [dia][franja]
}

export interface Cita {
  id: number;
  idPaciente: number;
  paciente: string;
  idMedico: number;
  medico: string;
  especialidad: string;
  fecha: string;          // YYYY-MM-DD
  hora: string;           // HH:mm
  motivo?: string;
  estado: EstadoCita;
}

export interface Paginado<T> {
  items: T[];
  total: number;
  pagina: number;
  porPagina: number;
}

// ---- Reportes ----
export interface SerieDiaria {
  etiquetas: string[];
  valores: number[];
}
export interface DistribucionEspecialidad {
  especialidad: string;
  total: number;
}
export interface ResumenEspecialidad {
  especialidad: string;
  total: number;
  atendidas: number;
  canceladas: number;
  asistencia: number; // %
}
