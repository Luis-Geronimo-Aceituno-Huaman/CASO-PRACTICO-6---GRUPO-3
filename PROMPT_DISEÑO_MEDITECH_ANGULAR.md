# PROMPT DE DISEÑO — SISTEMA WEB ADMINISTRATIVO
## Meditech Salud Digital | Angular | Grupo 3

---

## CONTEXTO DEL PROYECTO

Eres un diseñador frontend senior especializado en sistemas administrativos médicos.
Tu tarea es construir el **Sistema Web Administrativo** de la clínica "Meditech Salud Digital"
usando **Angular**. Este sistema es usado por **administradores y médicos**, NO por pacientes.

El sistema tiene cuatro módulos principales:
1. **Dashboard Administrativo**
2. **Gestión de Pacientes**
3. **Gestión de Médicos** (con especialidades y horarios)
4. **Gestión de Citas**

Toda la comunicación con el backend es mediante **REST APIs con autenticación JWT**.

---

## 1. ESQUELETO — ESTRUCTURA Y DISTRIBUCIÓN

### Layout general (Shell de la app)
La aplicación usa un layout de **dos columnas fijas**:

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR  (altura: 64px, fija, z-index alto)          │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │         ROUTER OUTLET (contenido)        │
│ (240px)  │         con scroll vertical propio       │
│  fijo    │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Topbar (Header fijo)
- **Izquierda:** Logo "Meditech" con ícono de cruz médica + nombre del sistema
- **Centro:** Breadcrumb dinámico que muestra la ruta actual (ej: Dashboard / Pacientes / Nuevo)
- **Derecha:** Ícono de notificaciones con badge numérico + avatar del usuario con menú
  desplegable (Ver perfil / Cerrar sesión)
- Se mantiene **fija** al hacer scroll (`position: fixed`)
- Tiene una sutil **línea divisora inferior** o sombra suave

### Sidebar (Navegación lateral fija)
- Ancho: **240px** en desktop, colapsable a **64px** (solo íconos) con un botón toggle
- Logo visible solo en versión expandida
- Ítems de navegación con ícono + texto:
  - 🏠 Dashboard
  - 👥 Pacientes
  - 🩺 Médicos
  - 📅 Citas
  - 📊 Reportes
- El ítem activo tiene un **indicador lateral izquierdo** (barra de color primario)
- Al colapsar, aparece un tooltip con el nombre al hacer hover

### Área de contenido (Router Outlet)
- Ocupa el espacio restante: `calc(100vw - 240px)` de ancho
- Padding interno: **24px**
- Tiene su propio scroll vertical, el sidebar y topbar no se mueven
- Fondo: gris muy claro `#F0F2F5`

### Footer
- No hay footer global. Dentro de cada módulo, los formularios tienen
  una **barra de acciones inferior** con botones Guardar / Cancelar.

### Espaciado general
- Grid interno de **8px** (todo múltiplo de 8: 8, 16, 24, 32, 48)
- Bastante espacio en blanco; las tarjetas y secciones respiran
- Separación entre cards del dashboard: **24px**

---

## 2. PALETA DE COLORES

El sistema es profesional y médico. Transmite **confianza, claridad y tecnología**.
Tema: **Claro (Light Mode)**.

| Rol | Nombre | Hex |
|-----|--------|-----|
| Primario | Azul médico profundo | `#1A6FBB` |
| Primario hover | Azul más oscuro | `#155A99` |
| Secundario / acento | Verde salud | `#27AE60` |
| Fondo general | Gris neutro claro | `#F0F2F5` |
| Fondo cards / panels | Blanco puro | `#FFFFFF` |
| Sidebar fondo | Azul marino oscuro | `#0D1B2A` |
| Sidebar texto | Blanco suave | `#E8EDF2` |
| Sidebar ítem activo | Azul primario | `#1A6FBB` |
| Texto principal | Gris oscuro casi negro | `#1C2B3A` |
| Texto secundario | Gris medio | `#6B7A8D` |
| Bordes / divisores | Gris claro | `#DDE3EC` |
| Error | Rojo suave | `#E74C3C` |
| Advertencia | Naranja | `#F39C12` |
| Éxito | Verde | `#27AE60` |
| Sombra de cards | `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` |

