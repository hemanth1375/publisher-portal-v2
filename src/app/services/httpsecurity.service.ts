import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class HttpsecurityService {




  // private apiUrl = 'http://localhost:8082/krakend/extraconfig/httpSecurity/addOrUpdateHttpSecurity'; // Replace with your backend URL

  // private apiUrl = ''; // Replace with your backend URL

  private getHttpSecurityUri = "http://localhost:8082/krakend/getKrakendJson"

  constructor(private http: HttpClient) { }

  // Example of a POST request
  createData(krakendId: any, data: any): Observable<any> {
    const postHttpSecurityUrl = urls.addOrUPdateHttpSecurity+`?krakendId=${krakendId}`
    return this.http.post(postHttpSecurityUrl, data);
  }

  getHttpSecurity(krakendId: any): Observable<any> {
    const getHttpSecurityUrls = urls.getEndpointById+`?krakendId=${krakendId}`

    // const getHttpSecurityUrls = urls.getEndpointById
    return this.http.get(getHttpSecurityUrls)
  }

}
