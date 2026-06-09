// ============================================================
//  Base de datos mock en memoria — simula el backend REST.
//  En producción estas colecciones vendrían de las APIs
//  /api/v1/* mediante HttpClient + interceptor JWT.
// ============================================================
import {
  Paciente, Medico, Cita, Especialidad, EntradaHistorial,
} from '../../shared/models';

export const ESPECIALIDADES: Especialidad[] = [
  { id: 1, nombre: 'Cardiología', numMedicos: 3 },
  { id: 2, nombre: 'Pediatría', numMedicos: 2 },
  { id: 3, nombre: 'Dermatología', numMedicos: 2 },
  { id: 4, nombre: 'Traumatología', numMedicos: 2 },
  { id: 5, nombre: 'Ginecología', numMedicos: 1 },
  { id: 6, nombre: 'Neurología', numMedicos: 1 },
  { id: 7, nombre: 'Medicina General', numMedicos: 1 },
];

export const PACIENTES: Paciente[] = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez Ramos', dni: '45872103', fechaNacimiento: '1985-03-12', telefono: '987654321', correo: 'juan.perez@mail.com', direccion: 'Av. Arequipa 1234, Lima', tipoSangre: 'O+', alergias: 'Penicilina', ultimaCita: '2026-05-28', estado: 'Activo', fechaRegistro: '2025-11-02' },
  { id: 2, nombre: 'María', apellido: 'Gonzáles Soto', dni: '40123987', fechaNacimiento: '1990-07-21', telefono: '912345678', correo: 'maria.gs@mail.com', direccion: 'Jr. Lampa 456, Lima', tipoSangre: 'A+', alergias: 'Ninguna', ultimaCita: '2026-06-01', estado: 'Activo', fechaRegistro: '2025-12-15' },
  { id: 3, nombre: 'Carlos', apellido: 'Quispe Mamani', dni: '70654321', fechaNacimiento: '1978-11-05', telefono: '998877665', correo: 'carlos.q@mail.com', direccion: 'Av. Brasil 789, Lima', tipoSangre: 'B+', alergias: 'Aspirina', ultimaCita: '2026-05-30', estado: 'Activo', fechaRegistro: '2026-01-09' },
  { id: 4, nombre: 'Ana', apellido: 'Torres Vega', dni: '46789012', fechaNacimiento: '1995-02-18', telefono: '955443322', correo: 'ana.torres@mail.com', direccion: 'Calle Los Pinos 12, Surco', tipoSangre: 'AB+', alergias: 'Ninguna', ultimaCita: '2026-06-03', estado: 'Activo', fechaRegistro: '2026-02-20' },
  { id: 5, nombre: 'Luis', apellido: 'Fernández Díaz', dni: '41258963', fechaNacimiento: '1982-09-30', telefono: '966112233', correo: 'luis.fd@mail.com', direccion: 'Av. La Marina 321, San Miguel', tipoSangre: 'O-', alergias: 'Mariscos', ultimaCita: '2026-05-25', estado: 'Activo', fechaRegistro: '2026-03-01' },
  { id: 6, nombre: 'Rosa', apellido: 'Huamán Flores', dni: '72589631', fechaNacimiento: '2000-12-01', telefono: '944556677', correo: 'rosa.h@mail.com', direccion: 'Jr. Puno 159, Lima', tipoSangre: 'A-', alergias: 'Ninguna', ultimaCita: '2026-06-05', estado: 'Activo', fechaRegistro: '2026-03-18' },
  { id: 7, nombre: 'Pedro', apellido: 'Salazar Ruiz', dni: '43698521', fechaNacimiento: '1970-06-14', telefono: '933221100', correo: 'pedro.sr@mail.com', direccion: 'Av. Javier Prado 852, San Isidro', tipoSangre: 'B-', alergias: 'Látex', ultimaCita: '2026-05-20', estado: 'Inactivo', fechaRegistro: '2026-04-05' },
  { id: 8, nombre: 'Lucía', apellido: 'Mendoza Castro', dni: '47852369', fechaNacimiento: '1998-04-22', telefono: '922334455', correo: 'lucia.mc@mail.com', direccion: 'Calle Las Begonias 44, San Isidro', tipoSangre: 'O+', alergias: 'Ninguna', ultimaCita: '2026-06-06', estado: 'Activo', fechaRegistro: '2026-04-28' },
  { id: 9, nombre: 'Jorge', apellido: 'Ramírez León', dni: '42587419', fechaNacimiento: '1988-08-08', telefono: '911223344', correo: 'jorge.rl@mail.com', direccion: 'Av. Petit Thouars 963, Lima', tipoSangre: 'AB-', alergias: 'Polen', ultimaCita: '2026-06-04', estado: 'Activo', fechaRegistro: '2026-05-10' },
  { id: 10, nombre: 'Carmen', apellido: 'Vargas Ríos', dni: '48963258', fechaNacimiento: '1992-01-27', telefono: '900112233', correo: 'carmen.vr@mail.com', direccion: 'Jr. Cusco 753, Lima', tipoSangre: 'A+', alergias: 'Ninguna', ultimaCita: '2026-06-07', estado: 'Activo', fechaRegistro: '2026-05-29' },
];