> **Regla clave:** El sidebar es el único elemento oscuro (`#0D1B2A`).
> Todo lo demás es claro. El color primario `#1A6FBB` solo se usa en
> botones principales, ítem activo del sidebar y acentos gráficos.

---

## 3. TIPOGRAFÍA

| Rol | Fuente | Peso | Tamaño |
|-----|--------|------|--------|
| Títulos de página (H1) | **Inter** | 700 (Bold) | 28px |
| Subtítulos de sección (H2) | **Inter** | 600 (SemiBold) | 20px |
| Títulos de card (H3) | **Inter** | 600 | 16px |
| Texto de cuerpo / párrafos | **Inter** | 400 (Regular) | 14px |
| Labels de formulario | **Inter** | 500 (Medium) | 13px |
| Datos numéricos (KPIs) | **Inter** | 700 | 36px |
| Texto auxiliar / captions | **Inter** | 400 | 12px |
| Código / IDs técnicos | **JetBrains Mono** | 400 | 13px |

- Line-height de cuerpo: **1.6**
- Letter-spacing en títulos: **-0.3px** (ligeramente comprimido, look moderno)
- Importar desde Google Fonts: `Inter` (weights: 400, 500, 600, 700)

---

## 4. COMPONENTES — DISEÑO DETALLADO

### 4.1 Botones

```
Primario:   [  Guardar Paciente  ]
            bg: #1A6FBB | texto: blanco | border-radius: 6px
            padding: 10px 20px | font-weight: 600 | font-size: 14px
            hover: bg #155A99 + sombra leve
            active: escala 0.98 (hundimiento sutil)
            transition: all 150ms ease

Secundario: [  Cancelar  ]
            bg: transparent | border: 1.5px solid #DDE3EC
            texto: #6B7A8D | border-radius: 6px
            hover: bg #F0F2F5

Peligro:    [  Eliminar  ]
            bg: #E74C3C | texto: blanco
            hover: bg #C0392B

Icono:      [ 🔍 ]  solo ícono, bg transparente, hover: bg #F0F2F5
            border-radius: 6px | padding: 8px
```

### 4.2 Cards (Tarjetas)

```
┌─────────────────────────────────┐
│  Ícono  Título de la card        │  ← Header de card: padding 16px 20px
├─────────────────────────────────┤     border-bottom: 1px solid #DDE3EC
│                                 │
│   Contenido principal           │  ← Body: padding 20px
│                                 │
└─────────────────────────────────┘

Estilos:
- bg: #FFFFFF
- border-radius: 12px
- box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- border: 1px solid #DDE3EC
- Sin hover en cards de dashboard (son contenedores estáticos)
- Cards de tabla/lista SÍ tienen hover: bg #F7F9FC en la fila
```

### 4.3 Cards KPI (Dashboard)

```
┌──────────────────────────┐
│  🏥  Pacientes Atendidos  │  ← Label pequeño, gris
│                          │
│       1,284              │  ← Número grande: 36px bold #1C2B3A
│  ↑ +12% vs ayer          │  ← Indicador verde o rojo según tendencia
└──────────────────────────┘

- Ícono en círculo de color suave (bg: rgba del color primario, 10% opacidad)
- Número KPI en Inter 700 36px
- Indicador de tendencia: verde #27AE60 o rojo #E74C3C
- border-left: 4px solid [color según tipo de métrica]
```

### 4.4 Tablas de datos

