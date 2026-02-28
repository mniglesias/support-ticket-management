# Gestor de Soporte Técnico 🎫

Aplicación desarrollada en **Angular 20** para la gestión de tickets de soporte, con énfasis en arquitectura escalable, manejo de estado reactivo y buena experiencia de usuario.

---

## 🚀 Instalación y Ejecución

```bash
npm install
npm start       # ng serve – servidor de desarrollo
npm test        # ng test  – suite de tests unitarios
```

---

## 🛠️ Stack Tecnológico

| Tecnología       | Versión | Motivo                                   |
| ---------------- | ------- | ---------------------------------------- |
| Angular          | 20      | Standalone APIs, Zoneless, Signals       |
| Angular Material | 20      | Componentes UI accesibles y consistentes |
| RxJS             | 7       | Manejo de flujos asíncronos              |
| TailwindCSS      | 4       | Clases utilitarias para layout y estilos |

---

## 📁 Estructura del Proyecto

```
src/
├── environments/
│   ├── environment.ts          ← URL de API para desarrollo (/api)
│   └── environment.prod.ts     ← URL de API para producción
│
└── app/
    ├── core/
    │   ├── interceptors/       ← mock-api + error (manejo centralizado)
    │   ├── guards/             ← unsaved-changes (CanDeactivate)
    │   ├── layout/             ← Shell principal de la app
    │   └── theme/              ← Servicio global de cambio de tema
    │
    ├── shared/
    │   ├── models/             ← Interfaces y tipos reutilizables
    │   ├── pipes/              ← Pipes compartidos
    │   ├── services/           ← Servicios compartidos (SnackbarService)
    │   ├── ui/                 ← Componentes UI compartidos (Confirm Dialog, Snackbar component)
    │   └── utils/              ← Enums y helpers globales
    │
    └── features/
        └── tickets/
            ├── tickets.routes.ts       ← Rutas lazy del feature
            ├── data-access/
            │   ├── models/             ← Interfaces del dominio (Ticket, Comment, etc.)
            │   ├── services/
            │   │   ├── tickets.service.ts      ← HTTP client puro
            │   │   └── ticket-list.store.ts    ← Estado reactivo (Signals + RxJS)
            │   └── mock/               ← Datos de prueba (50+ tickets)
            └── pages/
                ├── ticket-list/        → /tickets
                │   ├── ticket-filters/ ← Componente de Búsqueda y filtros avanzados
                │   ├── ticket-cards/   ← Componente de Vista de tarjetas
                │   └── ticket-table/   ← Componente de Vista de tabla
                ├── ticket-detail/      → /tickets/:id
                └── ticket-form/        → /tickets/new y /tickets/:id/edit
```

---

## ✨ Funcionalidades Implementadas

### 📋 Lista de Tickets (`/tickets`)

- Alternancia entre vista de **cards** y **tabla**.
- **Búsqueda** con `debounceTime` (400 ms) + `distinctUntilChanged` + cancelación via `switchMap`.
- **Filtros**: Estado, Prioridad, Categoría y Responsable — multi-selección.
- **Ordenamiento**: por `updatedAt` (default) y `priority`, con dirección configurable.
- **Paginación** server-side (ver decisiones más abajo).
- **Estados de UI**: skeleton loader, empty state, error state con botón de reintento.
- **Deep-linking**: todos los filtros, orden y página se sincronizan con query params.

### 📝 Detalle de Ticket (`/tickets/:id`)

- Header con datos principales del ticket.
- Timeline cronológico de comentarios.
- Cambio de **estado** y **prioridad** con guardado inmediato al cambiar el select.
- Formulario de comentario con validación (mínimo de caracteres).
- Protección contra pérdida de cambios (comentarios sin enviar) con **CanDeactivate** + confirm dialog.
- Botón "Volver" que preserva los query params del listado.

### ➕ Crear / Editar Ticket (`/tickets/new`, `/tickets/:id/edit`)

- Reactive Form compartido con modo create/edit.
- Validaciones: Título (mín. 5 caracteres), Descripción (mín. 20 caracteres), campos requeridos.
- Feedback con **SnackbarService** centralizado.
- Protección contra pérdida de cambios con **CanDeactivate** + confirm dialog.

---

