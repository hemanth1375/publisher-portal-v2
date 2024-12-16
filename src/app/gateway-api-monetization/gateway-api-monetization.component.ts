import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EndpointService } from '../services/endpoint.service';
import { GatewayService } from '../services/gateway.service';

@Component({
  selector: 'app-gateway-api-monetization',
  templateUrl: './gateway-api-monetization.component.html',
  styleUrl: './gateway-api-monetization.component.css'
})
export class GatewayApiMonetizationComponent implements OnInit {

  formGroupApiMonetization: FormGroup;
  apiMonetizeInfo = "Enable the API Monetization module and start generating revenue from your APIs. The monetization integration is possible thanks to our partnership with Moesif."
  apiMonetizationAppIDFormInfo = "The Collector Application ID is used to send events, actions, users, and companies to Moesif's Collector API. Moesif provides it under the 'API Keys' section."
  apiMontizeDebugInfo = "Set to true when configuring Moesif for the first time while in development, to see the activity in the logs. Set to false inproduction."
  apiMonetizationHeadersFormInfo = "Defines the list of possible headers that can identify a user uniquely. When the header is Authorization, it automatically extracts the username if it contains an Authorization: Basic value with no additional configuration. If, on the other hand, you use tokens and pass an Authorization: Bearer, it will extract the user ID from the JWT claim defined under user_id_jwt_claim. If there are multiple headers in the list, all of them are tested in the given order, and the first existing header in the list is used to extract the user ID (successfully or not)."
  apiMonetizationClaimFormInfo = "When using JWT tokens, it defines which claim contains the user ID."

 
  gatewayId: any;
  gatewayData: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private getwayService:GatewayService) {
    this.formGroupApiMonetization = this.formBuilder.group({
      isApiMonetizationActive:[false],
      apiMonetizationAppIDForm: [null],
      apiMonetizationDebugForm: [false],
      apiMonetizationHeadersForm: [null],
      apiMonetizationClaimForm: [null],
      apiMonetizationHeadersFormArray: [[]]
    })

  }
  ngOnInit(): void {
    
    this.route.parent?.paramMap.subscribe(params => {
      this.gatewayId = params.get('id');
      console.log('Parent ID:', this.gatewayId);
    });

    this.getwayService.getGatewayDetailsById(this.gatewayId).subscribe({
      next:(res)=>{
        console.log(res);
        this.gatewayData = res;

        if(this.gatewayData){
          this.apiMonetizationHeadersArray = this.gatewayData?.extra_config?.["telemetry/moesif"]?.user_id_headers ?? [];
        }
        this.formGroupApiMonetization.patchValue({
          apiMonetizationAppIDForm : this.gatewayData?.extra_config?.["telemetry/moesif"]?.application_id,
          apiMonetizationClaimForm : this.gatewayData?.extra_config?.["telemetry/moesif"]?.user_id_jwt_claim,
          apiMonetizationDebugForm : this.gatewayData?.extra_config?.["telemetry/moesif"]?.debug
        })
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }

  apiMonetizationHeadersArray: any[] = [];
 

  addParameter(fieldName: 'apiMonetizationHeadersForm') {
    const fieldValue = this.formGroupApiMonetization.get(fieldName)?.value;
    if (fieldName) {
      if (fieldName === 'apiMonetizationHeadersForm') {
        this.apiMonetizationHeadersArray.push(fieldValue);
        this.formGroupApiMonetization.get('apiMonetizationHeadersFormArray')?.setValue([...this.apiMonetizationHeadersArray]);
      }
    }
    this.formGroupApiMonetization.get(fieldName)?.reset();
  }
  removeParameter(index: any, fieldName: 'apiMonetizationHeadersForm') {
    if (fieldName === "apiMonetizationHeadersForm") {
      this.apiMonetizationHeadersArray.splice(index, 1);
      this.formGroupApiMonetization.get('apiMonetizationHeadersFormArray')?.setValue([...this.apiMonetizationHeadersArray]);
    }
  }


  onToggleChangeStaticResponse(event: any, id: any) {
    console.log('id', id);
    (this as any)[id] = event.checked;
  }

 

  onSubmit(){
    const body = {
          ...(this.formGroupApiMonetization.value?.isApiMonetizationActive && {
            "telemetry/moesif": {
              ...(!!this.gatewayData?.extra_config?.["telemetry/moesif"] && {"id":this.gatewayData?.extra_config?.["telemetry/moesif"]?.id}),
            "application_id": this.formGroupApiMonetization.value?.apiMonetizationAppIDForm,
            "user_id_headers": this.formGroupApiMonetization.value?.apiMonetizationHeadersFormArray,
            "user_id_jwt_claim": this.formGroupApiMonetization.value?.apiMonetizationClaimForm,
            "debug": this.formGroupApiMonetization.value?.apiMonetizationDebugForm,
        }
      })
    }
    console.log(body);

     this.getwayService.addApiMontezation(this.gatewayId, body).subscribe({
      next:(res)=>{
        console.log(res)
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

}
