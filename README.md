# Gestor de Soporte Técnico 🎫

Aplicación desarrollada en **Angular 20** diseñada para la gestión eficiente de tickets de soporte, con énfasis en arquitectura escalable, manejo de estado reactivo y excelencia en la experiencia de usuario (UX).

## 🚀 Instalación y Ejecución

```bash
npm install
npm start # o ng serve para iniciar el servidor de desarrollo
```

---

## 🛠️ Stack Tecnológico y Decisiones Técnicas

El proyecto se diseñó siguiendo las mejores prácticas actuales de la industria, optimizando el rendimiento y la mantenibilidad.

### Arquitectura y Performance

- **Angular Standalone & Zoneless**: Se prescinde de NgModules para una estructura más limpia. Se implementó `zoneless change detection` junto con **Signals** para un rendering preciso y eficiente.
- **Estado Global (Store)**: Implementación de un store ligero (`TicketListStore`) basado en Signals para el estado síncrono y RxJS para gestionar efectos asíncronos y flujos de datos.

### Comunicación de Datos (Mock API)

En lugar de depender de herramientas externas, se implementó un **Interceptor HTTP** propio que intercepta peticiones a `/api/` y simula el comportamiento de un backend real, incluyendo:

- Lógica de búsqueda, filtrado múltiple, ordenamiento y paginación server-side.
- Simulación de latencia de red.

---

## ✨ Funcionalidades Destacadas

### 📋 Listado de Tickets

- **Búsqueda**: Implementación de `debounceTime` y `distinctUntilChanged` para optimizar las peticiones.
- **Sincronización Inteligente**: Al volver al listado desde cualquier pantalla, se ejecuta un refresco automático garantizando datos actualizados sin duplicar llamadas innecesarias gracias a la validación de parámetros en el Store.
- **Interfaz Fluida**: Uso de **Skeleton Loaders** para transiciones de carga y manejo de estados vacíos o de error con opción de reintento.

### 📝 Detalle de Ticket

- **Timeline de Interacción**: Visualización de comentarios con orden cronológico.
- **Acciones Rápidas**: Modificación de estado y prioridad con persistencia inmediata.
- **Formulario de Comentarios**: Validaciones reactivas para garantizar la calidad de la información ingresada.

### ➕ Creación y Edición

- **Formulario Inteligente**: Componente compartido que adapta su lógica según el modo (Crear/Editar) mediante Reactive Forms y validaciones personalizadas.
- **Protección de Datos (Guards)**: Implementación de `CanDeactivate` vinculado a un **Material Confirm Dialog** propio, evitando la pérdida de cambios accidentales.
- **Feedback Visual**: Notificaciones dinámicas mediante un `SnackbarService` centralizado.

---

## 📁 Estructura del Proyecto

```
src/
├── styles/
│   └── material/           ← Overrides y personalización de Material (scss)
│
└── app/
    ├── core/
    │   ├── interceptors/       ← Manejo centralizado de API Mock y errores
    │   └── guards/             ← Protección de navegación (Confirm Dialog Guard)
    │
    ├── shared/
    │   ├── models/             ← Interfaces y tipos compartidos
    │   ├── services/           ← Servicios transversales (Snackbar, etc.)
    │   ├── ui/                 ← Componentes UI reutilizables (Confirm Dialog, Snackbar)
    │   └── utils/              ← Enums y utilidades globales
    │
    └── features/
        └── tickets/
            ├── data-access/    ← Lógica de datos: Store, Servicios y Mocks
            │   ├── models/     ← Interfaces específicas del dominio
            │   ├── services/   ← TicketListStore (Signals + RxJS), TicketsService
            │   └── mocks/      ← Datos de prueba simulados
            ├── pages/          ← Componentes de ruta
            │   ├── ticket-list/    → /tickets
            │   ├── ticket-detail/  → /tickets/:id
            │   └── ticket-form/    → /tickets/new y /tickets/:id/edit
```
