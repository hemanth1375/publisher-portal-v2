import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EndpointService } from '../services/endpoint.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-openapi',
  templateUrl: './openapi.component.html',
  styleUrl: './openapi.component.css'
})
export class OpenapiComponent implements OnInit {
  docTooltip = "The OpenAPI or Swagger documentation is automatically generated by the KrakenD Enterprise binary when you use the krakend generate openapi command."
  formGroupOpenapi: FormGroup;

  tagsArray: string[] = [];
  audienceArray: string[] = [];
  endpointId: any;
  endPointData: any;
  generalOpenApiTooltip = "General OpenAPI information for your developers. All fields are optional."
  summaryToolTip = "The title or summary of this endpoint."
  descriptionsToolTip = "Long description for this endpoint"
  tagsToolTip = "OpenAPI segments the endpoints in different tag."
  audienceToolTip = "To which audiences you will document this endpoint (e.g.: silver if you have plans like gold, silver, bronze.)"
  exampleToolTip = "Deprecated in OAS3. Write an example response in JSON format to show as an example in the documentation"


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private endpointService: EndpointService, private toastService: ToastService) {
    this.formGroupOpenapi = this.formBuilder.group({
      summary: [''],
      description: [''],
      tags: [''],
      audiences: [''],
      example: [null],
      isDocumentationActive: [false],
      tagsArrayValue: [[]],
      audienceArrayValue: [[]]
    })
  }

  getEndpoint() {
    this.endpointService.getEndpointById(this.endpointId).subscribe({
      next: (res) => {
        this.endPointData = res;

        console.log(this.endPointData);


        if (this.endPointData) {
          this.tagsArray = this.endPointData?.extra_config?.["documentation/openapi"]?.tags ?? [];
          this.audienceArray = this.endPointData?.extra_config?.["documentation/openapi"]?.audience ?? [];
        }

        this.formGroupOpenapi.patchValue({
          summary: this.endPointData?.extra_config?.["documentation/openapi"]?.summary,
          description: this.endPointData?.extra_config?.["documentation/openapi"]?.description,
          tagsArrayValue: this.endPointData?.extra_config?.["documentation/openapi"]?.tags,
          example: JSON.stringify(this.endPointData?.extra_config?.["documentation/openapi"].example, null, 2),
          isDocumentationActive: !!this.endPointData?.extra_config?.["documentation/openapi"],
          audienceArrayValue: this.endPointData?.extra_config?.["documentation/openapi"]?.audience,
        })

      },
      error: (err) => {
        console.error(err);
        this.showError(err?.message)
      }
    })
  }

  showSuccess(message: string) {
    this.toastService.show(message, { type: 'success' });
  }


  showError(message: string) {
    this.toastService.show(message, { type: "error" })
  }

  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });

    this.getEndpoint();

  }

  addParameter(fieldName: 'audiences' | 'tags') {
    const fieldValue = this.formGroupOpenapi.get(fieldName)?.value;
    console.log(fieldName);

    if (fieldName) {
      if (fieldName === 'audiences') {
        this.audienceArray.push(fieldValue);
        this.formGroupOpenapi.get('audienceArrayValue')?.setValue([...this.audienceArray]);

      } else if (fieldName === 'tags') {
        this.tagsArray.push(fieldValue);
        console.log(this.tagsArray);

        this.formGroupOpenapi.get('tagsArrayValue')?.setValue([...this.tagsArray]);
      }
      this.formGroupOpenapi.get(fieldName)?.reset();
    }
  }
  removeParameter(index: number, fieldName: 'audiences' | 'tags') {
    if (fieldName === "audiences") {
      this.audienceArray.splice(index, 1);
      this.formGroupOpenapi.get('audienceArrayValue')?.setValue([...this.audienceArray]);
    } else if (fieldName === 'tags') {
      this.tagsArray.splice(index, 1);
      this.formGroupOpenapi.get('tagsArrayValue')?.setValue([...this.tagsArray]);
    }
  }

  submit() {
    const body = {
      ...(this.formGroupOpenapi.value?.isDocumentationActive && {
        "documentation/openapi": {
          ...((!!this.endPointData?.extra_config?.["documentation/openapi"]) && { "id": this.endPointData?.extra_config?.["documentation/openapi"]?.id }),
          ...(this.formGroupOpenapi.value?.summary && { "summary": this.formGroupOpenapi.value?.summary }),
          ...(this.formGroupOpenapi.value?.description && { "description": this.formGroupOpenapi.value?.description }),
          "example": this.formGroupOpenapi.value?.example ? JSON.parse(this.formGroupOpenapi.value?.example) : null,
          ...(this.formGroupOpenapi.value?.tagsArrayValue?.length != 0 && { "tags": this.formGroupOpenapi.value?.tagsArrayValue }),
          ...(this.formGroupOpenapi.value?.audienceArrayValue?.length != 0 && { "audience": this.formGroupOpenapi.value?.audienceArrayValue })
        }
      }),
    }

    this.endpointService.addOpenApi(this.endpointId, body).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showSuccess(res?.message);
        this.getEndpoint();
      },
      error: (err) => {
        console.error(err);
        this.showError(err?.message);
        this.getEndpoint();
      }
    })

  }
}   