## 🏗️ Decisiones Técnicas

### API Mock via Interceptor HTTP

Se optó por un interceptor propio (`mock-api.interceptor.ts`) en lugar de Angular In-Memory Web API o JSON Server.  
**Motivo**: mayor control sobre la lógica de filtrado/paginación/ordenamiento, sin instalar dependencias externas y sin correr un proceso separado.  
El interceptor maneja los endpoints:

- `GET /api/tickets` — listado con filtros, orden y paginación
- `GET /api/tickets/:id` — detalle
- `POST /api/tickets` — creación
- `PUT /api/tickets/:id` — actualización
- `GET /api/tickets/:id/comments` — comentarios
- `POST /api/tickets/:id/comments` — agregar comentario

Respuesta del listado:

```json
{ "items": [], "total": 50 }
```

### Paginación Server-Side (simulada)

La paginación se implementa en el interceptor mock usando `slice()` sobre los datos en memoria, simulando correctamente el comportamiento server-side con parámetros `page` y `pageSize`. Esto permite que la lógica del componente y del store sea idéntica a como se comportaría con un backend real.

### Estado: Signals + RxJS (`TicketListStore`)

- `signal<TicketListState>` como contenedor del estado síncrono.
- `computed()` para derivar tickets, total, loading y error.
- `Subject<TicketListParams>` + `switchMap` para manejar la cancelación de requests al buscar/filtrar.
- `takeUntilDestroyed()` para evitar memory leaks.
- `patchParams()` como única entrada de cambios, con comparación de igualdad para evitar requests duplicados.

### Sincronización con Query Params (Deep-Linking)

El store hidrata su estado inicial desde los query params de la URL al arrancar, y los actualiza en cada cambio usando `router.navigate`. Solo se escriben en la URL los parámetros que difieren de los valores default, manteniendo URLs limpias.

### Configuración de API URL

La URL base de la API se define en `src/environments/environment.ts` (`apiUrl: '/api'`) y se importa directamente en `TicketsService`. Al hacer build de producción (`ng build`), Angular reemplaza el archivo de entorno automáticamente.

### Interceptors

- **`mock-api.interceptor`**: intercepta todas las llamadas a `/api/` y responde con datos mockeados con delay simulado.
- **`error.interceptor`**: captura errores HTTP y los transforma en mensajes amigables para el usuario.

### Routing con Lazy Loading

Todas las páginas se cargan bajo demanda con `loadComponent` / `loadChildren`. El layout shell también es lazy. Esto reduce el bundle inicial.

### CanDeactivate Guard

`unsaved-changes.guard.ts` implementa un guard funcional que consulta al componente si tiene cambios pendientes. En caso afirmativo, abre un `ConfirmDialog` de Angular Material antes de permitir la navegación.

---

## ⚖️ Trade-offs y Simplificaciones

| Decisión                        | Alternativa                     | Por qué se eligió esta                                    |
| ------------------------------- | ------------------------------- | --------------------------------------------------------- |
| Interceptor mock propio         | JSON Server / In-Memory Web API | Sin dependencias extra, lógica centralizada               |
| Signals + RxJS store liviano    | NgRx / ComponentStore           | Suficiente para la escala del proyecto, menos boilerplate |
| Paginación server-side simulada | Client-side real                | Comportamiento idéntico al production desde el componente |

---

### Pendiente / Próximos Pasos

- Tests unitarios.
- `shareReplay` / caché por query con invalidación al crear/editar.
- Suite e2e (Playwright) cubriendo el flujo feliz completo.

---

## 📡 Endpoints del Mock

| Método | Endpoint                    | Descripción                                                                                                     |
| ------ | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/tickets`              | Listado con `search`, `status`, `priority`, `category`, `assignee`, `sort`, `sortDirection`, `page`, `pageSize` |
| GET    | `/api/tickets/:id`          | Detalle de un ticket                                                                                            |
| POST   | `/api/tickets`              | Crear ticket                                                                                                    |
| PUT    | `/api/tickets/:id`          | Editar ticket                                                                                                   |
| GET    | `/api/tickets/:id/comments` | Comentarios de un ticket                                                                                        |
| POST   | `/api/tickets/:id/comments` | Agregar comentario                                                                                              |
