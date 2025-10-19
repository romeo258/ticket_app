import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IResponse } from '../interface/response';
import { server } from '../utils/fileutils';

@Injectable()
export class NotificationService {
  private jwt = new JwtHelperService();
  private http = inject(HttpClient);
  

  constructor() { }

  messages$ = () => <Observable<IResponse>>
    this.http.get<IResponse>
      (`${server}/notification/messages`)
      .pipe(
        tap(() => console.log('Inside User Service')),
        tap(console.log),
        catchError(this.handleError)
      );

  sendMessages$ = (form: FormData) => <Observable<IResponse>>
    this.http.post<IResponse>
      (`${server}/notification/messages`, form)
      .pipe(
        tap(() => console.log('Inside User Service')),
        tap(console.log),
        catchError(this.handleError)
      );

  replyToMessage$ = (form: FormData) => <Observable<IResponse>>
    this.http.post<IResponse>
      (`${server}/notification/reply`, form)
      .pipe(
        tap(() => console.log('Inside User Service')),
        tap(console.log),
        catchError(this.handleError)
      );

  getConversation$ = (conversaionId: string) => <Observable<IResponse>>
    this.http.get<IResponse>
      (`${server}/notification/messages/${conversaionId}`)
      .pipe(
        tap(() => console.log('Inside User Service')),
        tap(console.log),
        catchError(this.handleError)
      );


  handleError(httpErrorResponse: HttpErrorResponse): Observable<IResponse> {
    console.log(httpErrorResponse);
    let error: string;
    if (httpErrorResponse.error instanceof ErrorEvent) {
      error = `A client error occurred - ${httpErrorResponse.error.message}`;
      return throwError(() => error);
    }
    if (httpErrorResponse.error.message) {
      error = `${httpErrorResponse.error.message}`;
      return throwError(() => error);
    }
    if (httpErrorResponse.error.error && httpErrorResponse.error.error.status !== 400) {
      error = `Please login in again`;
      return throwError(() => error);
    }
    return throwError(() => error);
  }

}