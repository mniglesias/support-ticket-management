# Gestor de Tickets

## Cómo correr el proyecto

```bash
npm install
npm start o ng serve       # dev server en http://localhost:4200
```

## Decisiones técnicas

### Mock de API

Para simular el backend se optó por un interceptor HTTP propio en lugar de JSON Server o Angular In-Memory Web API, ya que no requiere dependencias ni procesos externos y permite implementar la lógica de filtrado, ordenamiento y paginación con total control.

**Cómo funciona el interceptor:**

1. Intercepta requests cuya URL empiece con `/api/`.
2. Usa expresiones regulares para identificar el endpoint (`/api/tickets`, `/api/tickets/:id`, `/api/tickets/:id/comments`).
3. Aplica la lógica correspondiente sobre arrays en memoria (copia de los mocks).
4. Devuelve un `HttpResponse` envuelto en `of(...).pipe(delay(400))` para simular latencia de red.
5. Cualquier request que no matchee con `/api/` se delega a `next(req)` sin interferencia.

Los archivos de mock nunca se modifican: al iniciar la app se genera una copia en memoria sobre la que operan las mutaciones (crear, editar).

## Funcionalidades Implementadas

### Pantalla: Listado de tickets (`/tickets`)

Se implementó el listado principal de tickets cumpliendo con los siguientes requerimientos:

- **Búsqueda y Filtros Reactivos:**
  - Búsqueda por texto (título y descripción) con un `debounceTime` de 400ms y `distinctUntilChanged` para evitar llamadas innecesarias a la API.
  - Filtros de selección múltiple (`mat-select`) para Estado, Prioridad, Categoría y Responsable.
  - El formulario reactivo emite los cambios y mediante `switchMap` se garantizan la cancelación de requests obsoletos.
- **Ordenamiento:**
  - Por defecto, los tickets se ordenan por `updatedAt` de forma descendente.
  - Se permite alternar el ordenamiento para la columna Prioridad (asignando pesos a HIGH, MEDIUM, LOW en el mock).
- **Paginación:**
  - Paginación _Server-Side_ simulada a través del mock interceptor. El componente solo envía los parámetros `page` y `pageSize`, y el servidor devuelve la porción correspondiente junto con el total de registros.
- **Estados de Interfaz:**
  - **Loading:** Se diseñó un _Skeleton Loader_ animado con TailwindCSS (`animate-pulse`) cuya cantidad de filas se ajusta dinámicamente al `pageSize` seleccionado.
  - **Empty State:** Un diseño amigable que se muestra cuando la paginación no devuelve resultados.
  - **Error State:** Un panel rojo con un ítem de error simulable (buscando por la palabra "errormessage"). Incluye un botón para reintentar el request.

### Pantalla: Detalle de ticket (`/tickets/:id`)

- **Navegación Intuitiva:**
  - Al presionar el botón de "Atrás" se utiliza la propiedad `queryParamsHandling="preserve"` de Angular Router, asegurando que los filtros y el paginador de la pantalla anterior se mantengan intactos.
- **Listado y Carga de Datos:**
  - Se obtienen y combinan el Ticket principal y sus respectivos Comentarios usando `forkJoin` y `Signals`.
  - Se diseñó un _Timeline_ de comentarios para mostrar el hilo de interacción y sus fechas exactas.
- **Acciones Rápidas:**
  - Desde el panel derecho se puede modificar el "Estado" y la "Prioridad".
- **Formulario de Comentarios:**
  - Formulario reactivo al final del hilo (`ReactiveFormsModule`) con validación requerida y cantidad de caracteres mínima (5).

## Componentes Compartidos (Shared)

- **Sistema de Feedback:**
  - Implementación de un `SnackbarService` genérico que inyecta componentes personalizados usando Angular Material (`MatSnackBar`).
  - Provee notificaciones (de éxito en color verde o de error en rojo) con sus respectivos Material Icons al guardar configuraciones o datos, disponible para ser invocado desde cualquier feature de la app.

## Comentarios Generales

### UI y Estilos

- Se utiliza **Angular Material** como base de componentes UI para garantizar accesibilidad, consistencia visual y velocidad de desarrollo.
  Se utiliza principalmente como capa de presentación (table, inputs, paginator, dialogs), mientras que la lógica de filtros, paginación y cancelación de requests se maneja con RxJS para simular un escenario real con backend.
- Se utiliza **TailwindCSS** para layout y ajustes visuales personalizados.
  La combinación permite aprovechar la accesibilidad y robustez de Material sin perder flexibilidad en el diseño y la responsividad.

### Arquitectura Angular

- El proyecto está construido con **Standalone Components**, evitando NgModules para simplificar la estructura y alinearse con las prácticas modernas de Angular (v16+).
- Se utiliza **zoneless change detection** junto con **Signals**, priorizando un modelo de estado más explícito y predecible, reduciendo dependencias implícitas del Zone.js y mejorando el control del rendering.
- **Store (Signals + RxJS):** Se implementó un store basado en Signals para estado síncrono y RxJS para efectos asíncronos, priorizando cancelación automática de requests con switchMap.

## Estructura de Directorios

```
src/
├── styles/
│   └── material/           ← Overrides y personalización de Material (scss)
│
└── app/
    ├── core/
    │   ├── interceptors/       ← Interceptores HTTP (manejo centralizado de errores, base URL)
    │   └── guards/             ← Guards de navegación (CanDeactivate para formularios)
    │
    ├── shared/
    │   ├── models/             ← Interfaces y tipos compartidos (Ej: SnackbarData)
    │   ├── services/           ← Servicios globales transversales (Ej: SnackbarService)
    │   ├── ui/                 ← Componentes genéricos reutilizables (Snackbar)
    │   └── utils/              ← Utilidades y enums transversales (Ej: SnackbarTypeEnum)
    │
    └── features/
        └── tickets/
            ├── data-access/    ← Servicios, modelos/interfaces, mocks
            │   ├── models/     ← Interfaces (Ticket, Comment, TicketListState)
            │   ├── services/   ← TicketListStore (Store Signals + RxJS), TicketsService
            │   └── mocks/      ← Datos mock
            ├── pages/          ← Componentes de ruta (routed components)
            │   ├── ticket-list/    → /tickets
            │   ├── ticket-detail/  → /tickets/:id
            │   └── ticket-form/    → /tickets/new y /tickets/:id/edit
```
