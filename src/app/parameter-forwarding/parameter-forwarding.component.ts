import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-parameter-forwarding',
  templateUrl: './parameter-forwarding.component.html',
  styleUrl: './parameter-forwarding.component.css'
})
export class ParameterForwardingComponent {
  query_tooltip = "Query string parameters to be passed to the backends when present. Write only the name of the parameter, no question mark or equal symbols.";
  header_tooltip = "Headers sent by the user that will reach your backend (e.g.: Content-Type). Add a single * to forward all headers (not recommended, security concerns)"

  parameterForm: FormGroup;

  parameterArray: any = [];
  parameterHeaderArray: any = [];


  constructor(private fb: FormBuilder) {
    this.parameterForm = this.fb.group({
      input_parameter: [],
      input_header: [],
      input_query_strings: [[]],
      input_headers: [[]]
    })
  }

 
  addParameter() {
    const queryParamsValue = this.parameterForm.get('input_parameter')?.value;

    if (queryParamsValue) {
      this.parameterArray.push(queryParamsValue);
      this.updateParametersArray();
      this.parameterForm.get('input_parameter')?.reset();
    }
  }

  removeParameter(index: number) {
    this.parameterArray.splice(index, 1);
    this.updateParametersArray();
  }

  addParameterHeader() {
    const queryParamsValue = this.parameterForm.get('input_header')?.value;

    if (queryParamsValue) {
      this.parameterHeaderArray.push(queryParamsValue);
      this.updateParametersHeaderArray();
      this.parameterForm.get('input_header')?.reset();
    }
  }

  removeParameterHeader(index: number) {
    this.parameterHeaderArray.splice(index, 1);
    this.updateParametersHeaderArray();
  }

  updateParametersArray() {
    this.parameterForm.get('input_query_strings')?.setValue([...this.parameterArray]);
  }

  updateParametersHeaderArray() {
    this.parameterForm.get('input_headers')?.setValue([...this.parameterHeaderArray]);
  }


  submit() {
    console.log(this.parameterForm.value.queryParams);
  }
}   
