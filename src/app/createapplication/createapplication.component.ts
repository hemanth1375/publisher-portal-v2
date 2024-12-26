import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';


@Component({
  selector: 'app-createapplication',
  templateUrl: './createapplication.component.html',
  styleUrl: './createapplication.component.css'
})
export class CreateapplicationComponent {

  configForm!: FormGroup;

  redirectUriFormArray:any[]=[]
  webOriginsUriFormArray:any[]=[]

  constructor(private fb:FormBuilder){
    this.configForm = this.fb.group({
      clientType: ['openid-connect'],
      clientId: ['democlient'],
      name: ['demo'],
      description: [''],
      publicClient: [false],
      redirectUriForm:[''],
      webOriginsUriForm:[''],
      authorizationServicesEnabled: [false],
      serviceAccountsEnabled: [false],
      implicitFlowEnabled: [false],
      directAccessGrantsEnabled: [true],
      standardFlowEnabled: [true],
      frontchannelLogout: [true],
      oauth2deviceauthorizationgrantenabled:[false],
      oidccibagrantenabled: [false],
      // attributes: this.fb.group({
      //   saml_idp_initiated_sso_url_name: [''],
      //   'oauth2.device.authorization.grant.enabled': [false],
      //   'oidc.ciba.grant.enabled': [false]
      // }),
      alwaysDisplayInConsole: [true],
      rootUrl: ['http://localhost:4200'],
      baseUrl: [''],
      // redirectUris: this.fb.array(['http://localhost:4200/*']),
      // webOrigins: this.fb.array(['http://localhost:4200'])
      redirectUriFormArrayValue:[[]],
      webOriginsUriFormArrayValue:[[]]
    });
  }

  get redirectUris(): FormArray {
    return this.configForm.get('redirectUris') as FormArray;
  }

  get webOrigins(): FormArray {
    return this.configForm.get('webOrigins') as FormArray;
  }

  addRedirectUri(uri: string): void {
    this.redirectUris.push(this.fb.control(uri));
  }

  addWebOrigin(origin: string): void {
    this.webOrigins.push(this.fb.control(origin));
  }
  get attributesFormGroup(): FormGroup {
    return this.configForm.get('attributes') as FormGroup;
  }




  addParameter(fieldName: 'redirectUriForm' | 'webOriginsUriForm'){
    const fieldValue = this.configForm.get(fieldName)?.value;
      if(fieldName=== 'redirectUriForm'){
        this.redirectUriFormArray.push(fieldValue)
        this.configForm.get('redirectUriFormArrayValue')?.setValue([...this.redirectUriFormArray])
      }
      if(fieldName=== 'webOriginsUriForm'){
        this.webOriginsUriFormArray.push(fieldValue)
        this.configForm.get('webOriginsUriFormArrayValue')?.setValue([...this.webOriginsUriFormArray])
      }  
  }


  removeParameter(index:any, fieldName: 'redirectUriForm' | 'webOriginsUriForm'){
    if(fieldName=== 'redirectUriForm'){
      this.redirectUriFormArray.splice(index,1)
      this.configForm.get('redirectUriFormArrayValue')?.setValue([...this.redirectUriFormArray])
    }
    if(fieldName=== 'webOriginsUriForm'){
      this.webOriginsUriFormArray.splice(index,1)
      this.configForm.get('webOriginsUriFormArrayValue')?.setValue([...this.webOriginsUriFormArray])
    }
  }


  onSubmitConfigForm(){
    console.log("*************************configvalue",this.configForm.value);
    
  }





}