export const MEDICOS: Medico[] = [
  { id: 1, nombre: 'Roberto', apellido: 'Linares Poma', cmp: 'CMP-28471', especialidad: 'Cardiología', especialidadId: 1, telefono: '987111222', correo: 'rlinares@meditech.pe', turno: 'Mañana', estado: 'Activo' },
  { id: 2, nombre: 'Patricia', apellido: 'Cordero Núñez', cmp: 'CMP-33982', especialidad: 'Pediatría', especialidadId: 2, telefono: '987222333', correo: 'pcordero@meditech.pe', turno: 'Tarde', estado: 'Activo' },
  { id: 3, nombre: 'Miguel', apellido: 'Ávalos Ponce', cmp: 'CMP-19283', especialidad: 'Dermatología', especialidadId: 3, telefono: '987333444', correo: 'mavalos@meditech.pe', turno: 'Mañana', estado: 'Activo' },
  { id: 4, nombre: 'Elena', apellido: 'Bravo Suárez', cmp: 'CMP-40512', especialidad: 'Traumatología', especialidadId: 4, telefono: '987444555', correo: 'ebravo@meditech.pe', turno: 'Noche', estado: 'Activo' },
  { id: 5, nombre: 'Fernando', apellido: 'Gutiérrez Lazo', cmp: 'CMP-22781', especialidad: 'Ginecología', especialidadId: 5, telefono: '987555666', correo: 'fgutierrez@meditech.pe', turno: 'Tarde', estado: 'Activo' },
  { id: 6, nombre: 'Sandra', apellido: 'Reyes Campos', cmp: 'CMP-37159', especialidad: 'Neurología', especialidadId: 6, telefono: '987666777', correo: 'sreyes@meditech.pe', turno: 'Mañana', estado: 'Activo' },
  { id: 7, nombre: 'Andrés', apellido: 'Paredes Vila', cmp: 'CMP-15093', especialidad: 'Cardiología', especialidadId: 1, telefono: '987777888', correo: 'aparedes@meditech.pe', turno: 'Tarde', estado: 'Activo' },
  { id: 8, nombre: 'Gabriela', apellido: 'Ño Chávez', cmp: 'CMP-41267', especialidad: 'Pediatría', especialidadId: 2, telefono: '987888999', correo: 'gncha@meditech.pe', turno: 'Mañana', estado: 'Activo' },
  { id: 9, nombre: 'Hugo', apellido: 'Delgado Rojas', cmp: 'CMP-30084', especialidad: 'Medicina General', especialidadId: 7, telefono: '987999000', correo: 'hdelgado@meditech.pe', turno: 'Noche', estado: 'Inactivo' },
  { id: 10, nombre: 'Verónica', apellido: 'Espinoza Tito', cmp: 'CMP-26618', especialidad: 'Dermatología', especialidadId: 3, telefono: '987010101', correo: 'vespinoza@meditech.pe', turno: 'Tarde', estado: 'Activo' },
  { id: 11, nombre: 'Daniel', apellido: 'Cáceres Mora', cmp: 'CMP-39472', especialidad: 'Cardiología', especialidadId: 1, telefono: '987020202', correo: 'dcaceres@meditech.pe', turno: 'Mañana', estado: 'Activo' },
  { id: 12, nombre: 'Isabel', apellido: 'Romero Pinto', cmp: 'CMP-31755', especialidad: 'Traumatología', especialidadId: 4, telefono: '987030303', correo: 'iromero@meditech.pe', turno: 'Tarde', estado: 'Activo' },
];

