import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { Ticket } from '../models/interfaces/ticket.interface';
import { Comment } from '../models/interfaces/comment.interface';
import {
  CreateTicketPayload,
  TicketListParams,
  TicketListResponse,
  UpdateTicketPayload,
} from '../models/interfaces/ticket-api.interface';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/tickets';

  getTickets(params: TicketListParams = {}): Observable<TicketListResponse> {
    const httpParams = this.buildParams(params);
    return this.http
      .get<TicketListResponse>(this.baseUrl, { params: httpParams })
      .pipe(catchError((err) => throwError(() => err)));
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http
      .get<Ticket>(`${this.baseUrl}/${id}`)
      .pipe(catchError((err) => throwError(() => err)));
  }

  createTicket(payload: CreateTicketPayload): Observable<Ticket> {
    return this.http
      .post<Ticket>(this.baseUrl, payload)
      .pipe(catchError((err) => throwError(() => err)));
  }

  updateTicket(id: number, payload: UpdateTicketPayload): Observable<Ticket> {
    return this.http
      .put<Ticket>(`${this.baseUrl}/${id}`, payload)
      .pipe(catchError((err) => throwError(() => err)));
  }

  getComments(ticketId: number): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.baseUrl}/${ticketId}/comments`)
      .pipe(catchError((err) => throwError(() => err)));
  }

  addComment(ticketId: number, payload: Pick<Comment, 'author' | 'message'>): Observable<Comment> {
    return this.http
      .post<Comment>(`${this.baseUrl}/${ticketId}/comments`, payload)
      .pipe(catchError((err) => throwError(() => err)));
  }

  // Converts the params object into HttpParams, skipping empty/undefined values
  private buildParams(params: TicketListParams): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }
}
