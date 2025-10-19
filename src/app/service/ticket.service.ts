import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { IQuery } from '../interface/query';
import { IResponse } from '../interface/response';
import { ITicket } from '../interface/ticket';
import { server } from '../utils/fileutils';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private http = inject(HttpClient);

  constructor() { }

  tickets$ = (query: IQuery) => <Observable<IResponse>>
    this.http.get<IResponse>
      (`${server}/ticket/list?page=${query.page}&size=${query.size}&status=${query.status}&type=${query.type}&filter=${query.filter}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  allTickets$ = () => <Observable<IResponse>>
    this.http.get<IResponse>
      (`${server}/ticket/all`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  creatTicket$ = (form: FormData) => <Observable<IResponse>>
    this.http.post<IResponse>
      (`${server}/ticket/create`, form)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  report$ = (request: any) => <Observable<IResponse>>
    this.http.post<IResponse>
      (`${server}/ticket/report`, request)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  downloadReport$ = (request: any) => <Observable<HttpResponse<Blob>>>
    this.http.post
      (`${server}/ticket/report/download`, request, 
        {
          reportProgress: false,
          observe: 'response',
          responseType: 'blob'
        }
      )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  ticket$ = (ticketUuid: string) => <Observable<IResponse>>
    this.http.get<IResponse>
      (`${server}/ticket/${ticketUuid}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updateTicket$ = (ticket: ITicket) => <Observable<IResponse>>
    this.http.put<IResponse>
      (`${server}/ticket/update`, ticket)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updateAssignee$ = (formaData: FormData) => <Observable<IResponse>>
    this.http.put<IResponse>
      (`${server}/ticket/update/assignee`, formaData)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  addComment$ = (formaData: FormData) => <Observable<IResponse>>
    this.http.post<IResponse>
      (`${server}/ticket/comment/create`, formaData)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updateComment$ = (formaData: FormData) => <Observable<IResponse>>
    this.http.put<IResponse>
      (`${server}/ticket/comment/update`, formaData)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  uploadFiles$ = (form: FormData) => <Observable<IResponse>>
    this.http.post<IResponse>
      (`${server}/ticket/file/upload`, form)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  downloadFile$ = (fileUuid: string) => <Observable<HttpResponse<Blob>>>
    this.http.get
      (`${server}/ticket/file/download/${fileUuid}`, 
        {
        reportProgress: false,
        observe: 'response',
        responseType: 'blob'
      })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  deleteFile$ = (form: FormData) => <Observable<IResponse>>
    this.http.delete<IResponse>
      (`${server}/ticket/file/delete`, {  body: form })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  deleteComment$ = (formaData: FormData) => <Observable<IResponse>>
    this.http.delete<IResponse>
      (`${server}/ticket/comment/delete`, { body: formaData })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  createTask$ = (formaData: FormData) => <Observable<IResponse>>
    this.http.put<IResponse>
      (`${server}/ticket/task/create`, formaData)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );


  handleError(httpErrorResponse: HttpErrorResponse): Observable<IResponse> {
    console.log(httpErrorResponse);
    let error: string;
    if (httpErrorResponse.error instanceof ErrorEvent) {
      error = `A client error occurred - ${httpErrorResponse.error.message}`;
    }
    if (httpErrorResponse.error.message) {
      error = `${httpErrorResponse.error.message}`;
    }
    if (httpErrorResponse.error.error) {
      error = `Please login in again`;
    }
    return throwError(() => error);
  }
}
