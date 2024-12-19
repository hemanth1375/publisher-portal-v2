import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EndpointService } from '../services/endpoint.service';
import { ToastService } from '../services/toast.service';
import { CustomValidators } from '../shared/validators/custom-validators';



@Component({
  selector: 'app-response-manipulation',
  templateUrl: './response-manipulation.component.html',
  styleUrl: './response-manipulation.component.css'
})
export class ResponseManipulationComponent implements OnInit {


  responseToolTip = "Provide the JSON object you want to return (ensure to start and end with curly braces)."
  expressionToolTip = "JMESpath query to execute on returned results of  /v1/huge-fountain/&#123;id_fountain&#125;"
  serverResponseToolTip = "Example of how JMESpath works"
  regexConReplacerActiveToolTip = "The find expression or literal you want to use"
  exampleFormControlTextarea1ToolTip = "The response body you will return to the end-user. You can introduce the variables .resp_headers.xxx, .resp_headers.xxx (with no-op), .resp_status.xxx (with no-op), .resp_body.xxx, .req_params.Xxx, .req_headers.xxx, .req_querystring.xxx, .req_path"
  conTypeToolTip = "The Content-Type that you are coding in the template. Defaults to application/json"
  debugToolTip = "shows useful information in the logs with DEBUG level about the input received and the body generated. Do not enable in production."
  pathToolTip = "The Content-Type that you are coding in the template. Defaults to application/json"





  staticResTooltip = "When the backend fails you can still return the static data provided below to the user. The data is merged with any existing partial responses. If you still don't have a backend and want to have this data, add a fake one that cannot be resolved."
  resJson = "Provide the JSON object you want to return (ensure to start and end with curly braces {})";

  AdvResMani = "Manipulate the response dataset after the aggregation layer using a JSON Query language.";
  exp = "JMESpath query to execute on returned results of /v1/batwing-touch/{id_touch}";

  regexCon = "The content replacer plugin allows you to modify the response of your services by doing literal replacements or more sophisticated replacements with regular expressions.";
  keyToRep = "Write the key of the object you would like to replace content."
  find = "The find expression or literal you want to use.";
  replace = "The literal string or expression you want to use as a replacement. You can use capture groups with $1, $2, etc.";

  regex = "Check if you want to use regular expression instead of a literal string (faster)";

  bodyEditor = "The response body you will return to the end-user. You can introduce the variables .resp_headers.xxx, .resp_headers.xxx (with no-op), .resp_status.xxx (with no-op), .resp_body.xxx, .req_params.Xxx, .req_headers.xxx, .req_querystring.xxx, .req_path"
  contentType = "The Content-Type that you are coding in the template. Defaults to application/json";
  enableDebug = "shows useful information in the logs with DEBUG level about the input received and the body generated. Do not enable in production.";
  path = "You can load the response from an external file instead of editing the template.";


  isKeyCreated: boolean = false;

  formGroupResponseManipulation: FormGroup;

  endpointId: any;
  endPointData: any;

