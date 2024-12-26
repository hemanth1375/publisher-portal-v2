import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-applicationoverview',
  templateUrl: './applicationoverview.component.html',
  styleUrl: './applicationoverview.component.css'
})
export class ApplicationoverviewComponent {

  applicationId: any

  constructor(private router: Router,private route:ActivatedRoute) {

  }

  ngOnInit() {
  //   const navigation = this.router.getCurrentNavigation();
  //   if (navigation?.extras?.state) {
  //     this.receivedData = navigation.extras.state['data'];
  //     console.log("*******88receivedData", this.receivedData);

  //   } else {
  //     console.warn('No data found in navigation state');
  //     this.receivedData = null; // Or set a default value
  //   }

  
  this.route?.parent?.paramMap.subscribe(params => {
    this.applicationId = params.get('applicationId');
    console.log('Application ID:', this.applicationId);
  });
  }
}

// {
//   "id": "string",
//   "protocol": "string",
//   "clientId": "string",
//   "secret": "string",
//   "name": "string",
//   "description": "string",
//   "publicClient": true,
//   "authorizationServicesEnabled": true,
//   "serviceAccountsEnabled": true,
//   "implicitFlowEnabled": true,
//   "directAccessGrantsEnabled": true,
//   "standardFlowEnabled": true,
//   "attributes": {
//     "additionalProp1": {},
//     "additionalProp2": {},
//     "additionalProp3": {}
//   },
//   "alwaysDisplayInConsole": true,
//   "rootUrl": "string",
//   "baseUrl": "string",
//   "redirectUris": [
//     "string"
//   ],
//   "webOrigins": [
//     "string"
//   ],
//   "frontchannelLogout": true
// }