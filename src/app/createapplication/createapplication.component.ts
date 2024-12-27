import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ApplicationService } from '../services/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { ToastService } from '../services/toast.service';


@Component({
  selector: 'app-createapplication',
  templateUrl: './createapplication.component.html',
  styleUrl: './createapplication.component.css'
})
export class CreateapplicationComponent {

  configForm!: FormGroup;

  redirectUriFormArray: any[] = []
  webOriginsUriFormArray: any[] = []

  consumerId: any



  constructor(private fb: FormBuilder, private applicationsrv: ApplicationService, private route: ActivatedRoute,
    private communicationSer: CommunicationService, private router: Router, private toastService: ToastService) {
    this.configForm = this.fb.group({
      clientType: ['openid-connect'],
      clientId: ['democlient'],
      name: ['demo'],
      description: [''],
      publicClient: [false],
      redirectUriForm: [''],
      webOriginsUriForm: [''],
      authorizationServicesEnabled: [false],
      serviceAccountsEnabled: [false],
      implicitFlowEnabled: [false],
      directAccessGrantsEnabled: [true],
      standardFlowEnabled: [true],
      frontchannelLogout: [true],
      oauth2deviceauthorizationgrantenabled: [false],
      oidccibagrantenabled: [false],
      // attributes: this.fb.group({
      //   saml_idp_initiated_sso_url_name: [''],
      //   'oauth2.device.authorization.grant.enabled': [false],
      //   'oidc.ciba.grant.enabled': [false]
      // }),
      alwaysDisplayInConsole: [true],
      rootUrl: ['http://localhost:4200'],
      baseUrl: [''],
      redirectUriFormArrayValue: [[]],
      webOriginsUriFormArrayValue: [[]]
    });
  }

  showSuccess(message: string) {
    this.toastService.show(message, { type: 'success' });
  }
  showError(message: string) {
    this.toastService.show(message, { type: "error" })
  }



  addParameter(fieldName: 'redirectUriForm' | 'webOriginsUriForm') {
    const fieldValue = this.configForm.get(fieldName)?.value;
    if (fieldName === 'redirectUriForm') {
      this.redirectUriFormArray.push(fieldValue)
      this.configForm.get('redirectUriFormArrayValue')?.setValue([...this.redirectUriFormArray])
    }
    if (fieldName === 'webOriginsUriForm') {
      this.webOriginsUriFormArray.push(fieldValue)
      this.configForm.get('webOriginsUriFormArrayValue')?.setValue([...this.webOriginsUriFormArray])
    }
  }


  removeParameter(index: any, fieldName: 'redirectUriForm' | 'webOriginsUriForm') {
    if (fieldName === 'redirectUriForm') {
      this.redirectUriFormArray.splice(index, 1)
      this.configForm.get('redirectUriFormArrayValue')?.setValue([...this.redirectUriFormArray])
    }
    if (fieldName === 'webOriginsUriForm') {
      this.webOriginsUriFormArray.splice(index, 1)
      this.configForm.get('webOriginsUriFormArrayValue')?.setValue([...this.webOriginsUriFormArray])
    }
  }


  entireJsonData: any
  onSubmitConfigForm() {
    console.log("*************************configvalue", this.configForm.value);


    const configFormBody = {
      // "id": this.entireJsonData?.applications?.id 
      "id": this.entireJsonData?.extra_config?.applications?.id ? this.entireJsonData?.applications?.id : null,
      ...(this.configForm.get('clientType')?.value && { protocol: this.configForm.get('clientType')?.value }),
      ...(this.configForm.get('clientId')?.value && { clientId: this.configForm.get('clientId')?.value }),
      ...(this.configForm.get('name')?.value && { name: this.configForm.get('name')?.value }),
      ...(this.configForm.get('description')?.value && { description: this.configForm.get('description')?.value }),
      ...(this.configForm.get('publicClient')?.value !== null && { publicClient: this.configForm.get('publicClient')?.value }),
      ...(this.configForm.get('authorizationServicesEnabled')?.value !== null && { authorizationServicesEnabled: this.configForm.get('authorizationServicesEnabled')?.value }),
      ...(this.configForm.get('serviceAccountsEnabled')?.value !== null && { serviceAccountsEnabled: this.configForm.get('serviceAccountsEnabled')?.value }),
      ...(this.configForm.get('implicitFlowEnabled')?.value !== null && { implicitFlowEnabled: this.configForm.get('implicitFlowEnabled')?.value }),
      ...(this.configForm.get('directAccessGrantsEnabled')?.value !== null && { directAccessGrantsEnabled: this.configForm.get('directAccessGrantsEnabled')?.value }),
      ...(this.configForm.get('standardFlowEnabled')?.value !== null && { standardFlowEnabled: this.configForm.get('standardFlowEnabled')?.value }),
      ...(this.configForm.get('frontchannelLogout')?.value !== null && { frontchannelLogout: this.configForm.get('frontchannelLogout')?.value }),
      attributes: {},
      ...(this.configForm.get('alwaysDisplayInConsole')?.value !== null && { alwaysDisplayInConsole: this.configForm.get('alwaysDisplayInConsole')?.value }),
      ...(this.configForm.get('rootUrl')?.value && { rootUrl: this.configForm.get('rootUrl')?.value }),
      ...(this.configForm.get('baseUrl')?.value && { baseUrl: this.configForm.get('baseUrl')?.value }),
      ...(this.configForm.get('redirectUriFormArrayValue')?.value.length > 0 && { redirectUris: [...this.configForm.get('redirectUriFormArrayValue')?.value] }),
      ...(this.configForm.get('webOriginsUriFormArrayValue')?.value.length > 0 && { webOrigins: [...this.configForm.get('webOriginsUriFormArrayValue')?.value] }),
    };

    console.log(configFormBody);

    this.applicationsrv.createApplication(this.consumerId, configFormBody).subscribe({
      next: (result) => {
        console.log("createApplication result", result);
        this.showSuccess(result?.message);
        this.communicationSer.emitApplicationCreated(result)
        this.router.navigate([`consumers/${this.consumerId}/application`], { replaceUrl: true })
      },
      error: (err) => {
        this.showError(err?.message)
        console.log("createApplicationerror", err);
      }


    })



  }


  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.consumerId = params.get('consumerId');
      console.log('consumerId:', this.consumerId);
    });

  }

}

// {
//   "id": null,
//   "protocol": "openid-connect",
//   "clientId": "1111",
//   "name": "mainapplication",
//   "description": "this is description",
//   "publicClient": false,
//   "authorizationServicesEnabled": true,
//   "serviceAccountsEnabled": true,
//   "implicitFlowEnabled": true,
//   "directAccessGrantsEnabled": true,
//   "standardFlowEnabled": true,
//   "frontchannelLogout": true,
//   "attributes": {},
//   "alwaysDisplayInConsole": true,
//   "rootUrl": "http://localhost:5000",
//   "baseUrl": "http://localhost:6000",
//   "redirectUris": [
//       "http://localhost:7000",
//       "http://localhost:8000"
//   ],
//   "webOrigins": [
//       "http://localhost:4000",
//       "http://localhost:3000"
//   ]
// }



