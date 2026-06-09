# Meditech Salud Digital — Sistema Web Administrativo

Sistema administrativo de la clínica **Meditech Salud Digital**, construido con **Angular 21**.
Usado por administradores y médicos (no por pacientes). Tema claro, profesional y médico.

> Los datos provienen de **servicios mock en memoria** que simulan las REST APIs `/api/v1/*`
> con autenticación JWT (no requiere backend para ejecutarse). La arquitectura HTTP
> (HttpClient + interceptores) está implementada y lista para conectarse a un backend real.

---

## 🚀 Cómo ejecutar

```bash
npm install
npm start         # servidor de desarrollo en http://localhost:4200
npm run build     # build de producción en dist/
```

### Credenciales de demo
```
Correo:     admin@meditech.pe
Contraseña: admin123
```

---

## 🧩 Módulos

1. **Login** — fuera del shell, con gradiente `#0D1B2A → #1A6FBB`, guarda el JWT en `localStorage` (`meditech_token`).
2. **Dashboard** — 4 KPIs, gráfico de barras (citas/día), gráfico de dona (especialidades), 2 tablas rápidas.
3. **Pacientes** — tabla con búsqueda y paginación, modal nuevo/editar (con validación async de DNI), drawer de historial clínico.
4. **Médicos** — tabla con filtro por especialidad, modal nuevo/editar, modal de horarios (grilla 7×franjas clicable), especialidades registradas.
5. **Citas** — vista doble Lista / Calendario mensual, filtros, nueva cita (autocomplete de paciente), reprogramar, marcar atendida, cancelar.
6. **Reportes** — gráfico de línea, dos barras horizontales, tabla resumen exportable (PDF vía impresión).

---

## 🏗️ Criterios técnicos Angular

- **Componentización** — `<app-kpi-card>`, `<app-chart>`, `<app-estado-chip>`, `<app-confirm-modal>`,
  topbar, sidebar, etc. son componentes standalone reutilizables que reciben `@Input()` y emiten `@Output()`.
- **Routing con Lazy Loading** — cada módulo (Pacientes, Médicos, Citas, Reportes) se carga con
  `loadChildren` / `loadComponent`. El `authGuard` protege todas las rutas del shell.
- **Formularios Reactivos** — `FormGroup`/`FormControl` con validadores síncronos (required, pattern para
  DNI/CMP/email/teléfono) y **asíncronos** (verificación de DNI duplicado contra la API).
- **Consumo de APIs REST** — `HttpClient` con dos interceptores funcionales globales:
  `jwtInterceptor` (añade `Authorization: Bearer <token>`) y `errorInterceptor` (maneja 401 → login, 500 → toast).
  Cada dominio tiene su servicio: `PacientesService`, `MedicosService`, `CitasService`, `ReportesService`.

---

## 📁 Estructura

```
src/
├── styles/                    _variables.scss · _mixins.scss
├── styles.scss                estilos globales (botones, chips, tablas, modales, drawer)
└── app/
    ├── core/
    │   ├── guards/            auth.guard.ts
    │   ├── interceptors/      jwt.interceptor.ts · error.interceptor.ts
    │   └── services/          auth · toast · layout · pacientes · medicos · citas · reportes · mock-db
    ├── shared/
    │   ├── components/        kpi-card · chart · estado-chip · confirm-modal · toast-container
    │   └── models/            index.ts (Paciente, Medico, Cita, …)
    ├── shell/                 shell · topbar · sidebar
    ├── features/              login · dashboard · pacientes · medicos · citas · reportes
    ├── app.config.ts          provideRouter + provideHttpClient(withInterceptors)
    └── app.routes.ts          rutas con lazy loading + authGuard
```

---

## 🎨 Diseño

Paleta, tipografía (Inter + JetBrains Mono) y componentes siguen la especificación de
`PROMPT_DISEÑO_MEDITECH_ANGULAR.md`. Responsive: en tablet el sidebar se oculta tras un
botón hamburguesa; el sidebar es colapsable a 64px (solo íconos con tooltip).
