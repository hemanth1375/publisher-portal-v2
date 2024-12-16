import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http:HttpClient) { }

  getUserDetails(userId:any){
    const url=urls.getUser;
    const headers={
      'userId':userId
    }
    const options={headers:headers}
    return this.http.post(url,null,options)
  }

  getEndpointCards(userId:any){
    // const userId=localStorage.getItem('userid')
    const url=urls.getEndpointCards+"?pageNo=0&pageSize=10";
    const headers={
      'userId':userId
    }
    const options:any={headers:headers}
    return this.http.post(url,null,options)
  }

  getCards(){
    const userId=localStorage.getItem('userid')
      const url=urls.getGatewayCards+"?pageNo=0&pageSize=10";
      const headers={
        'userId':userId
      }
      const options:any={headers:headers}
      return this.http.post(url,null,options)
    }


    createEndpoint(body:any){
      const userId=localStorage.getItem('userid')
      const url=urls.addEndpoint;
      const headers={
        'userId':userId
      }
      const options:any={headers:headers}
      return this.http.post(url,body,options)
    }

    linkEndpointWithGateway(endpointId:any,krakendId:any){
      const url=urls.linkEndpoint+`?endpointId=${endpointId}&krakendId=${krakendId}`;
      return this.http.post(url,null)
    }
    deployEndpoint(id:any){
      const url=urls.deployFile+`?krakendId=${id}`
      return this.http.get(url)
    }
    createGateway(body:any){
      const userId=localStorage.getItem('userid')
      const url=urls.saveGateway
      const headers={
        'userId':userId
      }
      const options:any={
        headers:headers
      }
      return this.http.post(url,body,options)
    }
    addBackend(endpointId:any,body:any){
      const url=urls.addbackend+`?endpointId=${endpointId}`
      return this.http.post(url,body)
    }
    getEndpoint(endpointId:any){
      const url=urls.getEndpoint+`?endpointId=${endpointId}`
      return this.http.get(url)
    }
    
    updateBackend(backendId:any,body:any){
      const url=urls.updateBackend+`?backendId=${backendId}`
      return this.http.post(url,body)
    }
    deleteEndpoint(endpointId:any){
      const url=urls.deleteEndpoint+`?endpointId=${endpointId}`
      return this.http.post(url,null)
    }
}
