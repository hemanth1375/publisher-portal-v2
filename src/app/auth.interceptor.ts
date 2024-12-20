import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeycloakEventType, KeycloakService } from "keycloak-angular";
import { catchError, filter, Observable, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
   private keycloak:KeycloakService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      

    const authToken = localStorage.getItem('token');
console.log(authToken);

    // Clone the request to add the new header
    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
       
        return throwError(error);
      })
    );
  }
}