```
┌──────┬──────────────┬──────────────┬──────────┬──────────┐
│  ID  │   Paciente   │  Especialidad│  Estado  │ Acciones │
├──────┼──────────────┼──────────────┼──────────┼──────────┤
│ 001  │ Juan Pérez   │ Cardiología  │ Activo   │ ✏️ 🗑️   │
│      │              │              │          │          │
└──────┴──────────────┴──────────────┴──────────┴──────────┘

- Header de tabla: bg #F7F9FC | font-weight 600 | font-size 13px
  texto: #6B7A8D en MAYÚSCULAS con letter-spacing 0.5px
- Filas alternas: blanca / #FAFBFC
- Hover en fila: bg #EEF4FB (azul muy suave)
- Border entre filas: 1px solid #F0F2F5
- Chips de estado:
    Activo:    bg #E8F8EF | texto #27AE60 | border-radius 20px | padding 3px 10px
    Cancelado: bg #FDEDED | texto #E74C3C
    Pendiente: bg #FEF9E7 | texto #F39C12
    Atendido:  bg #EBF5FB | texto #1A6FBB
- Paginación al fondo de la tabla
- Buscador arriba a la derecha de la tabla
```

### 4.5 Formularios

```
Label
┌───────────────────────────────┐
│  Texto de placeholder gris    │  ← Input
└───────────────────────────────┘
  * Mensaje de error en rojo    ← Solo visible si hay error

- bg input: #FFFFFF
- border: 1.5px solid #DDE3EC
- border-radius: 8px
- padding: 10px 14px
- font-size: 14px
- focus: border-color #1A6FBB + box-shadow 0 0 0 3px rgba(26,111,187,0.15)
- error: border-color #E74C3C + mensaje debajo en 12px rojo
- Labels: encima del input, font-weight 500, 13px, color #1C2B3A
- Campos obligatorios: asterisco rojo (*) junto al label
- Select / Dropdown: mismo estilo que input + ícono chevron a la derecha
- Date picker: Angular Material o ngx-datepicker con paleta del sistema
```

### 4.6 Modal / Dialog

```
Overlay: bg rgba(0,0,0,0.45) | backdrop-filter: blur(2px)

┌─────────────────────────────────────────┐
│ Título del Modal                    ✕   │  ← Header: padding 20px 24px
├─────────────────────────────────────────┤
│                                         │
│   Contenido (formulario, info, etc.)    │  ← Body: padding 24px, scroll si largo
│                                         │
├─────────────────────────────────────────┤
│               [Cancelar]  [Confirmar]   │  ← Footer: botones a la derecha
└─────────────────────────────────────────┘

- border-radius: 16px
- max-width: 560px | width: 90vw
- Animación: fade-in + slide-up (translateY 20px → 0, 200ms ease-out)
```

### 4.7 Notificaciones / Toast

```
✅  Paciente registrado correctamente.        [✕]
⚠️  No se pudo conectar con el servidor.     [✕]
❌  Error al eliminar. Intente nuevamente.   [✕]

- Posición: esquina superior derecha
- border-radius: 8px | padding: 12px 16px
- Aparece con slide-in desde la derecha (300ms)
- Auto-dismiss a los 4 segundos
- Borde izquierdo de 4px del color según tipo
```

---

## 5. PANTALLAS — DESCRIPCIÓN DETALLADA

### 5.1 Pantalla de Login (antes del shell)

```
┌─────────────────────────────────────────────┐
│                                             │
│   [Logo Meditech + nombre]                  │
│                                             │
│   Bienvenido al sistema administrativo      │
│                                             │
│   Correo electrónico                        │
│   [________________________]                │
│                                             │
│   Contraseña                                │
│   [________________________]  👁            │
│                                             │
│   [      Iniciar Sesión      ]              │
│                                             │
│   ─── Spinner mientras valida JWT ───       │
└─────────────────────────────────────────────┘

Fondo: gradiente diagonal #0D1B2A → #1A6FBB
Card de login: blanco, centrada, border-radius 16px, shadow grande
```

**API usada:** `POST /api/v1/login`
Guarda el JWT en `localStorage` con clave `meditech_token`.
Redirige según rol a `/dashboard`.

---

### 5.2 Dashboard Administrativo

