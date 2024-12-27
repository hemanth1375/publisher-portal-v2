import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-applicationoverview',
  templateUrl: './applicationoverview.component.html',
  styleUrl: './applicationoverview.component.css'
})
export class ApplicationoverviewComponent {

  applicationId: any
  data: any
  applicationData = history.state;
  constructor(private router: Router, private route: ActivatedRoute) {
    // console.log("bbbbbbbbbbbbbbbbb",this.router?.getCurrentNavigation()?.extras.state);
    // const stateObj = this.router.lastSuccessfulNavigation?.extras.state;
    // console.log("ccccccccccccccccc", stateObj);
    // const navigation = this.router.getCurrentNavigation();
    // this.data = navigation?.extras.state?.['data'];
    // console.log("11111111111111111111", this.data);
  }

  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  ngOnInit() {
    console.log(this.applicationData);
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation) {
    //   console.log('Navigation:', this.router.getCurrentNavigation());
    //   this.data = navigation?.extras.state?.['data'];
    // }
    // const navigation = this.router.getCurrentNavigation();
    // this.data = navigation?.extras.state?.['data'];
    // console.log("22222222222222222222", this.data);


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