const horas = ['08:00', '09:00', '10:00', '11:00', '15:00', '16:00', '17:00', '19:00', '20:00'];
function citaRand(i: number, fecha: string, hora: string, idP: number, idM: number, estado: Cita['estado']): Cita {
  const p = PACIENTES.find(x => x.id === idP)!;
  const m = MEDICOS.find(x => x.id === idM)!;
  return {
    id: i, idPaciente: idP, paciente: `${p.nombre} ${p.apellido}`,
    idMedico: idM, medico: `Dr. ${m.nombre} ${m.apellido}`, especialidad: m.especialidad,
    fecha, hora, estado, motivo: 'Consulta médica',
  };
}

export const CITAS: Cita[] = [
  citaRand(1, '2026-06-09', '08:00', 1, 1, 'Pendiente'),
  citaRand(2, '2026-06-09', '09:00', 2, 2, 'Pendiente'),
  citaRand(3, '2026-06-09', '10:00', 3, 3, 'Atendida'),
  citaRand(4, '2026-06-09', '11:00', 4, 4, 'Pendiente'),
  citaRand(5, '2026-06-09', '15:00', 5, 5, 'Cancelada'),
  citaRand(6, '2026-06-09', '16:00', 6, 6, 'Pendiente'),
  citaRand(7, '2026-06-09', '17:00', 8, 7, 'Atendida'),
  citaRand(8, '2026-06-10', '08:00', 9, 1, 'Pendiente'),
  citaRand(9, '2026-06-10', '09:00', 10, 8, 'Pendiente'),
  citaRand(10, '2026-06-10', '10:00', 1, 11, 'Pendiente'),
  citaRand(11, '2026-06-11', '11:00', 2, 12, 'Pendiente'),
  citaRand(12, '2026-06-12', '15:00', 3, 5, 'Atendida'),
  citaRand(13, '2026-06-12', '16:00', 4, 10, 'Pendiente'),
  citaRand(14, '2026-06-05', '08:00', 5, 1, 'Atendida'),
  citaRand(15, '2026-06-05', '09:00', 6, 2, 'Atendida'),
  citaRand(16, '2026-06-06', '10:00', 8, 3, 'Cancelada'),
  citaRand(17, '2026-06-15', '17:00', 9, 4, 'Pendiente'),
  citaRand(18, '2026-06-18', '19:00', 10, 6, 'Pendiente'),
  citaRand(19, '2026-06-20', '20:00', 1, 7, 'Pendiente'),
  citaRand(20, '2026-06-09', '19:00', 7, 9, 'Pendiente'),
];