```
Título: "Dashboard" + fecha de hoy + botón "Actualizar datos"

Fila 1 — KPIs (4 cards en grid 4 columnas):
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 📅 Citas     │ │ 👥 Pacientes │ │ 🩺 Médicos   │ │ 🏥 Especialid│
│   hoy        │ │  atendidos   │ │  disponibles │ │  más pedida  │
│   48         │ │   1,284      │ │    12        │ │  Cardiología │
│ ↑ +8%        │ │ ↑ +12%       │ │              │ │  38%         │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

Fila 2 — Gráficos (2 columnas):
┌──────────────────────────┐ ┌──────────────────────┐
│  Citas por día           │ │ Especialidades más   │
│  (Gráfico de barras)     │ │ solicitadas          │
│  últimos 7 días          │ │ (Gráfico de dona)    │
└──────────────────────────┘ └──────────────────────┘

Fila 3 — Tablas rápidas (2 columnas):
┌──────────────────────────┐ ┌──────────────────────┐
│  Próximas citas de hoy   │ │ Últimos pacientes    │
│  (tabla compacta 5 filas)│ │ registrados (5 filas)│
└──────────────────────────┘ └──────────────────────┘
```

**APIs usadas:**
- `GET /api/v1/reportes/citas-diarias` → KPI y gráfico de barras
- `GET /api/v1/reportes/especialidades` → gráfico de dona
- `GET /api/v1/citas` (con filtro fecha=hoy) → tabla próximas citas
- `GET /api/v1/pacientes` (ordenado por fecha_registro desc, limit 5)

---

### 5.3 Gestión de Pacientes

```
Topbar de sección:
[ 👥 Pacientes ]   [ + Nuevo Paciente ]   [ 🔍 Buscar... ]

Tabla principal con columnas:
ID | Nombre completo | DNI | Teléfono | Última cita | Estado | Acciones

Acciones por fila:
- 👁 Ver historial → abre panel lateral deslizable (drawer) con
  el historial clínico completo del paciente
- ✏️ Editar → modal con formulario pre-llenado
- 🗑️ Eliminar → modal de confirmación

Modal "Nuevo / Editar Paciente":
Campos: Nombre*, Apellido*, DNI*, Fecha nacimiento*, Teléfono*,
        Correo, Dirección, Tipo de sangre (select), Alergias (textarea)
Botones: [Cancelar] [Guardar Paciente]

Panel lateral "Historial Clínico" (drawer derecho, 480px):
- Header: nombre del paciente + botón cerrar
- Lista de entradas del historial en orden cronológico
- Cada entrada: fecha, médico, diagnóstico, resultados, recetas
```

**APIs usadas:**
- `GET /api/v1/pacientes` → lista con búsqueda y paginación
- `GET /api/v1/pacientes/{id}` → datos para editar
- `POST /api/v1/pacientes` → registrar nuevo
- `PUT /api/v1/pacientes/{id}` → actualizar
- `DELETE /api/v1/pacientes/{id}` → eliminar/inactivar
- `GET /api/v1/historial/{idPaciente}` → drawer de historial

---

### 5.4 Gestión de Médicos

```
Topbar de sección:
[ 🩺 Médicos ]   [ + Nuevo Médico ]   [ Filtrar por especialidad ▼ ]

Tabla principal:
ID | Nombre | Especialidad | Teléfono | Horario | Estado | Acciones

Acciones:
- 📅 Ver horarios → modal con grilla semanal de disponibilidad
- ✏️ Editar → modal con formulario
- 🗑️ Eliminar

Modal "Nuevo / Editar Médico":
Campos: Nombre*, Apellido*, CMP (colegio médico)*, Especialidad* (select),
        Teléfono*, Correo*, Turno* (mañana/tarde/noche)

Modal "Horarios de [Nombre del médico]":
Grilla 7 días x franjas horarias, celdas clicables para
marcar disponible/ocupado. Botón "Guardar disponibilidad".

Sección secundaria debajo — "Especialidades registradas":
Lista con nombre de especialidad + número de médicos + botón editar
```

**APIs usadas:**
- `GET /api/v1/medicos` → lista
- `GET /api/v1/medicos/{id}` → detalle
- `POST /api/v1/medicos` → registrar
- `PUT /api/v1/medicos/{id}` → actualizar
- `DELETE /api/v1/medicos/{id}` → eliminar
- `GET /api/v1/medicos/{id}/horarios` → grilla de horarios
- `GET /api/v1/especialidades` → dropdown de especialidades

