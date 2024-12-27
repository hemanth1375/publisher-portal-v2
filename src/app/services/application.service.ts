import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '../../urls';
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }


  createApplication(consumerId: any, data: any): Observable<any> {
    const creatAppUrl = urls.createApplication
    const headers = {
      consumerId: consumerId
    }
    const options: any = { headers: headers }
    return this.http.post(creatAppUrl, data, options)
  }

  getApplication(consumerId: any): Observable<any> {
    const headers = {
      consumerId: consumerId
    }
    const options: any = { headers: headers }
    const getAppUrls = urls.getApplications + "?pageNo=0&pageSize=10"
    return this.http.post(getAppUrls, null, options)
  }

  deleteApplications(applicationId: any): Observable<any> {

    const deleteAppUrl = urls.deleteApplication
    const headers = {
      applicationId: applicationId
    }
    const options: any = { headers: headers }
    return this.http.post(deleteAppUrl, null, options)
  }

  subscribeToOAuth(endpointId: any, applicationId: any): Observable<any> {
    const url = urls.subscribeToOAuth + `?endpointId=${endpointId}&applicationId=${applicationId}`;
    return this.http.post(url, null)
  }

  unsubscribeApplication(endpointId: any): Observable<any> {
    const url = urls.unsubscribeApplication + `?endpointId=${endpointId}`;
    return this.http.post(url, null)
  }



  subscribeToBasic(endpointId: any, consumerId: any):Observable<any> {
    const basicUrl = urls.subscribeToBasic + `?endpointId=${endpointId}&consumerId=${consumerId}`
    return this.http.post(basicUrl, null)
  }

  // unsubscribeToBasic(endpointId: any):Observable<any> {
  //   const unsubscribeBasicUrl = urls.unsubscribeApplication + `?endpointId=${endpointId}`;
  //   return this.http.post(unsubscribeBasicUrl, null)
  // }

}