  jsonData = {
    "students": [
      { "name": "Bill", "age": 23 },
      { "name": "Mary", "age": 16 },
      { "name": "Jessica", "age": 19 }
    ]
  };

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private endpointService: EndpointService, private toastService: ToastService) {
    this.formGroupResponseManipulation = this.formBuilder.group({
      // response: [null, [this.jsonValidator()]],
      response: [null, [CustomValidators.jsonValidator()]],
      strategy: [null],
      expression: [null],

      contentReplacerKey: [''],
      contentReplacer: this.formBuilder.group({}),
      regexConReplacerActive: [false],

      isStaticResponseActive: [false],
      isAdvanceResponseActive: [false],

      isAdvanceResponseGoActive: [false],

      bodyEditor: ['bodyeditor'],
      template: ['', [CustomValidators.jsonValidator()]],
      contentType: [''],
      debug: [false],
      path: [''],
    })
  }


  jsonValidator() {
    return (control: any) => {
      if (!control.value) {
        return null; // No value, validation is not applied
      }
      try {
        JSON.parse(control.value); // Attempt to parse JSON
        return null; // Valid JSON
      } catch (e) {
        return { invalidJson: true }; // Invalid JSON
      }
    };
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
        console.log(res)
        this.endPointData = res;
        console.log(this.endPointData);

        this.formGroupResponseManipulation.patchValue({
          response: JSON.stringify(this.endPointData?.extra_config?.proxy?.static?.data, null, 2),
          strategy: this.endPointData?.extra_config?.proxy?.static?.strategy,

          expression: this.endPointData?.extra_config?.["modifier/jmespath"]?.expr,

          contentReplacer: this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["content-replacer"],
          regexConReplacerActive: !!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.name.includes("content-replacer"),

          isStaticResponseActive: !!this.endPointData?.extra_config?.["proxy"]?.["static"],
          isAdvanceResponseActive: !!this.endPointData?.extra_config?.["modifier/jmespath"],

          isAdvanceResponseGoActive: !!this.endPointData?.extra_config?.["modifier/response-body-generator"],

          template: JSON.stringify(this.endPointData?.extra_config?.["modifier/response-body-generator"]?.template, null, 2),
          contentType: this.endPointData?.extra_config?.["modifier/response-body-generator"]?.content_type,
          debug: this.endPointData?.extra_config?.["modifier/response-body-generator"]?.debug,
          path: this.endPointData?.extra_config?.["modifier/response-body-generator"]?.path
        });

        const obj = this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["content-replacer"];

        const contentep = Object.keys(obj);

        if (contentep.length != 0) {
          this.formGroupResponseManipulation.get("contentReplacerKey")?.setValue(contentep[0]);
          console.log(this.formGroupResponseManipulation.get("contentReplacerKey")?.value);
          this.createContentReplacerKeyWithValues();
        }



      },
      error: (err) => {
        console.error(err);
        this.showError(err?.message)
      }
    })
  }

  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });

    this.formGroupResponseManipulation.get('bodyEditor')?.valueChanges.subscribe((value) => {
      const bodyEditorControl = this.formGroupResponseManipulation.get('template');
      const pathControl = this.formGroupResponseManipulation.get('path');

      if (value === 'bodyeditor') {
        bodyEditorControl?.enable();
        pathControl?.disable();

      } else if (value === 'external') {
        bodyEditorControl?.disable();
        pathControl?.enable();
      }
    })

    this.getEndpoint();


  }

  createContentReplacerKey() {
    if (this.formGroupResponseManipulation.get('contentReplacerKey')?.value) {
      const contentReplacerGroup = this.formGroupResponseManipulation.get('contentReplacer') as FormGroup;

      // Create a new FormGroup with find, replace, and regexp
      const nestedFormGroup = this.formBuilder.group({
        find: [''],    // Default empty value for find
        replace: [''], // Default empty value for replace
        regexp: [false] // Default checkbox unchecked
      });

      // Add the new group to contentReplacer with the entered key
      contentReplacerGroup.addControl(this.formGroupResponseManipulation.get('contentReplacerKey')?.value, nestedFormGroup);

      // Reset the key input and set flag to show nested controls
      this.isKeyCreated = true;
    }
  }


  createContentReplacerKeyWithValues() {

    if (this.formGroupResponseManipulation.get('contentReplacerKey')?.value) {
      const contentReplacerGroup = this.formGroupResponseManipulation.get('contentReplacer') as FormGroup;


      const obj = this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["content-replacer"];

      const contentep = Object.keys(obj);

      console.log(contentep[0])

      console.log(obj[contentep[0]].find);

      // Create a new FormGroup with find, replace, and regexp
      const nestedFormGroup = this.formBuilder.group({
        find: [obj[contentep[0]].find],    // Default empty value for find
        replace: [obj[contentep[0]].replace], // Default empty value for replace
        regexp: [obj[contentep[0]].regexp] // Default checkbox unchecked
      });

      // Add the new group to contentReplacer with the entered key
      contentReplacerGroup.addControl(this.formGroupResponseManipulation.get('contentReplacerKey')?.value, nestedFormGroup);

      // Reset the key input and set flag to show nested controls
      this.isKeyCreated = true;
    }
  }

  resetFields() {
    const key = this.formGroupResponseManipulation.get('contentReplacerKey')?.value;
    if (key) {
      const contentReplacerGroup = this.formGroupResponseManipulation.get('contentReplacer') as FormGroup;
      contentReplacerGroup.removeControl(key);
      this.formGroupResponseManipulation.get('contentReplacerKey')?.reset();
      this.isKeyCreated = false;
    }
  }

  submit() {

    if (this.formGroupResponseManipulation.valid) {
      console.log(this.formGroupResponseManipulation.value);

      const body = {
        "proxy": {
          ...((!!this.endPointData?.extra_config?.["proxy"]) && { "id": this.endPointData?.extra_config?.["proxy"]?.id }),
          ...(this.formGroupResponseManipulation.value?.isStaticResponseActive && {
            "static": {
              ...((!!this.endPointData?.extra_config?.["proxy"]?.static) && { "id": this.endPointData?.extra_config?.["proxy"]?.static.id }),
              "data": this.formGroupResponseManipulation.value?.response ? JSON.parse(this.formGroupResponseManipulation.value?.response) : null,
              "strategy": this.formGroupResponseManipulation.value?.strategy
            }
          })
        },

        ...(this.formGroupResponseManipulation.value?.isAdvanceResponseActive && {
          "modifier/jmespath": {
            ...((!!this.endPointData?.extra_config?.["modifier/jmespath"]) && { "id": this.endPointData?.extra_config?.["modifier/jmespath"]?.id }),
            // "@comment": null,
            "expr": this.formGroupResponseManipulation.value?.expression
          }
        }),

        ...(this.formGroupResponseManipulation.value?.isAdvanceResponseGoActive && {
          "modifier/response-body-generator": {
            ...((!!this.endPointData?.extra_config?.["modifier/response-body-generator"]) && { "id": this.endPointData?.extra_config?.["modifier/response-body-generator"]?.id }),
            ...(this.formGroupResponseManipulation.value?.bodyEditor === "bodyeditor" && { "template": this.formGroupResponseManipulation.value?.template ? JSON.parse(this.formGroupResponseManipulation.value?.template) : null }),
            "content_type": this.formGroupResponseManipulation.value?.contentType,
            "debug": this.formGroupResponseManipulation.value?.debug,
            ...(this.formGroupResponseManipulation.value?.bodyEditor === "external" && { "path": this.formGroupResponseManipulation.value?.path }),

          }
        }),

        ...((this.formGroupResponseManipulation.value?.regexConReplacerActive) && {
          "plugin/req-resp-modifier": {
            ...((!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]) && { "id": this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.id }),
            "name": [
              this.formGroupResponseManipulation.value?.regexConReplacerActive && "content-replacer"
            ].filter(Boolean),
            ...(this.formGroupResponseManipulation.value?.regexConReplacerActive && { "content-replacer": this.formGroupResponseManipulation.value?.contentReplacer }),
          }
        })

      }

      console.log(body);

      this.endpointService.addResponse(this.endpointId, body).subscribe({
        next: (res: any) => {
          console.log(res)
          this.showSuccess(res?.message);
          this.getEndpoint()
        },
        error: (err) => {
          console.error(err);
          this.showError(err?.message);
          this.getEndpoint()
        }
      })

    } else {
      console.error('Form Invalid:', this.formGroupResponseManipulation.errors);
    }

  }

}
