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

  deleteApplications(applicationId: any):Observable<any> {

    const deleteAppUrl = urls.deleteApplication
    const headers = {
      applicationId: applicationId
    }
    const options: any = { headers: headers }
   return this.http.post(deleteAppUrl, null, options)
  }


}