export const HISTORIAL: EntradaHistorial[] = [
  { id: 1, idPaciente: 1, fecha: '2026-05-28', medico: 'Dr. Roberto Linares', especialidad: 'Cardiología', motivo: 'Dolor torácico ocasional y fatiga', tipo: 'Consulta',
    signos: { presion: '140/90 mmHg', frecuencia: '78 lpm', temperatura: '36.7 °C', peso: '82 kg' },
    diagnostico: 'Hipertensión arterial leve (HTA grado 1)', resultados: 'ECG sin alteraciones isquémicas. Perfil lipídico levemente elevado (LDL 138 mg/dL). Se indica monitoreo ambulatorio de presión arterial.', recetas: 'Losartán 50mg — 1 comprimido c/24h por la mañana. Dieta hiposódica. Control en 30 días.' },
  { id: 2, idPaciente: 1, fecha: '2026-02-10', medico: 'Dr. Andrés Paredes', especialidad: 'Cardiología', motivo: 'Chequeo cardiológico anual', tipo: 'Control',
    signos: { presion: '128/82 mmHg', frecuencia: '70 lpm', temperatura: '36.5 °C', peso: '83 kg' },
    diagnostico: 'Evaluación cardiovascular de rutina — sin hallazgos patológicos', resultados: 'Ecocardiograma con función ventricular conservada (FEVI 62%). Prueba de esfuerzo negativa para isquemia.', recetas: 'Mantener actividad física regular. Reevaluación en 3 meses.' },
  { id: 3, idPaciente: 1, fecha: '2025-11-15', medico: 'Dr. Hugo Delgado', especialidad: 'Medicina General', motivo: 'Malestar general, congestión nasal', tipo: 'Consulta',
    signos: { presion: '122/80 mmHg', frecuencia: '74 lpm', temperatura: '37.8 °C', peso: '84 kg' },
    diagnostico: 'Infección respiratoria alta de origen viral (resfriado común)', resultados: 'Cuadro viral autolimitado. No se evidencia compromiso pulmonar a la auscultación.', recetas: 'Paracetamol 500mg c/8h por 3 días. Hidratación abundante y reposo relativo.' },
  { id: 4, idPaciente: 2, fecha: '2026-06-01', medico: 'Dra. Patricia Cordero', especialidad: 'Pediatría', motivo: 'Control de crecimiento y desarrollo', tipo: 'Control',
    signos: { presion: '110/70 mmHg', frecuencia: '88 lpm', temperatura: '36.6 °C', peso: '58 kg' },
    diagnostico: 'Desarrollo dentro de parámetros normales para la edad', resultados: 'Curva de crecimiento adecuada. Esquema de vacunación completo y al día.', recetas: 'Suplemento de Vitamina D 1000 UI/día. Control en 6 meses.' },
  { id: 5, idPaciente: 3, fecha: '2026-05-30', medico: 'Dr. Miguel Ávalos', especialidad: 'Dermatología', motivo: 'Lesión cutánea pruriginosa en antebrazo', tipo: 'Consulta',
    signos: { presion: '118/76 mmHg', frecuencia: '72 lpm', temperatura: '36.4 °C', peso: '69 kg' },
    diagnostico: 'Dermatitis de contacto alérgica', resultados: 'Lesión eritematosa con descamación leve en cara anterior de antebrazo derecho. Sin signos de sobreinfección.', recetas: 'Hidrocortisona 1% tópica c/12h por 7 días. Evitar contacto con agente irritante identificado.' },
  { id: 6, idPaciente: 1, fecha: '2025-08-03', medico: 'Dra. Sandra Reyes', especialidad: 'Neurología', motivo: 'Cefalea recurrente', tipo: 'Examen',
    signos: { presion: '130/85 mmHg', frecuencia: '76 lpm', temperatura: '36.6 °C', peso: '83 kg' },
    diagnostico: 'Cefalea tensional episódica', resultados: 'Examen neurológico sin focalización. TAC cerebral sin lesiones agudas.', recetas: 'Manejo del estrés, higiene del sueño. Ibuprofeno 400mg condicional al dolor.' },
];

export const HORARIO_FRANJAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
export const HORARIO_DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
