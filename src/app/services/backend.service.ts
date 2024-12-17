import { Injectable } from '@angular/core';
import { urls } from '../../urls';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http:HttpClient) { }
  deleteBackend(backendId:any){
    const url=urls.deleteBackend+`?backendId=${backendId}`;
    return this.http.post(url,null)
  }
}
