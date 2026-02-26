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

## Comentarios Generales

- Se utiliza **Angular Material** para resolver rápidamente los componentes UI de la aplicación. Es una librería robusta y con buena documentación.
- Se utiliza **TailwindCSS v4** para layout y estilos personalizados de manera rápida.
- El proyecto usa **Standalone Components** (sin NgModules) y **zoneless change detection** con Signals.

## Estructura de Directorios

```
src/app/
├── core/
│   ├── interceptors/       ← Interceptores HTTP (manejo centralizado de errores, base URL)
│   └── guards/             ← Guards de navegación (CanDeactivate para formularios)
│
├── shared/
│   └── ui/                 ← Componentes genéricos reutilizables entre features
│                             Ejemplos: SkeletonLoader, EmptyState, ConfirmDialog
│
└── features/
    └── tickets/
        ├── data-access/    ← Servicios, modelos/interfaces, mocks
        │   ├── models/     ← Interfaces y tipos (Ticket, Comment, enums)
        │   ├── services/   ← TicketService, CommentService
        │   └── mocks/      ← Datos mock con delay simulado
        ├── pages/          ← Componentes de ruta (routed components)
        │   ├── ticket-list/    → /tickets
        │   ├── ticket-detail/  → /tickets/:id
        │   └── ticket-form/    → /tickets/new y /tickets/:id/edit
        └── ui/             ← Componentes específicos del feature
                              Ejemplos: TicketCard, CommentItem, TicketStatusBadge
```