---

### 5.5 Gestión de Citas

```
Vista doble — toggle entre dos modos:
  [ 📋 Lista ]  [ 📅 Calendario ]

--- MODO LISTA ---
Filtros superiores: por fecha, por médico (select), por estado (select)
Tabla: ID | Paciente | Médico | Especialidad | Fecha/Hora | Estado | Acciones

Acciones:
- ✏️ Reprogramar → modal con nuevo selector de fecha/hora
- ✅ Marcar atendida → PATCH inmediato con confirmación toast
- ❌ Cancelar → modal de confirmación

--- MODO CALENDARIO ---
Vista mensual (similar a Google Calendar)
Cada día muestra número de citas como badge
Click en día → panel lateral con lista de citas de ese día
Citas en el calendario coloreadas por estado:
  Pendiente: azul | Atendida: verde | Cancelada: rojo/gris

Modal "Nueva Cita":
Campos: Paciente* (buscador autocomplete), Médico* (select),
        Especialidad* (auto-fill según médico), Fecha*, Hora*,
        Motivo de consulta (textarea)
```

**APIs usadas:**
- `GET /api/v1/citas` → lista con filtros
- `GET /api/v1/citas/{id}` → detalle
- `POST /api/v1/citas` → nueva cita
- `PUT /api/v1/citas/{id}` → reprogramar
- `PATCH /api/v1/citas/{id}/estado` → cambiar estado
- `DELETE /api/v1/citas/{id}` → cancelar
- `GET /api/v1/medicos/{id}/horarios` → disponibilidad al elegir médico
- `GET /api/v1/pacientes` → buscador autocomplete de pacientes

---

### 5.6 Reportes

```
Topbar: [ 📊 Reportes ]   [ Rango de fechas: ______ al ______ ]
                           [ Filtrar por especialidad ▼ ]  [ Exportar PDF ]

Fila 1 — Gráfico principal (ancho completo):
Evolución de citas por semana — gráfico de línea

Fila 2 — Dos gráficos:
┌──────────────────────────┐ ┌──────────────────────┐
│ Distribución por         │ │ Médicos con más      │
│ especialidad             │ │ citas atendidas      │
│ (Gráfico de barras       │ │ (Gráfico de barras   │
│  horizontal)             │ │  horizontal)         │
└──────────────────────────┘ └──────────────────────┘

Fila 3 — Tabla resumen exportable:
Especialidad | Total citas | Atendidas | Canceladas | % Asistencia
```

**APIs usadas:**
- `GET /api/v1/reportes/citas-diarias` → con params de fecha inicio/fin
- `GET /api/v1/reportes/especialidades` → distribución

---

## 6. COMPORTAMIENTO E INTERACCIONES

### Hover
- Botón primario: oscurece a `#155A99` en `150ms ease`
- Fila de tabla: fondo cambia a `#EEF4FB` en `100ms`
- Ítem sidebar: fondo `rgba(255,255,255,0.08)` + slide del indicador lateral
- Card KPI: eleva sombra ligeramente `0 4px 16px rgba(0,0,0,0.12)`

### Click / Active
- Botón: `transform: scale(0.98)` en `80ms` (hundimiento sutil)
- Ítem sidebar activo: barra izquierda de 3px `#1A6FBB` + fondo `rgba(26,111,187,0.15)`

### Loading states
- Botón de submit: texto cambia a spinner SVG animado mientras espera respuesta
- Tablas: skeleton loader (barras grises animadas con shimmer) mientras carga datos
- KPIs del dashboard: números con `---` hasta que lleguen los datos
- Formularios: campos deshabilitados mientras se envía

### Animaciones de entrada
- Cards del dashboard: fade-in + translateY(12px → 0) escalonado (stagger 80ms entre cards)
- Modales: fade + scale(0.95 → 1) en 200ms ease-out
- Drawer lateral: slide desde la derecha en 300ms ease-out
- Toast: slide desde la derecha en 300ms, desaparece en 300ms

