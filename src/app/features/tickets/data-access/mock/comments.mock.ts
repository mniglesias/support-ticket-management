import { Comment } from '../models/interfaces/comment.interface';

export const COMMENTS_MOCK: Comment[] = [
  // Ticket 1
  {
    id: 1,
    ticketId: 1,
    author: 'Ana García',
    message:
      'Pude reproducir el error en el ambiente de staging con una Visa terminada en 4242. El error ocurre específicamente cuando el monto supera los $50.000.',
    createdAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: 2,
    ticketId: 1,
    author: 'Jorge Fernández',
    message:
      'Revisé los logs del servidor. Hay una excepción no capturada en el módulo de procesamiento de pagos. Voy a abrir un fix branch.',
    createdAt: '2025-01-10T11:30:00.000Z',
  },
  {
    id: 3,
    ticketId: 1,
    author: 'Carlos López',
    message:
      'El cliente afectado ID-1122 volvió a escribir. Le pedí que intente nuevamente en los próximos minutos mientras trabajamos en el fix.',
    createdAt: '2025-01-10T14:00:00.000Z',
  },

  // Ticket 2
  {
    id: 4,
    ticketId: 2,
    author: 'Carlos López',
    message:
      'Identificado el problema: el endpoint /api/invoices/pdf devuelve 403 luego del último deploy. Parece un problema de permisos en el nuevo middleware.',
    createdAt: '2025-01-12T10:00:00.000Z',
  },
  {
    id: 5,
    ticketId: 2,
    author: 'María Rodríguez',
    message:
      'Confirmo. El middleware de autenticación nuevo no está incluyendo el scope "invoices:read" en la validación. Voy a hacer el fix.',
    createdAt: '2025-01-12T10:45:00.000Z',
  },

  // Ticket 3
  {
    id: 6,
    ticketId: 3,
    author: 'María Rodríguez',
    message:
      'Reproduje el error en Safari 17.2. Parece ser un problema con el uso de top-level await en el módulo principal. Safari no lo soporta correctamente.',
    createdAt: '2025-01-07T13:00:00.000Z',
  },
  {
    id: 7,
    ticketId: 3,
    author: 'Jorge Fernández',
    message:
      'Confirmado. Voy a agregar un polyfill y refactorizar el código problemático para que sea compatible.',
    createdAt: '2025-01-07T15:00:00.000Z',
  },
  {
    id: 8,
    ticketId: 3,
    author: 'Ana García',
    message:
      'El cliente ID-0847 nos escribe urgente por este tema. Tienen muchos usuarios en macOS con Safari.',
    createdAt: '2025-01-07T16:30:00.000Z',
  },

  // Ticket 4
  {
    id: 9,
    ticketId: 4,
    author: 'Ana García',
    message:
      'Confirmado el doble cobro en 23 cuentas. Ya inicié el proceso de reembolso manual para los casos identificados. Seguimos investigando la causa raíz.',
    createdAt: '2025-01-14T09:00:00.000Z',
  },
  {
    id: 10,
    ticketId: 4,
    author: 'Jorge Fernández',
    message:
      'El problema estaba en un job programado que se ejecutó dos veces por un error en la configuración del cron. Está corregido. No debería volver a ocurrir.',
    createdAt: '2025-01-14T16:00:00.000Z',
  },

  // Ticket 7
  {
    id: 11,
    ticketId: 7,
    author: 'María Rodríguez',
    message:
      'Identifiqué 3 queries N+1 en el servicio de analytics. La peor hace una query por cada fila del resultado principal. Con EXPLAIN ANALYZE muestra un costo de 8000.',
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 12,
    ticketId: 7,
    author: 'Jorge Fernández',
    message:
      'Agreé. Podemos resolverlo con un JOIN y un índice compuesto. Estimo entre 2 y 3 días de trabajo. Creo el ticket de mejora vinculado.',
    createdAt: '2025-01-15T11:30:00.000Z',
  },

  // Ticket 8
  {
    id: 13,
    ticketId: 8,
    author: 'Jorge Fernández',
    message:
      'El SDK de Stripe 14 cambió el formato de los eventos de webhook. El campo "data.object" ahora viene anidado de forma diferente. Necesito actualizar el parser.',
    createdAt: '2025-01-16T09:00:00.000Z',
  },
  {
    id: 14,
    ticketId: 8,
    author: 'Ana García',
    message: 'Mientras se resuelve, ¿podemos revertir temporalmente a la versión 13 del SDK?',
    createdAt: '2025-01-16T10:00:00.000Z',
  },
  {
    id: 15,
    ticketId: 8,
    author: 'Jorge Fernández',
    message:
      'No es posible revertir sin afectar otras funcionalidades nuevas. Voy a acelerar el fix y tenerlo listo para mañana.',
    createdAt: '2025-01-16T10:30:00.000Z',
  },

  // Ticket 9
  {
    id: 16,
    ticketId: 9,
    author: 'Ana García',
    message:
      'El servicio de emails (SendGrid) muestra los jobs como "delivered" pero los correos no llegan. Puede ser un problema de dominio de envío o SPF/DKIM.',
    createdAt: '2025-01-13T09:00:00.000Z',
  },
  {
    id: 17,
    ticketId: 9,
    author: 'Carlos López',
    message:
      'Revisé la configuración DNS. El registro SPF está desactualizado después de la migración de dominio. Voy a actualizarlo.',
    createdAt: '2025-01-13T11:00:00.000Z',
  },

  // Ticket 12
  {
    id: 18,
    ticketId: 12,
    author: 'María Rodríguez',
    message:
      'El stack trace muestra que el crash ocurre en NotificationListActivity al intentar parsear el payload. El campo "data.deeplink" a veces viene como null y no está siendo manejado.',
    createdAt: '2025-01-17T09:00:00.000Z',
  },
  {
    id: 19,
    ticketId: 12,
    author: 'Jorge Fernández',
    message:
      'Preparando el fix. Agrego null check y un fallback a la pantalla principal cuando el deeplink no está disponible. Debería estar en la próxima build.',
    createdAt: '2025-01-17T10:15:00.000Z',
  },
  {
    id: 20,
    ticketId: 12,
    author: 'Ana García',
    message:
      'El cliente prioritario ID-7751 nos contactó por teléfono por este tema. Está afectando su equipo de ventas de 30 personas.',
    createdAt: '2025-01-17T11:00:00.000Z',
  },

  // Ticket 14
  {
    id: 21,
    ticketId: 14,
    author: 'Jorge Fernández',
    message:
      'El bug está en el service de búsqueda: el filtro de categoría se aplica después de la paginación. Hay que invertir el orden de las operaciones.',
    createdAt: '2025-01-18T10:00:00.000Z',
  },
  {
    id: 22,
    ticketId: 14,
    author: 'María Rodríguez',
    message:
      'También noto que el índice de búsqueda no incluye el campo category. Eso también afecta la performance. Lo agrego al fix.',
    createdAt: '2025-01-18T11:00:00.000Z',
  },

  // Ticket 16
  {
    id: 23,
    ticketId: 16,
    author: 'María Rodríguez',
    message:
      'El dashboard hace 12 requests en cascada al cargar. Podemos paralelizarlos con Promise.all y reducir el tiempo a menos de 2 segundos.',
    createdAt: '2025-01-20T10:00:00.000Z',
  },
  {
    id: 24,
    ticketId: 16,
    author: 'Jorge Fernández',
    message:
      'Además hay 3 widgets que hacen polling cada 5 segundos aunque el usuario no los tenga visibles. Voy a agregar Intersection Observer para pausarlos.',
    createdAt: '2025-01-20T14:30:00.000Z',
  },
  {
    id: 25,
    ticketId: 16,
    author: 'Carlos López',
    message: 'Excelente análisis. ¿En cuánto tiempo podemos tener esto en producción?',
    createdAt: '2025-01-21T09:00:00.000Z',
  },

  // Ticket 17
  {
    id: 26,
    ticketId: 17,
    author: 'Carlos López',
    message:
      'El problema es que el evento de activación de beneficios se procesa en una cola con prioridad baja. Voy a moverlo a la cola de alta prioridad.',
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 27,
    ticketId: 17,
    author: 'Ana García',
    message:
      'Perfecto. Mientras tanto, ¿podemos activar manualmente los beneficios para los usuarios afectados de esta semana?',
    createdAt: '2025-01-15T11:00:00.000Z',
  },

  // Ticket 18
  {
    id: 28,
    ticketId: 18,
    author: 'Jorge Fernández',
    message:
      'Encontré el bug: el refresh token se está guardando con una expiración de 15 minutos en lugar de 8 horas. Error tipográfico en la configuración: "15m" en lugar de "8h".',
    createdAt: '2025-01-18T12:00:00.000Z',
  },
  {
    id: 29,
    ticketId: 18,
    author: 'María Rodríguez',
    message:
      'Clásico. Ya hice el fix en staging. ¿Hacemos el deploy hoy o esperamos el próximo ciclo?',
    createdAt: '2025-01-18T12:30:00.000Z',
  },
  {
    id: 30,
    ticketId: 18,
    author: 'Ana García',
    message:
      'Hacemos el deploy hoy. Este bug está afectando la productividad de los usuarios. Coordino con el equipo de QA.',
    createdAt: '2025-01-18T13:00:00.000Z',
  },

  // Ticket 22
  {
    id: 31,
    ticketId: 22,
    author: 'Carlos López',
    message:
      'Los cupones nuevos se generan con un prefijo "2025_" pero el validador solo acepta el formato antiguo sin prefijo. Hay que actualizar la regex de validación.',
    createdAt: '2025-01-23T09:00:00.000Z',
  },
  {
    id: 32,
    ticketId: 22,
    author: 'Ana García',
    message:
      'Mientras se resuelve, ¿podemos generar los cupones sin el prefijo para los clientes que están esperando? El equipo de marketing necesita enviarlos hoy.',
    createdAt: '2025-01-23T10:00:00.000Z',
  },

  // Ticket 24
  {
    id: 33,
    ticketId: 24,
    author: 'Ana García',
    message:
      'Identifiqué 47 cuentas afectadas. El monto de diferencia varía entre $2.400 y $18.000 dependiendo del plan. Total a reembolsar: $287.600.',
    createdAt: '2025-01-22T11:00:00.000Z',
  },
  {
    id: 34,
    ticketId: 24,
    author: 'Jorge Fernández',
    message:
      'El bug está en la función de upgrade de plan: cuando se hace en diciembre, toma el precio del mes en curso en lugar de aplicar el factor anual. Fix listo para review.',
    createdAt: '2025-01-22T14:00:00.000Z',
  },
  {
    id: 35,
    ticketId: 24,
    author: 'Carlos López',
    message:
      'Reembolsos procesados para los 47 clientes. Se envió email de disculpa y se ofrecieron 2 meses adicionales de servicio como compensación.',
    createdAt: '2025-01-23T16:00:00.000Z',
  },

  // Ticket 25
  {
    id: 36,
    ticketId: 25,
    author: 'Jorge Fernández',
    message:
      'El parámetro "page" se está convirtiendo a string en el middleware antes de llegar al resolver. Hay que parsear a entero explícitamente.',
    createdAt: '2025-01-25T10:00:00.000Z',
  },
  {
    id: 37,
    ticketId: 25,
    author: 'María Rodríguez',
    message:
      'Fix aplicado. Ahora también agregué validación para evitar páginas negativas o mayores al total disponible.',
    createdAt: '2025-01-25T14:30:00.000Z',
  },

  // Ticket 28
  {
    id: 38,
    ticketId: 28,
    author: 'Ana García',
    message:
      'Revisé el job de sincronización del historial. Corre cada 24 horas y tiene un retraso adicional de procesamiento. Voy a proponer cambiarlo a tiempo real con webhooks.',
    createdAt: '2025-01-27T09:00:00.000Z',
  },
  {
    id: 39,
    ticketId: 28,
    author: 'Carlos López',
    message:
      'Buen punto. Mientras tanto, como workaround podemos forzar la sincronización manual para los clientes afectados que contacten a soporte.',
    createdAt: '2025-01-27T10:00:00.000Z',
  },

  // Ticket 31
  {
    id: 40,
    ticketId: 31,
    author: 'María Rodríguez',
    message:
      'URGENTE: Confirmado el problema de seguridad. Los tokens no se agregan a una blacklist al hacer logout. Cualquier token interceptado previamente sigue siendo válido hasta su expiración (8h).',
    createdAt: '2025-01-28T10:30:00.000Z',
  },
  {
    id: 41,
    ticketId: 31,
    author: 'Jorge Fernández',
    message:
      'Implementando blacklist de tokens en Redis. El fix debería estar en producción en 2 horas. También voy a reducir el TTL de los tokens de 8h a 1h como medida adicional.',
    createdAt: '2025-01-28T11:00:00.000Z',
  },
  {
    id: 42,
    ticketId: 31,
    author: 'Ana García',
    message:
      'Hasta que el fix esté deployado, ¿deberíamos invalidar todos los tokens activos como medida de emergencia? Sería disruptivo pero más seguro.',
    createdAt: '2025-01-28T11:30:00.000Z',
  },

  // Ticket 33
  {
    id: 43,
    ticketId: 33,
    author: 'Jorge Fernández',
    message:
      'El editor guarda correctamente en el frontend pero el backend está saneando el HTML de entrada y eliminando las etiquetas de formato por seguridad. Hay que revisar la política de sanitización.',
    createdAt: '2025-01-31T09:00:00.000Z',
  },
  {
    id: 44,
    ticketId: 33,
    author: 'María Rodríguez',
    message:
      'Solución: usar un allowlist de etiquetas HTML seguras (b, i, ul, ol, li, a, p) en lugar de bloquear todo. Implemento DOMPurify con configuración customizada.',
    createdAt: '2025-01-31T10:30:00.000Z',
  },

  // Ticket 35
  {
    id: 45,
    ticketId: 35,
    author: 'María Rodríguez',
    message:
      'Implementaré reconexión automática con backoff exponencial. El primer intento en 1s, luego 2s, 4s, 8s hasta un máximo de 30s.',
    createdAt: '2025-02-02T09:30:00.000Z',
  },
  {
    id: 46,
    ticketId: 35,
    author: 'Jorge Fernández',
    message:
      'También hay que emitir un evento al componente cuando la reconexión es exitosa para que recargue el estado en tiempo real. Lo agrego al plan.',
    createdAt: '2025-02-02T10:00:00.000Z',
  },

  // Ticket 38
  {
    id: 47,
    ticketId: 38,
    author: 'Carlos López',
    message:
      'Contacté a la pasarela de pagos. El rechazo viene de su lado porque están clasificando incorrectamente algunas tarjetas de débito prepago como tarjetas de débito inválidas.',
    createdAt: '2025-02-04T09:00:00.000Z',
  },
  {
    id: 48,
    ticketId: 38,
    author: 'Ana García',
    message:
      'Tienen que actualizar su base de datos de BINs. Mientras tanto, ¿podemos ofrecer a los usuarios afectados que paguen por transferencia bancaria?',
    createdAt: '2025-02-04T10:00:00.000Z',
  },
  {
    id: 49,
    ticketId: 38,
    author: 'Carlos López',
    message:
      'Acordado con la pasarela: actualizarán los BINs en las próximas 48hs. Comunicamos a los afectados la opción de transferencia mientras tanto.',
    createdAt: '2025-02-04T11:00:00.000Z',
  },

  // Ticket 41
  {
    id: 50,
    ticketId: 41,
    author: 'Jorge Fernández',
    message:
      'La sincronización falla porque el service worker no está registrando las operaciones pendientes en IndexedDB antes de perder conexión. Hay que agregar la escritura antes de hacer el fetch.',
    createdAt: '2025-02-07T10:00:00.000Z',
  },
  {
    id: 51,
    ticketId: 41,
    author: 'María Rodríguez',
    message:
      'Además necesitamos manejar conflictos: si el usuario editó un registro offline y alguien más lo editó online, ¿cuál tiene prioridad? Propongo "last write wins" con timestamp.',
    createdAt: '2025-02-07T12:00:00.000Z',
  },

  // Ticket 44
  {
    id: 52,
    ticketId: 44,
    author: 'Ana García',
    message:
      'Confirmado: la función de pausa actualiza el campo "status" en nuestra DB pero no llama al endpoint de Stripe para pausar la suscripción. El cobro continúa del lado de Stripe.',
    createdAt: '2025-02-09T11:00:00.000Z',
  },
  {
    id: 53,
    ticketId: 44,
    author: 'Carlos López',
    message:
      'Fix listo: agrego la llamada a stripe.subscriptions.update() con pause_collection en el servicio de suscripciones. También procedo con los reembolsos de los cobros indebidos.',
    createdAt: '2025-02-09T14:00:00.000Z',
  },
  {
    id: 54,
    ticketId: 44,
    author: 'Jorge Fernández',
    message:
      'Identifiqué 12 cuentas pausadas que fueron cobradas indebidamente. Total a reembolsar: $54.000. ¿Procedemos con el batch de reembolsos?',
    createdAt: '2025-02-09T15:30:00.000Z',
  },

  // Ticket 47
  {
    id: 55,
    ticketId: 47,
    author: 'María Rodríguez',
    message:
      'URGENTE: El endpoint expuesto incluye métricas de CPU, memoria, conexiones activas a la DB y versión del runtime. Un atacante podría usar esto para planificar un ataque dirigido.',
    createdAt: '2025-02-10T08:30:00.000Z',
  },
  {
    id: 56,
    ticketId: 47,
    author: 'Jorge Fernández',
    message:
      'Agregando autenticación básica al endpoint como solución temporal. Solución definitiva: mover las métricas a una red interna accesible solo desde la VPN.',
    createdAt: '2025-02-10T09:00:00.000Z',
  },

  // Ticket 49
  {
    id: 57,
    ticketId: 49,
    author: 'Jorge Fernández',
    message:
      'El problema es que las fechas se guardan en UTC pero al filtrar se toma el rango de fechas en UTC también, ignorando el offset del usuario. Hay que convertir el rango antes de hacer la query.',
    createdAt: '2025-02-13T09:00:00.000Z',
  },
  {
    id: 58,
    ticketId: 49,
    author: 'María Rodríguez',
    message:
      'Para la conversión voy a usar date-fns-tz. También deberíamos mostrar en la UI la zona horaria que estamos usando para los filtros para que sea transparente al usuario.',
    createdAt: '2025-02-13T11:00:00.000Z',
  },
];
