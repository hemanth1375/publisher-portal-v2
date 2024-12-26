import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityAuthService } from '../services/security-auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewapplication',
  templateUrl: './viewapplication.component.html',
  styleUrl: './viewapplication.component.css'
})
export class ViewapplicationComponent {
  entireJsonData: any
  apiKeysForm: FormGroup;
  keysArray: any[] = []
  apiRolesArray: any[] = []
  backendAuthBasicArry: any[] = []
  backendAuthApikeyArry: any[] = []
  receivedData: any
  basicAuthenticationToolTip = "The Basic Authentication plugin protects the access to selected endpoints using basic username and password credentials via htpasswd."
  apikeyToolTip = "The API key authentication enables a Role-Based Access Control (RBAC) mechanism by reading the Authorization header of incoming requests. For all your desired endpoints, KrakenD rejects requests from users that do not provide a valid key or are trying to access a resource with insufficient permissions for the user's role."
  constructor(private formBuilder: FormBuilder, private securityAuthService: SecurityAuthService, private router: Router,private route:ActivatedRoute) {

    this.apiKeysForm = this.formBuilder.group({
      isAPIKeyAuthActive: [false],
      APIKey: [],
      apiRole: [],
      apiRolesArrayValue: [[]],
      description: [],
      keysArray: [[]],
      apiKeyAuthId: [null]
    })


  }

  ngOnInit() {


    // const navigation = this.router.getCurrentNavigation();
    // if (navigation?.extras?.state) {
    //   this.receivedData = navigation.extras.state['data'];
    //   console.log("*******88receivedData", this.receivedData);

    // } else {
    //   console.warn('No data found in navigation state');
    //   this.receivedData = null; // Or set a default value
    // }
    // this.securityAuthService.getSecurityAuth().subscribe({
    //   next: (result) => {
    //     console.log("*********************securityAuthServiceresult", result);
    //     this.entireJsonData = result
    //     this.backendAuthBasicArry = result?.['auth/basic']
    //   },
    //   error: (err) => {
    //     console.log("securityAuthService error", err);
    //   }
    // })
  }
  onSubmitApiKeyAuthInfo(): void {
    if (this.apiKeysForm.valid) {
      console.log('Api key Auth Form submitted', this.apiKeysForm.value);
      this.apiKeysForm.get('APIKey')?.reset()
      this.apiKeysForm.get('apiRole')?.reset()
      this.apiKeysForm.get('description')?.reset()
      // if(this.apiKeysForm.get('isAPIKeyAuthActive')?.value){}



      const apikeybody = {
        ...this.apiKeysForm.get('isAPIKeyAuthActive')?.value && {
          ...(this.apiKeysForm.get('keysArray')?.value && this.apiKeysForm.get('keysArray')?.value?.length != 0 &&
          {
            "keys": this.apiKeysForm.get('keysArray')?.value
          })
        }
      }

      // this.securityAuthService.postSecurityAuthApiKey(apikeybody).subscribe(result => {
      //   console.log("onSubmitApiKeyAuthInfo", result);
      //   this.entireJsonData = result
      // })
      console.log("apikeybody", apikeybody);
    }
  }




  addKey() {
    this.keysArray.push(this.apiKeysForm.value)
    this.apiKeysForm.get('keysArray')?.setValue([...this.keysArray]);
    console.log("*****************", this.keysArray);
    // this.apiKeysForm.get('APIKey')?.reset();
    // this.apiKeysForm.get('role')?.reset();
    // this.apiKeysForm.get('description')?.reset();
  }

  addParameter(fieldName: 'apiRole') {
    let fieldValue: any
    if (fieldName === 'apiRole') {
      fieldValue = this.apiKeysForm.get(fieldName)?.value
    }

    if (fieldName) {
      if (fieldName === 'apiRole') {
        this.apiRolesArray.push(fieldValue);
        console.log("******* fieldname:", 'apiRole');

        console.log("***************apiRolesArray:", this.apiRolesArray);

        this.apiKeysForm.get('apiRolesArrayValue')?.setValue([...this.apiRolesArray]);
      }
    }
  }

  removeParameter(index: number, fieldName: 'apiRole') {
    if (fieldName === 'apiRole') {
      this.apiRolesArray.splice(index, 1);
      this.apiKeysForm.get('apiRolesArrayValue')?.setValue([...this.apiRolesArray]);

    }
  }
}
