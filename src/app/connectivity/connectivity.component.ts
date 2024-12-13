import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EndpointService } from '../services/endpoint.service';

@Component({
  selector: 'app-connectivity',
  templateUrl: './connectivity.component.html',
  styleUrl: './connectivity.component.css'
})
export class ConnectivityComponent implements OnInit {

  conCallsToolTip="The concurrent requests are an excellent technique to improve the response times and decrease error rates by requesting in parallel the same information multiple times."
  seqProxyTooltip="Calls backends sequentially instead of in parallel, so you can inject data from a previous call in the url_pattern of the next call. injecting variables like {resp0_XXXX} where 0 is the index of the backend and XXXX the attribute. E.g: {resp1_hotel_id} takes the field hotel_id from the first backend call (index starts at 0)."

  queryParams: any;
  parameterHeader: any;
  formGroup1: FormGroup;
  parameterArray: any = [];
  endpointId: any;
  endPointData:any;

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private endpointService:EndpointService) {
    this.formGroup1 = this.formBuilder.group({
      inputHeader: [null],
      concurrentCalls: [""],
      backoffStrategy: [null],
      readBufferSize: ['', Validators.required],
      writeWait: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      maxRetries: ['', Validators.required],
      messageBufferSize: ['', Validators.required],
      writeBufferSize: ['', Validators.required],
      maxWriteBufferSize: ['', Validators.required],
      pongWait: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      inputHeaderArray: [[]],
      connectEvent: [false],
      disconnectEvent: [false],
      returnErr: [false],
      isWebSocketActive: [false], // Initially false
      isSequencialActive: [false],
    })
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

        if (this.endPointData != undefined) {
          this.parameterArray = this.endPointData?.extra_config?.websocket?.input_headers ?? [] ;
        }
        
        this.formGroup1.patchValue({
          writeBufferSize: this.endPointData?.extra_config?.websocket?.write_buffer_size,
          inputHeader: '',
          concurrentCalls: this.endPointData?.concurrent_calls,
          backoffStrategy: this.endPointData?.extra_config?.websocket?.backoff_strategy,
          readBufferSize: this.endPointData?.extra_config?.websocket?.read_buffer_size,
          writeWait: this.endPointData?.extra_config?.websocket?.write_wait,
          maxRetries: this.endPointData?.extra_config?.websocket?.max_retries,
          messageBufferSize: this.endPointData?.extra_config?.websocket?.message_buffer_size,
          maxWriteBufferSize: this.endPointData?.extra_config?.websocket?.max_message_size,
          pongWait: this.endPointData?.extra_config?.websocket?.pong_wait,
          inputHeaderArray: this.endPointData?.extra_config?.websocket?.input_headers,
          connectEvent: this.endPointData?.extra_config?.websocket?.connect_event,
          disconnectEvent: this.endPointData?.extra_config?.websocket?.disconnect_event,
          returnErr: this.endPointData?.extra_config?.websocket?.return_error_details,
          isWebSocketActive: !!this.endPointData?.extra_config?.websocket,
          isSequencialActive: !!this.endPointData?.extra_config?.proxy?.sequential,
        })
      },
      error:(err)=>{
        console.error(err);
        
      }
    })

  }

  addParameter() {
    const queryParamsValue = this.formGroup1.get('inputHeader')?.value;

    if (queryParamsValue) {
      this.parameterArray.push(queryParamsValue);
      this.formGroup1.get('inputHeaderArray')?.setValue([...this.parameterArray]);
      this.formGroup1.get('inputHeader')?.reset();
    }
  }

  removeParameter(index: number) {
    this.parameterArray.splice(index, 1);
    this.formGroup1.get('inputHeaderArray')?.setValue([...this.parameterArray]);
  }


  submit(){
    const body = {
      "websocketProxy": {
      "proxy": {
        ...((!!this.endPointData?.extra_config?.["proxy"]) && {"id":this.endPointData?.extra_config?.["proxy"]?.id}),
        "sequential": this.formGroup1.value?.isSequencialActive
      },
      ...(this.formGroup1.value?.isWebSocketActive &&{"websocket": {
        ...((!!this.endPointData?.extra_config?.["websocket"]) && {"id":this.endPointData?.extra_config?.["websocket"]?.id}),
        ...(this.formGroup1.value?.inputHeaderArray.length!=0 && {"input_headers": this.formGroup1.value?.inputHeaderArray}),
        ...(this.formGroup1.value?.connectEvent &&{"connect_event": this.formGroup1.value?.connectEvent}),
        ...(this.formGroup1.value?.disconnectEvent &&{"disconnect_event": this.formGroup1.value?.disconnectEvent}),
        ...(this.formGroup1.value?.readBufferSize &&{"read_buffer_size": this.formGroup1.value?.readBufferSize}),
        ...(this.formGroup1.value?.writeBufferSize &&{"write_buffer_size": this.formGroup1.value?.writeBufferSize}),
        ...(this.formGroup1.value?.messageBufferSize &&{"message_buffer_size": this.formGroup1.value?.messageBufferSize}),
        ...(this.formGroup1.value?.maxWriteBufferSize &&{"max_message_size": this.formGroup1.value?.maxWriteBufferSize}),
        ...(this.formGroup1.value?.writeWait &&{"write_wait": this.formGroup1.value?.writeWait}),
        ...(this.formGroup1.value?.pongWait &&{"pong_wait": this.formGroup1.value?.pongWait}),
        // "ping_period": null,
        ...(this.formGroup1.value?.maxRetries &&{"max_retries": this.formGroup1.value?.maxRetries}),
        ...(this.formGroup1.value?.backoffStrategy &&{"backoff_strategy": this.formGroup1.value?.backoffStrategy}),
        // "enable_direct_communication": true,
        ...(this.formGroup1.value?.returnErr &&{"return_error_details": this.formGroup1.value?.returnErr}),
        // "timeout": null
      }}),
      "concurrent_calls": this.formGroup1.value?.concurrentCalls
    }
    }

    console.log(body);

    this.endpointService.addConnectivity(this.endpointId,body).subscribe({
      next:(res)=>{
      console.log(res);
      }
    })
    
  }



}
