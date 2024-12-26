import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '../../urls';


@Injectable({
  providedIn: 'root'
})
export class SecurityAuthService {

  constructor(private http: HttpClient) { }

  userId = localStorage.getItem('userid')

  headers = {
    'userId': this.userId
  }
  options: any = { headers: this.headers }

  getSecurityAuth(): Observable<any> {
    const getSecurityAuth = urls.getSecurityAuth
    return this.http.post(getSecurityAuth, null, this.options)
  }
  PostSecurityAuthValidator(data: any): Observable<any> {
    // http://localhost:8082/krakend/endpoint/addOrUpdateAuth?endpointId=1
    // const getHttpSecurityUrls = urls.getEndpointById + `?krakendId=${krakendId}`

    const postSecurityUrl = urls.saveSecurityAuthValidator
    return this.http.post(postSecurityUrl, data, this.options); // Send POST request to backend
  }

 
  postSecurityAuthBasic(data: any): Observable<any> {
    const postAuthBasic = urls.saveSecurityAuthBasic
    return this.http.post(postAuthBasic, data, this.options)
  }

  postSecurityAuthSigner(data:any):Observable<any>{
    const authSigner=urls.saveSecurityAuthSigner
    return this.http.post(authSigner,data,this.options)
  }
 
  postSecurityAuthApiKey(data:any):Observable<any>{
    const authApiKey=urls.saveSecurityAuthApiKey
    return this.http.post(authApiKey,data,this.options)
  }
 

}
