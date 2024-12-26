import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '../../urls';
@Injectable({
  providedIn: 'root'
})
export class CreateconsumerService {

  constructor(private http: HttpClient) {

  }


  createConsumer(data: any): Observable<any> {
    const userId = localStorage.getItem("userid")
    // const getConsumerUrl = urls.getConsumer
    const headers = {
      "userId": userId
    }
    const options: any = { headers: headers }
    const createConsumerUrl = urls.createConsumer
    return this.http.post(createConsumerUrl, data, options)
  }

  getConsumer(): Observable<any> {
    const userId = localStorage.getItem("userid")
    const getConsumerUrl = urls.getConsumer + "?pageNo=0&pageSize=10"
    const headers = {
      "userId": userId
    }
    const options: any = { headers: headers }
    return this.http.post(getConsumerUrl, null, options)
  }


  deleteConsumer(consumerId: any): Observable<any> {
    const deleteConsumerUrl = urls.deleteConsumer
    const headers = {
      "consumerId": consumerId
    }
    const options: any = { headers: headers }
    return this.http.post(deleteConsumerUrl, null, options)

  }
}
