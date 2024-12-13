import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  constructor(private http: HttpClient) { }

  addParameterForwarding(endpointId: any, body: any) {
    const url = urls.addParametersByEndpoint + `?endpointId=${endpointId}`;
    // const headers = {
    //   "endpointId":endpointId
    // }
    // const options:any = {
    //   headers:headers
    // }
    return this.http.post(url, body);
  }

  addUpdateThrottling(endpointId: any, body: any) {
    const url = urls.addUpdateThrottling + `?endpointId=${endpointId}`;
    return this.http.post(url, body);
  }

  addResponse(endpointId: any, body: any) {
    const url = urls.addResponse +`?endpointId=${endpointId}`;
    return this.http.post(url, body);
  }

  addPolicies(endpointId: any, body: any) {
    const url = urls.addPolicies + `?endpointId=${endpointId}`;
    return this.http.post(url, body);
  }

  getEndpointById(endpointId: any) {
    const url = urls.getEndpoint + `?endpointId=${endpointId}`;
    return this.http.get(url);
  }

  addConnectivity(endpointId: any, body: any) {
    const url = urls.addConnectivity + `?endpointId=${endpointId}`;
    return this.http.post(url, body);
  }

  addOpenApi(endpointId: any, body: any) {
    const url = urls.addOpenAPI + `?endpointId=${endpointId}`;
    return this.http.post(url, body);
  }

}
