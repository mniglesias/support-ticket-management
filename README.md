# Gestor de Tickets

## Cómo correr el proyecto

```bash
npm install
npm start o ng serve       # dev server en http://localhost:4200
```

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
