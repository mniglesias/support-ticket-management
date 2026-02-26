import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Comment } from './models/interfaces/comment.interface';
import { Ticket } from './models/interfaces/ticket.interface';
import { CreateTicketPayload, UpdateTicketPayload } from './models/interfaces/ticket-api.interface';
import { TicketPriority } from './models/types/ticket.types';
import { COMMENTS_MOCK } from './mock/comments.mock';
import { TICKETS_MOCK } from './mock/tickets.mock';

// Copy of the mocks to mutate them (create/edit) without losing the originals
let tickets: Ticket[] = [...TICKETS_MOCK];
let comments: Comment[] = [...COMMENTS_MOCK];
let nextTicketId = TICKETS_MOCK.length + 1;
let nextCommentId = COMMENTS_MOCK.length + 1;

const PRIORITY_WEIGHT: Record<TicketPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const url = req.url;
  let responseBody: unknown = null;

  // GET /api/tickets
  if (url === '/api/tickets' && req.method === 'GET') {
    const search = req.params.get('search')?.toLowerCase() ?? '';
    const status = req.params.get('status') ?? '';
    const priority = req.params.get('priority') ?? '';
    const category = req.params.get('category') ?? '';
    const assignee = req.params.get('assignee') ?? '';
    const sort = req.params.get('sort') ?? 'updatedAt';
    const page = Number(req.params.get('page') ?? 1);
    const pageSize = Number(req.params.get('pageSize') ?? 10);

    // Filter
    let result = tickets.filter(
      (t) =>
        (!search ||
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)) &&
        (!status || t.status === status) &&
        (!priority || t.priority === priority) &&
        (!category || t.category === category) &&
        (!assignee || t.assignee === assignee),
    );

    // Order
    result.sort((a, b) =>
      sort === 'priority'
        ? PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    // Paging
    const total = result.length;
    const items = result.slice((page - 1) * pageSize, page * pageSize);

    responseBody = { items, total };
  }

  // POST /api/tickets
  if (url === '/api/tickets' && req.method === 'POST') {
    const payload = req.body as CreateTicketPayload;
    const now = new Date().toISOString();
    const newTicket: Ticket = { ...payload, id: nextTicketId++, createdAt: now, updatedAt: now };
    tickets = [...tickets, newTicket];
    responseBody = newTicket;
  }

  // GET /api/tickets/:id
  const ticketMatch = url.match(/^\/api\/tickets\/(\d+)$/);
  if (ticketMatch && req.method === 'GET') {
    responseBody = tickets.find((t) => t.id === Number(ticketMatch[1])) ?? null;
  }

  // PUT /api/tickets/:id
  if (ticketMatch && req.method === 'PUT') {
    const id = Number(ticketMatch[1]);
    const payload = req.body as UpdateTicketPayload;
    tickets = tickets.map((t) =>
      t.id === id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t,
    );
    responseBody = tickets.find((t) => t.id === id) ?? null;
  }

  // GET /api/tickets/:id/comments
  const commentsMatch = url.match(/^\/api\/tickets\/(\d+)\/comments$/);
  if (commentsMatch && req.method === 'GET') {
    responseBody = comments.filter((c) => c.ticketId === Number(commentsMatch[1]));
  }

  // POST /api/tickets/:id/comments
  if (commentsMatch && req.method === 'POST') {
    const payload = req.body as Partial<Comment>;
    const newComment: Comment = {
      id: nextCommentId++,
      ticketId: Number(commentsMatch[1]),
      author: payload.author ?? 'Anonymous',
      message: payload.message ?? '',
      createdAt: new Date().toISOString(),
    };
    comments = [...comments, newComment];
    responseBody = newComment;
  }

  // Return the response with a small delay to simulate network latency
  return of(new HttpResponse({ status: 200, body: responseBody })).pipe(delay(400));
};
