import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor() { }
  private apiCreatedSource = new Subject<any>();

  apiCreated$ = this.apiCreatedSource.asObservable();

  emitApiCreated(data: any) {
    this.apiCreatedSource.next(data);
  }
  private gatewayCreatedSource = new Subject<any>();
  gatewayCreated$ = this.gatewayCreatedSource.asObservable();
  emitGatewayCreated(data: any) {
    this.gatewayCreatedSource.next(data);
  }

   //show consumercards
  private consumercreatedSource = new Subject<any>();
  consumercreat$= this.consumercreatedSource.asObservable()
  emitConsumerCreated(data:any){
    this.consumercreatedSource.next(data)
}
 

  // showparent
  private showParentSource = new BehaviorSubject<boolean>(true); // Initial state is true
  showParent$ = this.showParentSource.asObservable();

  updateShowParent(value: boolean) {
    this.showParentSource.next(value);
  }
}
