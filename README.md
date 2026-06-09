# Meditech Salud Digital — Sistema Web Administrativo

**Caso Práctico 6 · Grupo 3**

Sistema administrativo para la clínica *Meditech Salud Digital*, desarrollado con **Angular 21**.
Está pensado para administradores y médicos, e incluye los módulos de **Dashboard, Pacientes,
Médicos, Citas y Reportes**, con un diseño profesional de tema claro.

> El proyecto Angular está en la carpeta [`meditech/`](meditech/).

---

## 🧱 ¿Qué diseñamos?

- **Modelos de dominio** (`shared/models`): definimos las interfaces TypeScript que representan la
  información de la clínica — `Paciente`, `Medico`, `Especialidad`, `Cita`, `Horario`,
  `EntradaHistorial` (con signos vitales) y los modelos de reportes. Son la base tipada de toda la app.

- **Servicios y APIs REST**: un servicio por dominio (`PacientesService`, `MedicosService`,
  `CitasService`, `ReportesService`, `AuthService`) que simula las APIs `/api/v1/*` con
  autenticación **JWT**. La capa HTTP usa `HttpClient` con dos interceptores: uno que agrega el
  token `Bearer` y otro que maneja errores 401/500.

- **Componentes reutilizables**: tarjetas KPI, gráficos, tablas, modales, chips de estado y toasts,
  construidos como componentes independientes con `@Input()` / `@Output()`.

- **Routing con Lazy Loading + AuthGuard**: cada módulo se carga solo cuando se necesita y las
  rutas están protegidas por un guard que valida el JWT.

- **Formularios Reactivos**: con validaciones síncronas (DNI, CMP, email, teléfono) y asíncronas
  (verificar DNI duplicado).

---

## 🚀 Cómo ejecutar

```bash
cd meditech
npm install
npm start        # http://localhost:4200
```

**Acceso de demo:** `admin@meditech.pe` / `admin123`

---

## 👥 Grupo 3

- Aceituno Huamán, Luis Geronimo
- Arteaga Espinoza, Jeanpierre Alexander
- Medrano Garay, Adriano Jesus
- Ocaña Suarez, Manuel Pierce
- Santos Sigüenza, Yajhaira Dayana
- Falcón Vilca, Jairo Daniel
- Gonzales Estela, Luis Alonso
