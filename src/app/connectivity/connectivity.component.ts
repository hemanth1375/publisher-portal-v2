import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EndpointService } from '../services/endpoint.service';
import { ToastService } from '../services/toast.service';
import { max } from 'rxjs';

@Component({
  selector: 'app-connectivity',
  templateUrl: './connectivity.component.html',
  styleUrl: './connectivity.component.css'
})
export class ConnectivityComponent implements OnInit {

  websocketsToolTip = "Communications using the WebSocket Protocol (RFC-6455) to enable two-way communication between a client to a backend host through the API gateway."
  concurrentCallsToolTip = "Number of parallel requests you want to send to the backend for the same request. Fastest request is taken and the rest are discarded. Recommended values 1-3 "
  connectEventToolTip = "Notifies in the log when there is the client connect event"
  backoffStrategyToolTip = "When the connection to your event source gets interrupted for whatever reason, KrakenD keeps trying to reconnect until it succeeds or until it reaches the max_retries. The backoff strategy  defines the delay in seconds in between consecutive failed retries"
  readBufferSizeToolTip = "Connections buffer network input and output to reduce the number of system calls when reading messages. You can set the maximum buffer size for reading (in bytes)."
  messageBufferSizeToolTip = "Sets the maximum buffer size for messages (in bytes)."
  writeWaitToolTip = "Sets the maximum time KrakenD will wait until the write times out. "
  maxRetriesActiveToolTip = "The maximum number of times you will allow KrakenD to retry reconnecting to a broken messaging system. Use a value h3= 0 for unlimited retries."
  inputHeaderToolTip = ">Defines which input headers are allowed to pass to the   backend.  Leave * for all headers declared  "
  writeBufferSizeToolTip = "Connections buffer network input and output to reduce the  number of system calls when writing messages. You can set the maximum buffer size for writing in bytes."
  maxWriteBufferSizeToolTip = "Sets the maximum size of client messages (in bytes)."
  pongWaitToolTip = "Sets the maximum time KrakenD will wait until the pong times out."
  returnErrToolTip = "Provides an error &#123,error:reason here &#125; to the client when KrakenD was unable to send the message to the backend"
  disconnectEventToolTip = "Notifies in the log when there is a client disconnect event"

  conCallsToolTip = "The concurrent requests are an excellent technique to improve the response times and decrease error rates by requesting in parallel the same information multiple times."
  seqProxyTooltip = "Calls backends sequentially instead of in parallel, so you can inject data from a previous call in the url_pattern of the next call. injecting variables like {resp0_XXXX} where 0 is the index of the backend and XXXX the attribute. E.g: {resp1_hotel_id} takes the field hotel_id from the first backend call (index starts at 0)."

  queryParams: any;
  parameterHeader: any;
  formGroup1: FormGroup;
  parameterArray: any = [];
  endpointId: any;
  endPointData: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private endpointService: EndpointService, private toastService: ToastService) {
    this.formGroup1 = this.formBuilder.group({
      inputHeader: [null],
      concurrentCalls: [[1], [Validators.min(1), Validators.max(5)]],
      backoffStrategy: [null],
      readBufferSize: [''],
      writeWait: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      maxRetries: [''],
      messageBufferSize: [''],
      writeBufferSize: [''],
      maxWriteBufferSize: [''],
      pongWait: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      inputHeaderArray: [[[]]],
      connectEvent: [false],
      disconnectEvent: [false],
      returnErr: [false],
      isWebSocketActive: [false], // Initially false
      isSequencialActive: [false],
    })
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

        if (this.endPointData != undefined) {
          this.parameterArray = this.endPointData?.extra_config?.websocket?.input_headers ?? [];
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
      error: (err) => {
        console.error(err);
        this.showError(err?.message)
      }
    })
  }

  ngOnInit(): void {

    this.formGroup1.valueChanges.subscribe(value => {
      console.log(value);
    });

    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });


    this.getEndpoint();


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

  successMessage: string = '';
  errorMessage: string = '';
  
  showSuccessAlert(message: string) {
    this.successMessage = message;
    this.errorMessage = ''; // Clear any previous error message
    setTimeout(() => {
      this.successMessage = ''; // Clear success message after 5 seconds
    }, 5000);
  }

  showErrorAlert(message: string) {
    this.errorMessage = message;
    this.successMessage = ''; // Clear any previous success message
    setTimeout(() => {
      this.errorMessage = ''; // Clear error message after 5 seconds
    }, 5000);
  }


  submit() {
    const body = {
      "websocketProxy": {
        "proxy": {
          ...((!!this.endPointData?.extra_config?.["proxy"]) && { "id": this.endPointData?.extra_config?.["proxy"]?.id }),
          "sequential": this.formGroup1.value?.isSequencialActive
        },
        ...(this.formGroup1.value?.isWebSocketActive && {
          "websocket": {
            ...((!!this.endPointData?.extra_config?.["websocket"]) && { "id": this.endPointData?.extra_config?.["websocket"]?.id }),
            ...(this.formGroup1.value?.inputHeaderArray?.length != 0 && { "input_headers": this.formGroup1.value?.inputHeaderArray }),
            ...(this.formGroup1.value?.connectEvent && { "connect_event": this.formGroup1.value?.connectEvent }),
            ...(this.formGroup1.value?.disconnectEvent && { "disconnect_event": this.formGroup1.value?.disconnectEvent }),
            ...(this.formGroup1.value?.readBufferSize && { "read_buffer_size": this.formGroup1.value?.readBufferSize }),
            ...(this.formGroup1.value?.writeBufferSize && { "write_buffer_size": this.formGroup1.value?.writeBufferSize }),
            ...(this.formGroup1.value?.messageBufferSize && { "message_buffer_size": this.formGroup1.value?.messageBufferSize }),
            ...(this.formGroup1.value?.maxWriteBufferSize && { "max_message_size": this.formGroup1.value?.maxWriteBufferSize }),
            ...(this.formGroup1.value?.writeWait && { "write_wait": this.formGroup1.value?.writeWait }),
            ...(this.formGroup1.value?.pongWait && { "pong_wait": this.formGroup1.value?.pongWait }),
            // "ping_period": null,
            ...(this.formGroup1.value?.maxRetries && { "max_retries": this.formGroup1.value?.maxRetries }),
            ...(this.formGroup1.value?.backoffStrategy && { "backoff_strategy": this.formGroup1.value?.backoffStrategy }),
            // "enable_direct_communication": true,
            "return_error_details": this.formGroup1.value?.returnErr,
            // "timeout": null
          }
        }),
      },
      "concurrent_calls": this.formGroup1.value?.concurrentCalls
    }

    console.log(body);

    if (this.formGroup1.valid) {
      this.endpointService.addConnectivity(this.endpointId, body).subscribe({
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
    }else{
      console.log(this.formGroup1.errors);
      
      this.showErrorAlert(" Please fill the required fields or fill them properly");
    }


  }



}
