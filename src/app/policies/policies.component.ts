import { JsonPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndpointService } from '../services/endpoint.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent implements OnInit{

  securityPolTooltip="Implement all sorts of validations and user access control, from parameter compliance, to RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control) strategies."
  secReqPolicyToolTip="Policy. Example: hasQuerystring('q')"


  formGroupPolicies: FormGroup;
  jsonValue: any;
  endpointId: any;
  endPointData:any;
    
  parameterArraySecReqPolicy: any = [];
  parameterArraySecResPolicy: any = [];
  parameterArrayJwtValReqPolicy: any = [];

  constructor(private formBuilder:FormBuilder, private endpointService:EndpointService,private route: ActivatedRoute){
    this.formGroupPolicies = this.formBuilder.group({
      securityReqPolicy: [null],
      secReqErrorStCode: [null],
      secReqErrorBody: [null],
      secReqErrorContentType: [null],
      securityResPolicy: [null],
      secResErrorStCode: [null],
      secResErrorBody: [null],
      secResErrorContentType: [null],
      jwtReqPolicy: [null],
      enableDebug: [false],
      autoJoinPolicies: [false],
      disableMacros: [false],

      resSchemaValErrorMsg: [null],
      resSchemaValErrorStCode: [null],
      

      secReqPolicyArrayValue: [[]],
      secResPolicyArrayValue: [[]],
      jwtReqPolicyArrayValue: [[]],

      isSpFilterActive:[false],
      isRequestSchValidatorActive:[false],
      isResponseSchValidatorActive:[false],
      
      reqJSONSchema:[JSON.stringify(this.jsonDataForReq, null, 2) ],
      resJSONSchema:[JSON.stringify(this.jsonDataForRes, null, 2) ]

    })
  }

  jsonDataForReq =
    {
      "type": "object",
      "required": [
        "number",
        "street_name",
        "street_type"
      ],
      "properties": {
        "number": {
          "type": "number"
        },
        "street_name": {
          "type": "string"
        },
        "street_type": {
          "type": "string",
          "enum": [
            "Street",
            "Avenue",
            "Boulevard"
          ]
        }
      }
    };

  jsonDataForRes = {
    "type": "object",
    "required": [
      "required_field_1",
      "required_field_2"
    ]
  }
    
  
  addParameter(fieldName: 'securityReqPolicy' | 'securityResPolicy' | 'jwtReqPolicy') {
    const fieldValue = this.formGroupPolicies.get(fieldName)?.value;
    if (fieldName) {
      if (fieldName === 'securityReqPolicy') {
        this.parameterArraySecReqPolicy.push(fieldValue);
        this.formGroupPolicies.get('secReqPolicyArrayValue')?.setValue([...this.parameterArraySecReqPolicy]);
      }
      else if (fieldName === 'securityResPolicy') {
        this.parameterArraySecResPolicy.push(fieldValue);
        this.formGroupPolicies.get('secResPolicyArrayValue')?.setValue([...this.parameterArraySecResPolicy]);
      }
      else if (fieldName === 'jwtReqPolicy') {
        this.parameterArrayJwtValReqPolicy.push(fieldValue);
        this.formGroupPolicies.get('jwtReqPolicyArrayValue')?.setValue([...this.parameterArrayJwtValReqPolicy]);
      }
      this.formGroupPolicies.get(fieldName)?.reset();
    }

  }

  removeParameter(index: number, fieldName: 'securityReqPolicy' | 'securityResPolicy' | 'jwtReqPolicy') {
    if (fieldName === 'securityReqPolicy') {
      this.parameterArraySecReqPolicy.splice(index, 1);
      this.formGroupPolicies.get('secReqPolicyArrayValue')?.setValue([...this.parameterArraySecReqPolicy]);
    }
    else if (fieldName === 'securityResPolicy') {
      this.parameterArraySecResPolicy.splice(index, 1);
      this.formGroupPolicies.get('secResPolicyArrayValue')?.setValue([...this.parameterArraySecResPolicy]);
    }
    else if (fieldName === 'jwtReqPolicy') {
      this.parameterArrayJwtValReqPolicy.splice(index, 1);
      this.formGroupPolicies.get('jwtReqPolicyArrayValue')?.setValue([...this.parameterArrayJwtValReqPolicy]);
    }
  }

  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });

    this.endpointService.getEndpointById(this.endpointId).subscribe({
      next:(res)=>{
        console.log(res);
        this.endPointData = res;

        if(this.endPointData){
          this.parameterArraySecReqPolicy=this.endPointData?.extra_config?.["security/policies"]?.req?.policies ?? [];
          this.parameterArraySecResPolicy=this.endPointData?.extra_config?.["security/policies"]?.resp?.policies ?? [];
          this.parameterArrayJwtValReqPolicy=this.endPointData?.extra_config?.["security/policies"]?.jwt?.policies ?? [];
        }

        this.formGroupPolicies.patchValue({
          secReqPolicyArrayValue:this.endPointData?.extra_config?.["security/policies"]?.req?.policies,
          secReqErrorBody:this.endPointData?.extra_config?.["security/policies"]?.req?.error?.body,
          secReqErrorStCode:this.endPointData?.extra_config?.["security/policies"]?.req?.error?.status,
          secReqErrorContentType:this.endPointData?.extra_config?.["security/policies"]?.req?.error?.content_type,
          secResPolicyArrayValue: this.endPointData?.extra_config?.["security/policies"]?.resp?.policies,
          secResErrorStCode: this.endPointData?.extra_config?.["security/policies"]?.resp?.error?.status,
          secResErrorBody: this.endPointData?.extra_config?.["security/policies"]?.resp?.error?.body,
          secResErrorContentType: this.endPointData?.extra_config?.["security/policies"]?.resp?.error?.content_type,
          jwtReqPolicyArrayValue: this.endPointData?.extra_config?.["security/policies"]?.jwt?.policies,

          enableDebug: this.endPointData?.extra_config?.["security/policies"]?.debug,
          autoJoinPolicies: this.endPointData?.extra_config?.["security/policies"]?.auto_join_policies,
          disableMacros: this.endPointData?.extra_config?.["security/policies"]?.disable_macros,


          resSchemaValErrorMsg: this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"]?.error?.body,
          resSchemaValErrorStCode: this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"]?.error?.status,

          isSpFilterActive:!!this.endPointData?.extra_config?.["security/policies"],

          isRequestSchValidatorActive:!!this.endPointData?.extra_config?.["validation/json-schema"],

          isResponseSchValidatorActive:!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.name?.includes("response-schema-validator"),

          reqJSONSchema:JSON.stringify(this.endPointData?.extra_config?.["validation/json-schema"],  null, 2),

          resJSONSchema: JSON.stringify(this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"]?.schema,  null, 2)
        })
        
      },
      error:(err)=>{
        console.error(err);
      }
    });
  }

  submit(){    
    const body = {
      ...(this.formGroupPolicies.value?.isSpFilterActive && {
        "security/policies": {
          ...(!!this.endPointData?.extra_config?.["security/policies"] && {"id":this.endPointData?.extra_config?.["security/policies"]?.id}),
          "req": {
            "policies": this.formGroupPolicies.value?.secReqPolicyArrayValue,
            "error": {
              "body": this.formGroupPolicies.value?.secReqErrorBody,
              "status": this.formGroupPolicies.value?.secReqErrorStCode,
              "content_type": this.formGroupPolicies.value?.secReqErrorContentType
            }
          },
          "resp": {
            "policies": this.formGroupPolicies.value?.secResPolicyArrayValue,
            "error": {
              "status": this.formGroupPolicies.value?.secResErrorStCode,
              "body": this.formGroupPolicies.value?.secResErrorBody,
              "content_type": this.formGroupPolicies.value?.secResErrorContentType
            }
          },
          "jwt": {
            "policies": this.formGroupPolicies.value?.jwtReqPolicyArrayValue
          },
          "debug": this.formGroupPolicies.value?.enableDebug,
          "auto_join_policies": this.formGroupPolicies.value?.autoJoinPolicies,
          "disable_macros": this.formGroupPolicies.value?.disableMacros
        }
      }),

      ...((this.formGroupPolicies.value?.isResponseSchValidatorActive) && {
        "plugin/req-resp-modifier": {
          ...(!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"] && {"id":this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.id}),
          "name": [
            this.formGroupPolicies.value?.isResponseSchValidatorActive && "response-schema-validator",
          ].filter(Boolean),
          ...(this.formGroupPolicies.value?.isResponseSchValidatorActive && {
            "response-schema-validator": {
              ...(!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"] && {"id":this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"].id}),
              "error": {
                "status": this.formGroupPolicies.value?.resSchemaValErrorStCode,
                "body": this.formGroupPolicies.value?.resSchemaValErrorMsg
              },
              "schema": this.formGroupPolicies.value?.resJSONSchema ? JSON.parse(this.formGroupPolicies.value?.resJSONSchema) :null ,
            }
          }),
        }
      }),
      ...(this.formGroupPolicies.value?.isRequestSchValidatorActive &&{"validation/json-schema": this.formGroupPolicies.value?.reqJSONSchema ? JSON.parse(this.formGroupPolicies.value?.reqJSONSchema) :null}),
    };
    

    console.log(body);
    
    // this.endpointService.addPolicies(this.endpointId, body).subscribe({
    //   next:(res)=>{
    //     console.log(res)
    //   },
    //   error:(err)=>{
    //     console.error(err)
    //   }
    // })


  }

}
