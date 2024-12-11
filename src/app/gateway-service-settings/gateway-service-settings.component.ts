import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gateway-service-settings',
  templateUrl: './gateway-service-settings.component.html',
  styleUrl: './gateway-service-settings.component.css'
})
export class GatewayServiceSettingsComponent {

  formGroupService: FormGroup;
  objectMap: Map<string, string> = new Map();
  regExpObjectMap: Map<string, string> = new Map();

  @Input() formData: any;
  @Output() serviceSettingsFormSubmitted = new EventEmitter<any>();


  constructor(private formBuilder: FormBuilder) {
    this.formGroupService = this.formBuilder.group({
      isgRPCActive: [false], 
      isEnableHttpsActive: [false],
      isUrlRewriteActive: [false],
      isVirtualHostActive: [false],
      isGeoIpActive: [false],
      isStaticServerActive: [false],
      isRateLimitingActive: [false],
      isHttpClientSetAdv: [false],
      isJwkSharedActive: [false],
      name: [null, [Validators.required]],
      port: [null, [Validators.required]],
      host: [null],
      hostArrayValue: [[]],
      directory: [],
      directoryArrayValue: [[]],
      virtualHost: [],
      virtualHostArrayValue: [[]],
      backendTimeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      defaultCache: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      disablegZip: [true],
      httpReadTimeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      httpWriteTimeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      httpIdleTimeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      httpReadHeaderTimeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      defaultOutputEncoding: [null],
      nonRestfulResource: [null],
      serverSequential: [null],
      enableDebugOptions: [null],
      sharedCacheDuration: [null],
      privateKey: [null],
      publicKey: [null],
      literalReplacement: [null],
      literalMatch: [null],
      regexpMatch: [null],
      endpointReplacement: [null],
      databasePath: [null],
      staticServerPath: [null],
      staticServerPrefix: [null],
      directoryList: [true],
      rateLimit: [null],
      every: [null],
      capacity: [null],
      defaultUserQuota: [null],
      clientCapacity: [null],
      httpClientSetAdvConnTimeoutForm: [null, Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      httpClientSetAdvHeaderTimeoutForm: [null, Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      httpClientSetAdvContinueTimeoutForm: [null, Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      httpClientSetAdvMaxIdleConnForm: [0],
      httpClientSetAdvMaxIdleConnPerHostForm: [250],
      httpClientSetAdvAllowInsecureConnsForm: [null],
      httpClientSetAdvDisableKeepAlivesForm: [null],
      httpClientSetAdvDisableCompressionForm: [null],
      httpClientSetAdvDialerTimeoutForm: [null, Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      httpClientSetAdvDialerFallerDelayForm: [null, Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      httpClientSetAdvDialerKeepAliveForm: [null, Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],

      literalMatchObjectMapValue: [[]],
      regExpMatchObjectMapValue: [[]],
      uniqueStrategy: [null],
      headerValue: [null],
      grpcId:[null]
    })
  }

  onToggleChangeJwk() {
    const isActive = this.formGroupService.value.isJwkSharedActive;
    const sharedCacheDur = this.formGroupService.get('sharedCacheDuration');

    if (isActive) {
      sharedCacheDur?.setValidators([Validators.required]); // Add required validator
    } else {
      sharedCacheDur?.clearValidators(); // Clear all validators
      sharedCacheDur?.setValue(''); // Optionally reset the field
    }

    sharedCacheDur?.updateValueAndValidity(); // Update validation state
    console.log('Validation updated. Current validators:', sharedCacheDur?.validator);
  }
  onToggleChangeRateLimit() {

    const isActive = this.formGroupService.value.isRateLimitingActive;
    const rateLim = this.formGroupService.get('rateLimit');
    const cap = this.formGroupService.get('capacity');
    const defUserQuota = this.formGroupService.get('defaultUserQuota');
    const ccap = this.formGroupService.get('clientCapacity');




    if (isActive) {
      rateLim?.setValidators([Validators.required]); // Add required validator
      cap?.setValidators([Validators.required]); // Add required validator
      defUserQuota?.setValidators([Validators.required]); // Add required validator
      ccap?.setValidators([Validators.required]); // Add required validator




    } else {
      rateLim?.clearValidators(); // Clear all validators
      rateLim?.setValue(''); // Optionally reset the field
      cap?.clearValidators(); // Clear all validators
      cap?.setValue(''); // Optionally reset the field
      defUserQuota?.clearValidators(); // Clear all validators
      defUserQuota?.setValue(''); // Optionally reset the field
      ccap?.clearValidators(); // Clear all validators
      ccap?.setValue(''); // Optionally reset the field
    }

    rateLim?.updateValueAndValidity(); // Update validation state
    cap?.updateValueAndValidity(); // Update validation state
    defUserQuota?.updateValueAndValidity(); // Update validation state
    ccap?.updateValueAndValidity(); // Update validation state



    console.log('Validation updated. Current validators:', rateLim?.validator);
    console.log('Validation updated. Current validators:', cap?.validator);
    console.log('Validation updated. Current validators:', defUserQuota?.validator);
    console.log('Validation updated. Current validators:', ccap?.validator);



  }

  onToggleChangeStaticResponse(event: any, id: any) {
    console.log('id', id);
    (this as any)[id] = event.checked;
  }
  hostArray: any = [];
  directoryArray: any = [];
  virtualHostArray: any = [];

  updateMapControl() {
    // Convert Map to array of key-value pairs
    const mapArray = Array.from(this.objectMap.entries());
    this.formGroupService.get('literalMatchObjectMapValue')?.setValue(mapArray);
  }

  addToMap(key: any, value: string) {
    this.objectMap.set(key, value);
    this.updateMapControl();  // Sync form control with updated Map
  }

  removeFromMap(key: any) {
    this.objectMap.delete(key);
    this.updateMapControl();  // Sync form control with updated Map
  }

  // regexp add
  updateMapControlRegExp() {
    // Convert Map to array of key-value pairs
    const mapArray = Array.from(this.regExpObjectMap.entries());
    this.formGroupService.get('regExpMatchObjectMapValue')?.setValue(mapArray);
  }

  addToMapRegExp(key: any, value: string) {
    this.regExpObjectMap.set(key, value);
    this.updateMapControlRegExp();  // Sync form control with updated Map
  }

  removeFromMapRegExp(key: any) {
    this.regExpObjectMap.delete(key);
    this.updateMapControlRegExp();  // Sync form control with updated Map
  }

  addParameter(fieldName: 'host' | 'directory' | 'virtualHost' | 'literalMatch' | 'regExpMatch') {
    const fieldValue = this.formGroupService.get(fieldName)?.value;

    if (fieldName) {
      if (fieldName === 'host') {
        this.hostArray.push(fieldValue);
        this.formGroupService.get('hostArrayValue')?.setValue([...this.hostArray]);
      }
      else if (fieldName === 'directory') {
        this.directoryArray.push(fieldValue);
        this.formGroupService.get('directoryArrayValue')?.setValue([...this.directoryArray]);
      } else if (fieldName === 'virtualHost') {
        this.virtualHostArray.push(fieldValue);
        this.formGroupService.get('virtualHostArrayValue')?.setValue([...this.virtualHostArray]);
      } else if (fieldName === 'literalMatch') {
        const originalObject = this.formGroupService.get('literalMatch')?.value;
        const renamedObject = this.formGroupService.get('literalReplacement')?.value;

        if (originalObject && renamedObject) {
          this.addToMap(originalObject, renamedObject)
        }
      } else if (fieldName === 'regExpMatch') {
        const originalObject = this.formGroupService.get('regexpMatch')?.value;
        const renamedObject = this.formGroupService.get('endpointReplacement')?.value;

        if (originalObject && renamedObject) {
          this.addToMapRegExp(originalObject, renamedObject)
        }
      }
      this.formGroupService.get('literalMatch')?.reset();
      this.formGroupService.get('literalReplacement')?.reset();
      this.formGroupService.get('regexpMatch')?.reset();
      this.formGroupService.get('endpointReplacement')?.reset();
      this.formGroupService.get(fieldName)?.reset();
    }
  }

  removeParameter(index: any, fieldName: 'host' | 'directory' | 'virtualHost' | 'literalMatch' | 'regExpMatch') {
    if (fieldName === "host") {
      this.hostArray.splice(index, 1);
      this.formGroupService.get('hostArrayValue')?.setValue([...this.hostArray]);
    }
    else if (fieldName === "directory") {
      this.directoryArray.splice(index, 1);
      this.formGroupService.get('directoryArrayValue')?.setValue([...this.directoryArray]);
    }
    else if (fieldName === 'virtualHost') {
      this.virtualHostArray.splice(index, 1);
      this.formGroupService.get('virtualHostArrayValue')?.setValue([...this.virtualHostArray]);
    } else if (fieldName === 'literalMatch') {
      this.removeFromMap(index);
    } else if (fieldName === 'regExpMatch') {
      this.removeFromMapRegExp(index);
    }

  }

  apiData: any;
  entireJsondata: any;
  ngOnInit() {

    this.formGroupService.get('uniqueStrategy')?.valueChanges.subscribe((value) => {
      if (value === 'ip') {
        this.formGroupService.get('headerValue')?.reset();
      }
    });
    // this.sharedService.getEntireJsonData$().subscribe((data:any) => {
    //   this.entireJsondata = data;

    // })
    console.log(this.entireJsondata);
    console.log(this.entireJsondata?.extra_config?.["server/static-filesystem"]?.prefix);
    if (this.entireJsondata != undefined) {
      this.hostArray = this.entireJsondata?.host ?? [];
      this.directoryArray=this.entireJsondata?.extra_config?.grpc?.catalog ?? [];
      // this.objectMap=this.entireJsondata?.extra_config?.["plugin/http-server"]?.["url-rewrite"]?.literal && Object.entries(this.entireJsondata?.extra_config?.["plugin/http-server"]?.["url-rewrite"]?.literal)
      // console.log(this.objectMap);
      
    }

    this.formGroupService.patchValue({
      isgRPCActive: !!this.entireJsondata?.extra_config?.grpc,
      isEnableHttpsActive: !!this.entireJsondata?.tls,
      isUrlRewriteActive: !!this.entireJsondata?.extra_config?.["plugin/http-server"]?.name?.includes("url-rewrite"),
      isVirtualHostActive: !!this.entireJsondata?.extra_config?.["server/virtualhost"],
      isGeoIpActive: !!this.entireJsondata?.extra_config?.["plugin/http-server"]?.name?.includes("geoip"),
      isStaticServerActive: !!this.entireJsondata?.extra_config?.["server/static-filesystem"],
      isRateLimitingActive: !!this.entireJsondata?.extra_config?.["qos/ratelimit/service"],
      isHttpClientSetAdv: false,
      isJwkSharedActive: !!this.entireJsondata?.extra_config?.["auth/validator"],
      name: this.entireJsondata?.name,
      port: this.entireJsondata?.port,
      hostArrayValue: this.entireJsondata?.host,
      backendTimeout: this.entireJsondata?.timeout,
      defaultCache: this.entireJsondata?.cache_ttl,
      directoryArrayValue: this.entireJsondata?.extra_config?.grpc?.catalog,
      staticServerPrefix: this.entireJsondata?.extra_config?.["server/static-filesystem"]?.prefix,
      staticServerPath: this.entireJsondata?.extra_config?.["server/static-filesystem"]?.path,
      directoryList: this.entireJsondata?.extra_config?.["server/static-filesystem"]?.directory_listing,
      disablegZip: this.entireJsondata?.extra_config?.router?.disable_gzip,
      databasePath: this.entireJsondata?.extra_config?.["plugin/http-server"]?.geoip?.citydb_path,
      sharedCacheDuration: this.entireJsondata?.extra_config?.["auth/validator"]?.shared_cache_duration,
      // literalMatchObjectMapValue:this.entireJsondata["plugin/http-server"]["url-rewrite"]?.literal,
      // regExpMatchObjectMapValue:this.entireJsondata["plugin/http-server"]["url-rewrite"]?.regexp,
      publicKey: this.entireJsondata?.tls?.public_key,
      privateKey: this.entireJsondata?.tls?.private_key,
      httpReadTimeout: this.entireJsondata?.read_timeout,
      httpWriteTimeout: this.entireJsondata?.write_timeout,
      httpIdleTimeout: this.entireJsondata?.idle_timeout,
      httpReadHeaderTimeout: this.entireJsondata?.read_header_timeout,
      // host: [null],
      // directory: [],
      // virtualHost: [],
      // virtualHostArrayValue: [[]],
      // defaultOutputEncoding: [null],
      // nonRestfulResource: [null],
      // serverSequential: [null],
      // enableDebugOptions: [null],
      // literalReplacement: [null],
      // literalMatch: [null],
      // regexpMatch: [null],
      // endpointReplacement: [null],
      rateLimit: this.entireJsondata?.extra_config?.["qos/ratelimit/service"]?.max_rate,
      every: this.entireJsondata?.extra_config?.["qos/ratelimit/service"]?.every,
      capacity: this.entireJsondata?.extra_config?.["qos/ratelimit/service"]?.capacity,
      defaultUserQuota: this.entireJsondata?.extra_config?.["qos/ratelimit/service"]?.client_max_rate,
      clientCapacity: this.entireJsondata?.extra_config?.["qos/ratelimit/service"]?.client_capacity,
      httpClientSetAdvConnTimeoutForm: this.entireJsondata?.idle_connection_timeout ,
      httpClientSetAdvHeaderTimeoutForm: this.entireJsondata?.response_header_timeout,
      httpClientSetAdvContinueTimeoutForm: this.entireJsondata?.expect_continue_timeout,
      httpClientSetAdvMaxIdleConnForm: this.entireJsondata?.max_idle_connections,
      httpClientSetAdvMaxIdleConnPerHostForm: this.entireJsondata?.max_idle_connections_per_host,
      httpClientSetAdvAllowInsecureConnsForm: this.entireJsondata?.client_tlS?.allow_insecure_connections,
      httpClientSetAdvDisableKeepAlivesForm: this.entireJsondata?.disable_keep_alives,
      httpClientSetAdvDisableCompressionForm: this.entireJsondata?.disable_compression,
      httpClientSetAdvDialerTimeoutForm: this.entireJsondata?.dialer_timeout,
      httpClientSetAdvDialerFallerDelayForm: this.entireJsondata?.dialer_fallback_delay,
      httpClientSetAdvDialerKeepAliveForm: this.entireJsondata?.dialer_keep_alive,

      // literalMatchObjectMapValue: [[]],
      // regExpMatchObjectMapValue: [[]],
      uniqueStrategy: this.entireJsondata?.extra_config?.["qos/ratelimit/service"]?.strategy,
      headerValue:  this.entireJsondata?.extra_config?.["qos/ratelimit/service"]?.key,
      grpcId: this.entireJsondata?.extra_config?.grpc?.id
    })

    this.formGroupService.valueChanges.subscribe(value => {
      console.log(value);

      this.serviceSettingsFormSubmitted.emit(value);
    });
    // this.apiCardsService.getData$().subscribe((data:any) => {
    //   this.apiData = data;

    // });
    console.log(this.apiData);
  }

  submitForm() {
    const body = {
      "$schema": "string",
      "version": 0,
      "name": this.formGroupService.get('name')?.value,
      "port": 0,
      "host": [
        "string"
      ]
    }
    // this.apiPageService.createKrakend(body).subscribe({
    //   next: (res: any) => {
    //     console.log(res);

    //   }
    // })
  }
  emitValue() {
    // this.serviceSettingsFormSubmitted.emit(this.formGroupService.value);
    console.log(this.formGroupService.value);
    // this.formGroupService.get('literalMatchObjectMapValue')?.value.map((item:any,index:any)=>{
    //  return item

    // })
    // const val=this.formGroupService.get('literalMatchObjectMapValue')?.value;

    // if (this.formGroupService.valid) {
    //   this.sharedService.setServiceSettingData(this.formGroupService.value)
    //   this._snackBar.open('Saved Successfully', 'OK', {
    //     duration: 3000
    //   });
    // } else {
    //   this._snackBar.open('Please fill required details', 'OK', {
    //     duration: 3000
    //   });
    // }

  }


}