### Routing (Angular Router)
```
/login                     → LoginComponent (fuera del shell)
/dashboard                 → DashboardComponent
/pacientes                 → PacientesListComponent
/pacientes/nuevo           → PacienteFormComponent
/pacientes/:id/editar      → PacienteFormComponent (modo edición)
/medicos                   → MedicosListComponent
/medicos/nuevo             → MedicoFormComponent
/medicos/:id/editar        → MedicoFormComponent
/citas                     → CitasComponent (con toggle lista/calendario)
/citas/nueva               → CitaFormComponent
/reportes                  → ReportesComponent
```
- Rutas protegidas con `AuthGuard` que verifica JWT antes de activar
- Lazy loading por módulo: `PacientesModule`, `MedicosModule`, `CitasModule`, `ReportesModule`

---

## 7. CRITERIOS TÉCNICOS ANGULAR A JUSTIFICAR

Al presentar el sistema, el grupo debe mencionar estos criterios:

**Componentización:**
> Cada sección (topbar, sidebar, cards KPI, tablas, modales, formularios)
> es un componente Angular independiente y reutilizable.
> Ejemplo: `<app-kpi-card>` recibe `[titulo]`, `[valor]`, `[icono]`, `[tendencia]`
> como `@Input()` y se reutiliza en dashboard y reportes sin duplicar código.

**Routing con Lazy Loading:**
> Los módulos de Pacientes, Médicos, Citas y Reportes se cargan solo cuando
> el usuario navega a ellos (`loadChildren`), reduciendo el bundle inicial.
> El `AuthGuard` protege todas las rutas: si no hay JWT válido, redirige a `/login`.

**Formularios Reactivos (ReactiveFormsModule):**
> Los formularios usan `FormGroup` y `FormControl` con validadores síncronos
> (required, minLength, pattern para DNI/email) y asíncronos (verificar DNI
> duplicado en la API antes de guardar). Esto permite validación en tiempo real
> y mensajes de error descriptivos bajo cada campo.

**Consumo de APIs REST:**
> Servicio `HttpClient` de Angular con interceptor JWT global:
> añade automáticamente `Authorization: Bearer <token>` a cada petición.
> Un segundo interceptor maneja errores 401 (redirige al login) y
> errores 500 (muestra toast de error). Cada módulo tiene su propio
> service: `PacientesService`, `MedicosService`, `CitasService`, `ReportesService`.

---

## 8. ESTRUCTURA DE CARPETAS ANGULAR SUGERIDA

```
src/
├── app/
│   ├── core/
│   │   ├── guards/         auth.guard.ts
│   │   ├── interceptors/   jwt.interceptor.ts, error.interceptor.ts
│   │   └── services/       auth.service.ts
│   ├── shared/
│   │   ├── components/     topbar, sidebar, kpi-card, data-table, modal-confirm
│   │   └── models/         paciente.model.ts, medico.model.ts, cita.model.ts
│   ├── modules/
│   │   ├── dashboard/
│   │   ├── pacientes/
│   │   ├── medicos/
│   │   ├── citas/
│   │   └── reportes/
│   ├── app-routing.module.ts
│   └── app.component.ts    (solo contiene el shell: topbar + sidebar + router-outlet)
└── assets/
    ├── icons/
    └── styles/
        ├── _variables.scss   (colores, tipografía, breakpoints)
        ├── _mixins.scss
        └── global.scss
```

---

## NOTAS FINALES PARA EL AGENTE

- Usar **Angular Material** o **PrimeNG** como librería de componentes base,
  personalizando con la paleta definida aquí mediante theming de SCSS.
- Los gráficos usan **Chart.js** con el wrapper `ng2-charts` o **ApexCharts**.
- El calendario de citas puede usar **FullCalendar** con su módulo Angular.
- Todo texto de la interfaz en **español**.
- El sistema debe ser **responsive**: en tablets el sidebar colapsa automáticamente;
  en móvil se oculta y aparece un botón hamburguesa en el topbar.
- Accesibilidad mínima: `aria-label` en botones de ícono, contraste WCAG AA.
