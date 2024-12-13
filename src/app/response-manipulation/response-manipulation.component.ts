import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EndpointService } from '../services/endpoint.service';


@Component({
  selector: 'app-response-manipulation',
  templateUrl: './response-manipulation.component.html',
  styleUrl: './response-manipulation.component.css'
})
export class ResponseManipulationComponent implements OnInit{

  staticresTooltip="When the backend fails you can still return the static data provided below to the user. The data is merged with any existing partial responses. If you still don't have a backend and want to have this data, add a fake one that cannot be resolved."

  isKeyCreated: boolean = false;

  formGroupResponseManipulation: FormGroup;

  endpointId: any;
  endPointData:any;

  jsonData = {
    "students": [
      { "name": "Bill", "age": 23 },
      { "name": "Mary", "age": 16 },
      { "name": "Jessica", "age": 19 }
    ]
  };

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private endpointService:EndpointService ) {
    this.formGroupResponseManipulation = this.formBuilder.group({
      response: [null],
      strategy: [null],
      expression: [null],

      contentReplacerKey: [''],
      contentReplacer: this.formBuilder.group({}),
      regexConReplacerActive: [false],

      isStaticResponseActive: [false],
      isAdvanceResponseActive: [false],

      isAdvanceResponseGoActive: [false],

      bodyEditor: ['bodyeditor'],
      template: [''],
      contentType: [''],
      debug: [false],
      path: [''],
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

    this.endpointService.getEndpointById(this.endpointId).subscribe({
      next: (res) => {
        console.log(res)
        this.endPointData=res;
        console.log(this.endPointData);

        this.formGroupResponseManipulation.patchValue({
          response: JSON.stringify(this.endPointData?.extra_config?.proxy?.static?.data, null, 2),
          strategy: this.endPointData?.extra_config?.proxy?.static?.strategy,
          
          expression: this.endPointData?.extra_config?.["modifier/jmespath"]?.expr,

          contentReplacer: this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["content-replacer"],
          regexConReplacerActive:!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.name.includes("content-replacer"),
    
          isStaticResponseActive: !!this.endPointData?.extra_config?.["proxy"]?.["static"],
          isAdvanceResponseActive: !!this.endPointData?.extra_config?.["modifier/jmespath"],
         
          isAdvanceResponseGoActive: !!this.endPointData?.extra_config?.["modifier/response-body-generator"],
  
          template: JSON.stringify(this.endPointData?.extra_config?.["modifier/response-body-generator"]?.template , null, 2),
          contentType:this.endPointData?.extra_config?.["modifier/response-body-generator"]?.content_type,
          debug:this.endPointData?.extra_config?.["modifier/response-body-generator"]?.debug,
          path:this.endPointData?.extra_config?.["modifier/response-body-generator"]?.path
        });
      }
    })


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

  resetFields() {
    const key = this.formGroupResponseManipulation.get('contentReplacerKey')?.value;
    if (key) {
      const contentReplacerGroup = this.formGroupResponseManipulation.get('contentReplacer') as FormGroup;
      contentReplacerGroup.removeControl(key);
      this.formGroupResponseManipulation.get('contentReplacerKey')?.reset();
      this.isKeyCreated = false;
    }
  }

  submit(){

    console.log(this.formGroupResponseManipulation.value);

    const body = {
      "proxy": {
        ...((!!this.endPointData?.extra_config?.["proxy"]) && {"id":this.endPointData?.extra_config?.["proxy"]?.id}),
        ...(this.formGroupResponseManipulation.value?.isStaticResponseActive && {
          "static": {
            ...((!!this.endPointData?.extra_config?.["proxy"]?.static) && {"id":this.endPointData?.extra_config?.["proxy"]?.static.id}),
            "data": this.formGroupResponseManipulation.value?.response ? JSON.parse(this.formGroupResponseManipulation.value?.response) :null ,
            "strategy": this.formGroupResponseManipulation.value?.strategy
          }
        })
      },

      ...(this.formGroupResponseManipulation.value?.isAdvanceResponseActive && {
        "modifier/jmespath": {
          ...((!!this.endPointData?.extra_config?.["modifier/jmespath"]) && {"id":this.endPointData?.extra_config?.["modifier/jmespath"]?.id}),
          // "@comment": null,
          "expr": this.formGroupResponseManipulation.value?.expression
        }
      }),

      ...(this.formGroupResponseManipulation.value?.isAdvanceResponseGoActive && {
        "modifier/response-body-generator": {
        ...((!!this.endPointData?.extra_config?.["modifier/response-body-generator"]) && {"id":this.endPointData?.extra_config?.["modifier/response-body-generator"]?.id}),
          ...(this.formGroupResponseManipulation.value?.bodyEditor ==="bodyeditor" && {"template": this.formGroupResponseManipulation.value?.template ? JSON.parse(this.formGroupResponseManipulation.value?.template) : null}),
          "content_type": this.formGroupResponseManipulation.value?.contentType,
          "debug": this.formGroupResponseManipulation.value?.debug,
          ...(this.formGroupResponseManipulation.value?.bodyEditor ==="external" && {"path": this.formGroupResponseManipulation.value?.path}),

        }
      }),

      ...((this.formGroupResponseManipulation.value?.regexConReplacerActive) &&{"plugin/req-resp-modifier": {
        ...((!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]) && {"id":this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.id}),
        "name": [
          this.formGroupResponseManipulation.value?.regexConReplacerActive && "content-replacer"
        ].filter(Boolean),
        ...(this.formGroupResponseManipulation.value?.regexConReplacerActive &&{"content-replacer": this.formGroupResponseManipulation.value?.contentReplacer}),
      }})

    }    

    console.log(body);

    this.endpointService.addResponse(this.endpointId, body).subscribe({
      next:(res)=>{
        console.log(res)
      },
      error:(err)=>{
        console.error(err)
      }
    })
    
    
  }

}
