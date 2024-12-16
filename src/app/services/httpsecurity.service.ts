import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpsecurityService {


  

  private apiUrl = 'http://localhost:8082/krakend/extraconfig/httpSecurity/addorUpdateHttpSecurity'; // Replace with your backend URL
  // private apiUrl = ''; // Replace with your backend URL


  constructor(private http: HttpClient) { }

  // Example of a POST request
  createData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

}
