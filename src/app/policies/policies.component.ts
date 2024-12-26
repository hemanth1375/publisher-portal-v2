import { JsonPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndpointService } from '../services/endpoint.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { CustomValidators } from '../shared/validators/custom-validators';
@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent implements OnInit {

  resonseJsonSchemaToolTip = "Write your JSON schema directly in this field, with any number of fields or validations you need."
  jsonSchemaToolTIp = "Write your JSON schema directly in this field, with any number of fields or validations you need."
  disableMacrosToolTip = "Advanced macros can be disabled when not used for a faster evaluation."
  autoJoinPoliciesTip = "All policies concatenate with an AND operation to evaluate a single expression. Faster, but harder to debug."
  enableDebugToolTip = "Evaluation results are printed in the console."
  jwtValidationToolTip = "Policy. Example: has(JWT.user_id) && 'legal' == JWT.department"
  secResErrorContentToolTip = "The Content-Type header you'd like to send with the error response. When unset, uses text/plain by default."
  secResErrorBodyToolTip = "Empty string to return the validation error, or write a string with the error response body. You can add escaped JSON, XML, etc in the string and add a Content-Type."
  secResErrorStatusToolTip = "Returned status on violated policy"
  secResPoliciesToolTip = "Policy. Example: !isEmpty(resp_data.message)"
  secErrorContentToolTip = "The Content-Type header you'd like to send with the error response. When unset, uses text/plain by default."
  secErrorBodyToolTip = "Empty string to return the validation error, or write a string with the error response body. You can add escaped JSON, XML, etc in the string and add a Content-Type."
  secErrorStatusCodeToolTip = "Returned status on violated policy"
  securityReqpolicies_tooltip = "Policy. Example: hasQuerystring('q')"
  responseSchemaValidatorToolTip = "The response schema validator plugin adds a schema validation before the gateway returns the response to the end-user or before it's merged in the endpoint with the rest of the backends."
  requestSchemaValidatorToolTip = "The policies engine lets you write custom rules validated on runtime during requests, responses, and token validation. The policies allow you to implement all sorts of validations and user access control, from parameter compliance, to RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control) strategies."
  securityPoliciesToolTip = "Implement all sorts of validations and user access control, from parameter compliance, to RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control) strategies."
  securityPolTooltip = "Implement all sorts of validations and user access control, from parameter compliance, to RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control) strategies."
  secReqPolicyToolTip = "Policy. Example: hasQuerystring('q')"
  errorMessageTooltip = "The error message you want to show<br> when the validation fails. Leave it  empty to show the JSON-schema validation error. "
  errorStCode3Tooltip = "The HTTP status code you want to set<br> back in the response."
  formGroupPolicies: FormGroup;
  jsonValue: any;
  endpointId: any;
  endPointData: any;

  parameterArraySecReqPolicy: any = [];
  parameterArraySecResPolicy: any = [];
  parameterArrayJwtValReqPolicy: any = [];

  constructor(private formBuilder: FormBuilder, private endpointService: EndpointService, private route: ActivatedRoute, private toastService: ToastService) {
    this.formGroupPolicies = this.formBuilder.group({
      securityReqPolicy: [],
      secReqErrorStCode: [null],
      secReqErrorBody: [null],
      secReqErrorContentType: [null],
      securityResPolicy: [],
      secResErrorStCode: [null],
      secResErrorBody: [null],
      secResErrorContentType: [null],
      jwtReqPolicy: [],
      enableDebug: [false],
      autoJoinPolicies: [false],
      disableMacros: [false],

      resSchemaValErrorMsg: [null],
      resSchemaValErrorStCode: [null],


      secReqPolicyArrayValue: [[[]]],
      secResPolicyArrayValue: [[[]]],
      jwtReqPolicyArrayValue: [[[]]],

      isSpFilterActive: [false],
      isRequestSchValidatorActive: [false],
      isResponseSchValidatorActive: [false],

      reqJSONSchema: [JSON.stringify(this.jsonDataForReq, null, 2),[CustomValidators.jsonValidator()]],
      resJSONSchema: [JSON.stringify(this.jsonDataForRes, null, 2),[CustomValidators.jsonValidator()]]

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

  showSuccess(message: string) {
    this.toastService.show(message, { type: 'success' });
  }


  showError(message: string) {
    this.toastService.show(message, { type: "error" })
  }

  getEndpoint() {
    this.endpointService.getEndpointById(this.endpointId).subscribe({
      next: (res) => {
        console.log(res);
        this.endPointData = res;

        if (this.endPointData) {
          this.parameterArraySecReqPolicy = this.endPointData?.extra_config?.["security/policies"]?.req?.policies ?? [];
          this.parameterArraySecResPolicy = this.endPointData?.extra_config?.["security/policies"]?.resp?.policies ?? [];
          this.parameterArrayJwtValReqPolicy = this.endPointData?.extra_config?.["security/policies"]?.jwt?.policies ?? [];
        }

        this.formGroupPolicies.patchValue({
          secReqPolicyArrayValue: this.endPointData?.extra_config?.["security/policies"]?.req?.policies,
          secReqErrorBody: this.endPointData?.extra_config?.["security/policies"]?.req?.error?.body,
          secReqErrorStCode: this.endPointData?.extra_config?.["security/policies"]?.req?.error?.status,
          secReqErrorContentType: this.endPointData?.extra_config?.["security/policies"]?.req?.error?.content_type,
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

          isSpFilterActive: !!this.endPointData?.extra_config?.["security/policies"],

          isRequestSchValidatorActive: !!this.endPointData?.extra_config?.["validation/json-schema"],

          isResponseSchValidatorActive: !!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.name?.includes("response-schema-validator"),

          reqJSONSchema: JSON.stringify(this.endPointData?.extra_config?.["validation/json-schema"], null, 2),

          resJSONSchema: JSON.stringify(this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"]?.schema, null, 2)
        })



      },
      error: (err) => {
        console.error(err);
        this.showError(err?.message)
      }
    });
  }

  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });

    this.getEndpoint();

    this.formGroupPolicies.value.get("isResponseSchValidatorActive")?.valueChanges.subscribe((value: any) =>{
      
    })

  }

  submit() {
    const body = {
      // ...(this.formGroupPolicies.value?.isSpFilterActive && {
      //   "security/policies": {
      //     ...(!!this.endPointData?.extra_config?.["security/policies"] && { "id": this.endPointData?.extra_config?.["security/policies"]?.id }),
      //     "req": {
      //       "policies": this.formGroupPolicies.value?.secReqPolicyArrayValue,
      //       "error": {
      //         "body": this.formGroupPolicies.value?.secReqErrorBody,
      //         "status": this.formGroupPolicies.value?.secReqErrorStCode,
      //         "content_type": this.formGroupPolicies.value?.secReqErrorContentType
      //       }
      //     },
      //     "resp": {
      //       "policies": this.formGroupPolicies.value?.secResPolicyArrayValue,
      //       "error": {
      //         "status": this.formGroupPolicies.value?.secResErrorStCode,
      //         "body": this.formGroupPolicies.value?.secResErrorBody,
      //         "content_type": this.formGroupPolicies.value?.secResErrorContentType
      //       }
      //     },
      //     "jwt": {
      //       "policies": this.formGroupPolicies.value?.jwtReqPolicyArrayValue
      //     },
      //     "debug": this.formGroupPolicies.value?.enableDebug,
      //     "auto_join_policies": this.formGroupPolicies.value?.autoJoinPolicies,
      //     "disable_macros": this.formGroupPolicies.value?.disableMacros
      //   }
      // }),

      ...(this.formGroupPolicies.value?.isSpFilterActive && {
        "security/policies": {
          ...(!!this.endPointData?.extra_config?.["security/policies"] && { "id": this.endPointData?.extra_config?.["security/policies"]?.id }),
          ...((this.formGroupPolicies.value?.secReqPolicyArrayValue.length>0 || this.formGroupPolicies.value?.secReqErrorStCode ||this.formGroupPolicies.value?.secReqErrorBody || this.formGroupPolicies.value?.secReqErrorContentType) &&{"req": {
            ...(this.formGroupPolicies.value?.secReqPolicyArrayValue.length>0 &&{"policies": this.formGroupPolicies.value?.secReqPolicyArrayValue}),
            ...((this.formGroupPolicies.value?.secReqErrorStCode ||this.formGroupPolicies.value?.secReqErrorBody || this.formGroupPolicies.value?.secReqErrorContentType)&& {"error": {
              ...(this.formGroupPolicies.value?.secReqErrorStCode &&{"status": this.formGroupPolicies.value?.secReqErrorStCode}),
              ...(this.formGroupPolicies.value?.secReqErrorBody &&{"body": this.formGroupPolicies.value?.secReqErrorBody}),
              ...(this.formGroupPolicies.value?.secReqErrorContentType &&{"content_type": this.formGroupPolicies.value?.secReqErrorContentType})
            }})
          }}),
          ...((this.formGroupPolicies.value?.secResPolicyArrayValue.length>0 || this.formGroupPolicies.value?.secResErrorStCode || this.formGroupPolicies.value?.secResErrorBody || this.formGroupPolicies.value?.secResErrorContentType)&&{"resp": {
            ...(this.formGroupPolicies.value?.secResPolicyArrayValue.length>0 &&{"policies": this.formGroupPolicies.value?.secResPolicyArrayValue}),
            ...((this.formGroupPolicies.value?.secResErrorStCode || this.formGroupPolicies.value?.secResErrorBody || this.formGroupPolicies.value?.secResErrorContentType)&&{"error": {
              ...(this.formGroupPolicies.value?.secResErrorStCode &&{"status": this.formGroupPolicies.value?.secResErrorStCode}),
              ...(this.formGroupPolicies.value?.secResErrorBody &&{"body": this.formGroupPolicies.value?.secResErrorBody}),
              ...(this.formGroupPolicies.value?.secResErrorContentType &&{"content_type": this.formGroupPolicies.value?.secResErrorContentType})
            }})
          }}),
          ...(this.formGroupPolicies.value?.jwtReqPolicyArrayValue?.length>0 &&{"jwt": {
            ...(this.formGroupPolicies.value?.jwtReqPolicyArrayValue?.length>0 &&{"policies": this.formGroupPolicies.value?.jwtReqPolicyArrayValue})
          }}),
          ...(this.formGroupPolicies.value?.enableDebug &&{"debug": this.formGroupPolicies.value?.enableDebug}),
          ...(this.formGroupPolicies.value?.autoJoinPolicies &&{"auto_join_policies": this.formGroupPolicies.value?.autoJoinPolicies}),
          ...(this.formGroupPolicies.value?.disableMacros &&{"disable_macros": this.formGroupPolicies.value?.disableMacros})
        }
      }),

      ...((this.formGroupPolicies.value?.isResponseSchValidatorActive) && {
        "plugin/req-resp-modifier": {
          ...(!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"] && { "id": this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.id }),
          "name": [
            this.formGroupPolicies.value?.isResponseSchValidatorActive && "response-schema-validator",
          ].filter(Boolean),
          ...(this.formGroupPolicies.value?.isResponseSchValidatorActive && {
            "response-schema-validator": {
              ...(!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"] && { "id": this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"].id }),
              "error": {
                "status": this.formGroupPolicies.value?.resSchemaValErrorStCode,
                "body": this.formGroupPolicies.value?.resSchemaValErrorMsg
              },
              "schema": this.formGroupPolicies.value?.resJSONSchema ? JSON.parse(this.formGroupPolicies.value?.resJSONSchema) : null,
            }
          }),
        }
      }),
      ...(this.formGroupPolicies.value?.isRequestSchValidatorActive && { "validation/json-schema": this.formGroupPolicies.value?.reqJSONSchema ? JSON.parse(this.formGroupPolicies.value?.reqJSONSchema) : null }),
    };


    console.log(body);

    this.endpointService.addPolicies(this.endpointId, body).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showSuccess(res?.message)
        this.getEndpoint();
      },
      error: (err) => {
        console.error(err);
        this.showError(err?.message)
        this.getEndpoint();
      }
    })
  }

}
