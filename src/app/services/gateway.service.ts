import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  constructor(private http: HttpClient) {}

   getGatewayDetailsById(gatewayId: any) {
    const url = urls.getEndpointById + `?krakendId=${gatewayId}`;
    return this.http.get(url);
  }

  addApiMontezation(gatewayId: any, body: any) {
    const url = urls.addOrUpdateTelemetryMoesifUrl + `?krakendId=${gatewayId}`;
    return this.http.post(url, body);
  }

  

}
