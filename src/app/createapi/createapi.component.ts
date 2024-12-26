import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { EndpointService } from '../services/endpoint.service';

@Component({
  selector: 'app-createapi',
  templateUrl: './createapi.component.html',
  styleUrl: './createapi.component.css'
})
export class CreateapiComponent implements OnInit {


  formGroupEndPoint: FormGroup;
  receivedData: any;


  constructor(private formBuilder: FormBuilder,private mainService:MainService,private router:Router,private communicationSer:CommunicationService, private endpointSer:EndpointService) {
    this.formGroupEndPoint = this.formBuilder.group({
      apiName: [null],
      endpoint: [null, [Validators.required]],
      method: [null],
      output_encoding: [null],
      host: [null],
      backendMethod: [null],
      encoding: [null],
      url_pattern: [null],
      is_collection:[false]
    })
  }

  contextPathError: boolean = false;
  errorMessage: string = '';
  resetError(): void {
    this.contextPathError = false;
    this.errorMessage = '';
  }
  ngOnInit(){
    this.formGroupEndPoint.get('endpoint')?.valueChanges
      .pipe(
        debounceTime(500), // Debounce to reduce API calls
        switchMap(value => {
          if (!value.trim()) {
            this.resetError(); // Reset error if input is empty
            return of(null); // Return a null observable to skip the API call
          }
          return this.endpointSer.checkContextPath(value);
        }),
        catchError(() => {
          this.resetError(); // Reset error on API failure
          return of(null); // Handle error gracefully
        })
      )
      .subscribe((response:any) => {
        if (response && response.code === 208) {
          this.contextPathError = true;
          this.errorMessage = response.message; // Display the error message
        } else {
          this.resetError(); // Reset if no error
        }
      });
    // this.formGroupEndPoint.get('endpoint')?.valueChanges
    // .pipe(
    //   debounceTime(500), // Delay to avoid making too many requests
    //   switchMap(value => 
    //     this.endpointSer.checkContextPath(value).pipe(
    //       catchError(() => {
    //         this.contextPathError = false; // Reset error on API failure
    //         return of(null); // Handle error gracefully
    //       })
    //     )
    //   )
    // )
    // .subscribe((exists: any) => {
    //   this.contextPathError = !!exists; // Show error if path exists
    // });
  }

  submitForm() {
    // console.log(this.formGroupEndPoint.get("apiName")?.value);
    if (this.formGroupEndPoint.valid) {
      console.log(this.formGroupEndPoint.value);
      const createApiBody = {
        "apiName": this.formGroupEndPoint.get("apiName")?.value,
        "endpoint": this.formGroupEndPoint.get("endpoint")?.value,
        "method": this.formGroupEndPoint.get("method")?.value,
        "output_encoding": this.formGroupEndPoint.get("output_encoding")?.value,
        "backend": [
          {
            "method": this.formGroupEndPoint.get("backendMethod")?.value,
            "url_pattern": this.formGroupEndPoint.get("url_pattern")?.value,
            "encoding": this.formGroupEndPoint.get("encoding")?.value,
            "host": [
              this.formGroupEndPoint.get("host")?.value
            ],
            "is_collection": this.formGroupEndPoint?.get("is_collection")?.value,

          }
        ]

      }
      console.log(createApiBody);
      this.mainService.createEndpoint(createApiBody).subscribe({
        next:(res =>{
            console.log(res);
            this.communicationSer.emitApiCreated(res)
            this.router.navigate(['apis'],{ replaceUrl: true })
        }),
        error:(err=>{

        })
      })


    }
  }

}
