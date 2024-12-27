import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndpointService } from '../services/endpoint.service';
import { ActivatedRoute } from '@angular/router';
import { GatewayService } from '../services/gateway.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-gateway-service-settings',
  templateUrl: './gateway-service-settings.component.html',
  styleUrl: './gateway-service-settings.component.css'
})
export class GatewayServiceSettingsComponent {

  gRPCinfo = "Mark this option to enable TLS in the listening port."
  jwkShareInfo = "If you have a lot of endpoints, each of them will need to retrieve the JWK URL to cache it. You can add a shared JWK cache where one endpoint call will enable the cache for another one using the same origin URL."
  nameInfo = "A friendly name, title, date, version or any other short description that helps you recognize this configuration when reporting to your metrics and traces systems."
  portInfo = "Port where KrakenD listens to connections, defaults to 8080."
  dnssrvInfo = "When there is a DNS entry of the type SRV that specifies the address, port, and weight of each service."
  disableSanitizeInfo = "Check only when the functionality must skip protocol checking."
  staticAddInfo = "99% of the times you will use static resolution."
  debugEndPointsInfo = "Debug endpoints enable additional endpoints that help you troubleshoot different scenarios."
  timeOutsAndTTL = "All settings below are used across all backends unless overridden explicitly in each endpoint"
  backendTimeoutInfo = "Default timeout for all connections against your backends, including the time spent in the whole pipe. This value can be overridden later on specific endpoints."
  httpReadHeaderTimeoutInfo = "Maximum time spent to read headers"
  httpIdleTimeoutInfo = "Maximum amount of time to wait for the next request when keepalives are enabled."
  httpWriteTimeoutInfo = "Maximum duration before timing-out writes of the response."
  httpReadTimeOutInfo = "Maximum duration for reading the entire HTTP request, including the body."
  defaultCacheInfo = "Value must be an integer expressing the number of seconds The time the service considers the origin is still valid. Applies to GET requests only. The service does not cache anything but expedites the headers for proxies to do the caching (e.g., a Varnish server, CDN, etc.)."
  defaultOutputEncodingInfo = "JSON Encoding used by default in all KrakenD endpoints unless changed per endpoint."  
  nonRestFulInfo = "By default KrakenD only works with RESTful URL patterns against backends. Enable this option if backends aren't RESTful, e.g.: /url.&#123;some_variable&#125;.json."
  serverSqntialInfo = "A sequential start registers all async agents in order when you run the server, allowing you to read the starting logs chronologically. Defaults to false."
  enableOptionsInfo = "Enable the /__debug/ endpoint where you can send requests of all sorts and see them echoed in the logs.<"
  jwkCacheDurationInfo = "The cache duration in seconds for the JWK client retrieving the jwk_url. The endpoint must enable the cache option in order to use this cache. The time you set here depends on your key rotation time."
  publicKeyInfo = "Absolute path to the public key, or relative to the current working directory (CWD)"
  privateKeyInfo = "Absolute path to the public key, or relative to the current working directory (CWD)"
  endpointReplaceInfo = "You can use the capturing groups (e.g: /hello/$&#123;1&#125;) here."
  regExMatchInfo = "The regexp expressions are checked in sequence when there are no literal matches."
  literalReplacementInfo = "The literal replacement, the final URL the match will become."
  literalMatchInfo = "The literal match takes precedence and is checked first. If the requested URL is exactly the one defined in the map, then the redirection happens."
  hostsInfo = "All recognized virtual hosts by KrakenD must be listed here. The values declared here must match the content of the Host header when passed by the client."
  databasePathInfo = "The path in the filesystem containing the database in GeoIP2 Binary (.mmdb) format. Relative to the working dir or absolute path."
  pathInfo = "The folder in the filesystem containing the static files. Relative to the working dir where KrakenD config is (e.g.: ./assets) or absolute (e.g.: /etc/krakend/assets)."
  prefixInfo = "This is the beginning (prefix) of all URLs that are resolved using this plugin. All matching URLs won’t be passed to the router, meaning that they are not considered endpoints. Make sure you are not overwriting valid endpoints. When the prefix is /, then all traffic is served as static and you must declare a prefix under skip (e.g.: /api) to match endpoints.<"
  directoryListInfo = "Allow users to browse the directory contents."
  rateLimitInfo = "Maximum requests you want to let the service handle in the specified time (every). Leave 0 for no default limit."
  everyInfo = "Time window where this rate limit applies."
  capacityInfo = "Number of tokens you can store in the Token Bucket. Traduces into maximum concurrent requests all users can do."
  defaultUserQuotaInfo = "Maximum requests per second you want to allow to each different API user. Use 0 for no limitation."
  clientCapacityInfo = "Number of tokens you can store in the Token Bucket for each individual user. Traduces into maximum concurrent requests KrakenD will accept for the connected user."
  httpClientSetAdvDialerKeepAliveInfo = "Keep-alive period for an active network connection. If zero, keep-alives are not enabled."
  httpClientSetAdvDialerFallerDelayInfo = "Length of time to wait before spawning a fallback connection. If zero, a default delay of 300ms is used."
  httpClientSetAdvDialerTimeoutInfo = "Maximum amount of time a dial will wait for a connect to complete"
  httpClientSetAdvDisableCompressionInfo = "If set, prevents the Transport from requesting compression with an 'Accept-Encoding: gzip' request header."
  httpClientSetAdvDisableKeepAlivesInfo = "If set prevents re-use of TCP connections between different HTTP request"
  httpClientSetAdvAllowInsecureConnsInfo = "E.g.: when using self-signed certificates"
  httpClientSetAdvMaxIdleConnPerHostInfo = "Maximum number of IDLE connections that you allow per-host. Defaults to 250."
  httpClientSetAdvMaxIdleConnInfo = "Maximum number of idle (keep-alive) connections across all hosts. 0 means no limit."
  httpClientSetAdvContinueTimeoutInfo = "Time to wait for a server's first response headers after fully writing the request headers if the request has an 'Expect: 100-continue' header. Zero means no timeout"
  httpClientSetAdvHeaderTimeoutInfo = "Time to wait for a server's response headers after fully writing the request. This time does not include the time to read the response body."
  httpClientSetAdvConnTimeoutInfo = "Maximum amount of time an idle (keep-alive) connection will remain idle before closing itself. Zero means no limit"
  SkipInfo = "An array with all the prefix URLs that despite they could match with the prefix, you don’t want to treat them as static content and pass them to the router."


  formGroupService: FormGroup;
  objectMap: Map<string, string> = new Map();
  regExpObjectMap: Map<string, string> = new Map();
  endPointData:any;
  gatewayServiceSettingsId: any;
  gatewayServiceSettingsData: any;

  @Input() formData: any;
  @Output() serviceSettingsFormSubmitted = new EventEmitter<any>();


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private getwayService:GatewayService, private toastService: ToastService) {
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
      enableDebug: [false],
      enableEcho: [false],
      virtualHost: [],
      virtualHostArrayValue: [[]],
      staticServerSkip: [],
      staticServerSkipArrayValue: [[]],
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
      every: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
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
  staticServerSkipArray: any = [];

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

  addParameter(fieldName: 'host' | 'directory' | 'virtualHost' | 'literalMatch' | 'regExpMatch' | 'staticServerSkip') {
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
      }else if (fieldName === 'staticServerSkip') {
        this.staticServerSkipArray.push(fieldValue);
        this.formGroupService.get('staticServerSkipArrayValue')?.setValue([...this.staticServerSkipArray]);
      }
      this.formGroupService.get('literalMatch')?.reset();
      this.formGroupService.get('literalReplacement')?.reset();
      this.formGroupService.get('regexpMatch')?.reset();
      this.formGroupService.get('endpointReplacement')?.reset();
      this.formGroupService.get(fieldName)?.reset();
    }
  }

  removeParameter(index: any, fieldName: 'host' | 'directory' | 'virtualHost' | 'literalMatch' | 'regExpMatch' | 'staticServerSkip') {
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
    }else if (fieldName === 'staticServerSkip') {
      this.staticServerSkipArray.splice(index, 1);
      this.formGroupService.get('staticServerSkipArrayValue')?.setValue([...this.staticServerSkipArray]);
    } 

  }

  apiData: any;
  entireJsondata: any;
  directory: any[] = [];
  virtualHost : any[] = [];
  staticServerSkip : any[] = [];
  host: any[] = [];
  


  ngOnInit() {

    this.route.parent?.paramMap.subscribe(params => {
      this.gatewayServiceSettingsId = params.get('id');
      console.log('Parent ID:', this.gatewayServiceSettingsId);
    });

    this.getwayService.getGtwyServiceSettings(this.gatewayServiceSettingsId).subscribe({
      next:(res)=>{
        console.log(res);
        this.gatewayServiceSettingsData = res;


        if(this.gatewayServiceSettingsData){
          this.directoryArray = this.gatewayServiceSettingsData?.extra_config?.grpc?.catalog ?? [];
          this.virtualHostArray = this.gatewayServiceSettingsData?.extra_config?.["server/virtualhost"]?.hosts ?? [];
          this.staticServerSkipArray = this.gatewayServiceSettingsData?.extra_config?.["server/static-filesystem"]?.skip ?? [];
          // this.host = this.gatewayServiceSettingsData?.endpoints?.backend?.host ?? [];
        }
        this.formGroupService.patchValue({
          isgRPCActive  : !! this.gatewayServiceSettingsData?.extra_config?.grpc,
          isJwkSharedActive  : !! this.gatewayServiceSettingsData?.extra_config?.["auth/validator"],
          isEnableHttpsActive : !! this.gatewayServiceSettingsData?.tls,
          isUrlRewriteActive : !! this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.name?.includes("url-rewrite"),
          isVirtualHostActive : !! this.gatewayServiceSettingsData?.extra_config?.["server/virtualhost"],
          isGeoIpActive : !! this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.name?.includes("geoip"),
          isStaticServerActive : !! this.gatewayServiceSettingsData?.extra_config?.["server/static-filesystem"],
          isRateLimitingActive: !!this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"],
          name : this.gatewayServiceSettingsData?.name,
          port : this.gatewayServiceSettingsData?.port,
          enableDebug : this.gatewayServiceSettingsData?.debug_endpoint,
          enableEcho : this.gatewayServiceSettingsData?.echo_endpoint,
          backendTimeout : this.gatewayServiceSettingsData?.timeout,
          defaultCache : this.gatewayServiceSettingsData?.cache_ttl,
          httpReadTimeout : this.gatewayServiceSettingsData?.read_timeout,
          httpWriteTimeout : this.gatewayServiceSettingsData?.write_timeout,
          httpIdleTimeout : this.gatewayServiceSettingsData?.idle_timeout,
          httpReadHeaderTimeout : this.gatewayServiceSettingsData?.read_header_timeout,
          defaultOutputEncoding : this.gatewayServiceSettingsData?.output_encoding,
          nonRestfulResource : this.gatewayServiceSettingsData?.disable_rest,
          serverSequential : this.gatewayServiceSettingsData?.sequential_start,
          enableDebugOptions : this.gatewayServiceSettingsData?.debug_endpoint,
          sharedCacheDuration : this.gatewayServiceSettingsData?.extra_config?.["auth/validator"]?.shared_cache_duration,
          disablegZip : this.gatewayServiceSettingsData?.extra_config?.router?.disable_gzip,
          publicKey : this.gatewayServiceSettingsData?.tls?.public_key,
          privateKey : this.gatewayServiceSettingsData?.tls?.private_key,

          literalMatchObjectMapValue:this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.["url-rewrite"]?.literal,
          regExpMatchObjectMapValue:this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.["url-rewrite"]?.regexp,
          
          databasePath : this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.geoip?.citydb_path,
          staticServerPath : this.gatewayServiceSettingsData?.extra_config?.["server/static-filesystem"]?.path,
          staticServerPrefix : this.gatewayServiceSettingsData?.extra_config?.["server/static-filesystem"]?.prefix,
          directoryList : this.gatewayServiceSettingsData?.extra_config?.["server/static-filesystem"]?.["directory_listing"],
          rateLimit: this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"]?.max_rate,
          every: this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"]?.every,
          capacity: this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"]?.capacity,
          defaultUserQuota: this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"]?.client_max_rate,
          clientCapacity: this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"]?.client_capacity,
          uniqueStrategy: this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"]?.strategy,
          headerValue:  this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"]?.key,
          httpClientSetAdvConnTimeoutForm: this.gatewayServiceSettingsData?.idle_connection_timeout ,
          httpClientSetAdvHeaderTimeoutForm: this.gatewayServiceSettingsData?.response_header_timeout,
          httpClientSetAdvContinueTimeoutForm: this.gatewayServiceSettingsData?.expect_continue_timeout,
          httpClientSetAdvMaxIdleConnForm: this.gatewayServiceSettingsData?.max_idle_connections,
          httpClientSetAdvMaxIdleConnPerHostForm: this.gatewayServiceSettingsData?.max_idle_connections_per_host,
          httpClientSetAdvAllowInsecureConnsForm: this.gatewayServiceSettingsData?.client_tls?.allow_insecure_connections,
          httpClientSetAdvDisableKeepAlivesForm: this.gatewayServiceSettingsData?.disable_keep_alives,
          httpClientSetAdvDisableCompressionForm: this.gatewayServiceSettingsData?.disable_compression,
          httpClientSetAdvDialerTimeoutForm: this.gatewayServiceSettingsData?.dialer_timeout,
          httpClientSetAdvDialerFallerDelayForm: this.gatewayServiceSettingsData?.dialer_fallback_delay,
          httpClientSetAdvDialerKeepAliveForm: this.gatewayServiceSettingsData?.dialer_keep_alive,
        })
      },
      error:(err)=>{
        console.error(err);
      }
    })

    // this.formGroupService.get('uniqueStrategy')?.valueChanges.subscribe((value) => {
    //   if (value === 'ip') {
    //     this.formGroupService.get('headerValue')?.reset();
    //   }
    // });

   
    // console.log(this.entireJsondata);
    // console.log(this.entireJsondata?.extra_config?.["server/static-filesystem"]?.prefix);
    // if (this.entireJsondata != undefined) {
    //   this.hostArray = this.entireJsondata?.host ?? [];
    //   this.directoryArray=this.entireJsondata?.extra_config?.grpc?.catalog ?? [];
      // this.objectMap=this.entireJsondata?.extra_config?.["plugin/http-server"]?.["url-rewrite"]?.literal && Object.entries(this.entireJsondata?.extra_config?.["plugin/http-server"]?.["url-rewrite"]?.literal)
      // console.log(this.objectMap);
      
    // }

    // this.formGroupService.patchValue({
    //   literalMatchObjectMapValue:this.entireJsondata["plugin/http-server"]["url-rewrite"]?.literal,
    //   regExpMatchObjectMapValue:this.entireJsondata["plugin/http-server"]["url-rewrite"]?.regexp,
    // })

    // this.formGroupService.valueChanges.subscribe(value => {
    //   console.log(value);

    //   this.serviceSettingsFormSubmitted.emit(value);
    // });
    // this.apiCardsService.getData$().subscribe((data:any) => {
    //   this.apiData = data;

    // });

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
  
  showSuccess(message:string) {
    this.toastService.show(message, { type: 'success' });
  }


  showError(message:string){
    this.toastService.show(message , {type:"error"})
  }

  submit(){

    const literalObj = this.formGroupService?.value?.literalMatchObjectMapValue?.reduce((acc:any, [key, value]:any) => {
      acc[key] = value;
      return acc;
    }, {});


    console.log(this.formGroupService.value);
    const body = {
     "httpClientSettingAdvancedId": this.gatewayServiceSettingsData?.http_id,
      "id" : this.gatewayServiceSettingsId,
      "name": this.formGroupService.get('name')?.value,
      "port": this.formGroupService.get('port')?.value,
      "debug_endpoint": this.formGroupService.value?.enableDebug,
      "echo_endpoint": this.formGroupService.value?.enableEcho,
      "timeout": this.formGroupService.value?.backendTimeout,
      "cache_ttl": this.formGroupService.value?.defaultCache,
      "read_timeout" : this.formGroupService.value?.httpReadTimeout,
      "write_timeout": this.formGroupService.value?.httpWriteTimeout,
      "idle_timeout" : this.formGroupService.value?.httpIdleTimeout,
      "read_header_timeout" : this.formGroupService.value?.httpReadHeaderTimeout,
      "output_encoding" : this.formGroupService.value?.defaultOutputEncoding,
      "disable_rest" : this.formGroupService.value?.nonRestfulResource,
      "sequential_start": this.formGroupService.value?.serverSequential,
      

      // ...((this.formGroupService.value?.isgRPCActive || this.formGroupService.value?.isJwkSharedActive || this.formGroupService.value?.disablegZip || this.formGroupService.value?.isVirtualHostActive || this.formGroupService.value?.isStaticServerActive || this.formGroupService.value?.isRateLimitingActive  || this.formGroupService.value?.isGeoIpActive || this.formGroupService.value?.isUrlRewriteActive) && {
        "extra_config":{
          id: this.gatewayServiceSettingsData?.extra_config?.id,
          ...(this.formGroupService.value?.isgRPCActive && {
            "grpc": {
              ...(!!this.gatewayServiceSettingsData?.extra_config?.grpc && {"id":this.gatewayServiceSettingsData?.extra_config?.grpc?.id}),
              ...(this.formGroupService.value?.directoryArrayValue.length>0 &&{"catalog": this.formGroupService.value?.directoryArrayValue})
            }}),
          ...(this.formGroupService.value?.isJwkSharedActive && {
            "auth/validator":{
              ...(!!this.gatewayServiceSettingsData?.extra_config?.["auth/validator"] && {"id":this.gatewayServiceSettingsData?.extra_config?.["auth/validator"]?.id}),
              "shared_cache_duration": this.formGroupService.value?.sharedCacheDuration
            }}),
          ...(this.formGroupService.value?.disablegZip && {
            "router":{
              ...(!!this.gatewayServiceSettingsData?.extra_config?.router && {"id":this.gatewayServiceSettingsData?.extra_config?.router?.id}),
              "disable_gzip": this.formGroupService.value?.disablegZip
            }}),
          ...(this.formGroupService.value?.isVirtualHostActive && {
            "server/virtualhost":{
              ...(!!this.gatewayServiceSettingsData?.extra_config?.["server/virtualhost"] && {"id":this.gatewayServiceSettingsData?.extra_config?.["server/virtualhost"]?.id}),
              "hosts": this.formGroupService.value?.virtualHostArrayValue
            }}),
          ...(this.formGroupService.value?.isStaticServerActive && {
            "server/static-filesystem":{
              ...(!!this.gatewayServiceSettingsData?.extra_config?.["server/static-filesystem"] && {"id":this.gatewayServiceSettingsData?.extra_config?.["server/static-filesystem"]?.id}),
              "prefix": this.formGroupService.value?.staticServerPrefix,
              "path" : this.formGroupService.value?.staticServerPath,
              "directory_listing": this.formGroupService.value?.directoryList,
              "skip": this.formGroupService.value?.staticServerSkipArrayValue
            }}),
          ...(this.formGroupService.value?.isRateLimitingActive && {
            "qos/ratelimit/service":{
              ...(!!this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"] && {"id":this.gatewayServiceSettingsData?.extra_config?.["qos/ratelimit/service"]?.id}),
              "capacity": this.formGroupService.value?.capacity,
              "max_rate" : this.formGroupService.value?.rateLimit,
              "every": this.formGroupService.value?.every,
              "client_max_rate": this.formGroupService.value?.defaultUserQuota,
              "strategy": this.formGroupService.value?.uniqueStrategy,
              "client_capacity": this.formGroupService.value?.clientCapacity,
              "key": this.formGroupService.value?.headerValue,
            }}),
          ...((this.formGroupService.value?.isGeoIpActive || this.formGroupService.value?.isUrlRewriteActive) && {
            "plugin/http-server":{
              ...(this.formGroupService.value?.isGeoIpActive && {
                "geoip": {
                  ...(!!this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.geoip && {"id":this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.geoip.id}),
                  "citydb_path":this.formGroupService.value?.databasePath
                }}),
              ...(this.formGroupService.value?.isUrlRewriteActive && {
                "url-rewrite": {
                  ...(!!this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.["url-rewrite"] && {"id":this.gatewayServiceSettingsData?.extra_config?.["plugin/http-server"]?.["url-rewrite"].id}),
                  ...(this.formGroupService.value?.literalMatchObjectMapValue?.length>0 && {
                    "literal": literalObj}),
                  ...(this.formGroupService.value?.regExpMatchObjectMapValue?.length>0 && {
                    "regexp": this.formGroupService.value?.regExpMatchObjectMapValue}),
                }}),
            }}),
          },


  

      "idle_connection_timeout": this.formGroupService.value?.httpClientSetAdvConnTimeoutForm ,
      "response_header_timeout": this.formGroupService.value?.httpClientSetAdvHeaderTimeoutForm,
      "expect_continue_timeout": this.formGroupService.value?.httpClientSetAdvContinueTimeoutForm,
      "max_idle_connections": this.formGroupService.value?.httpClientSetAdvMaxIdleConnForm,
      "max_idle_connections_per_host": this.formGroupService.value?.httpClientSetAdvMaxIdleConnPerHostForm,
      "disable_keep_alives": this.formGroupService.value?.httpClientSetAdvDisableKeepAlivesForm,
      "disable_compression": this.formGroupService.value?.httpClientSetAdvDisableCompressionForm,
      "dialer_timeout": this.formGroupService.value?.httpClientSetAdvDialerTimeoutForm,
      "dialer_fallback_delay": this.formGroupService.value?.httpClientSetAdvDialerFallerDelayForm,
      "dialer_keep_alive": this.formGroupService.value?.httpClientSetAdvDialerKeepAliveForm,
      
      ...(this.formGroupService?.value.httpClientSetAdvAllowInsecureConnsForm && {
        "client_tls": {
      
       "allow_insecure_connections": this.formGroupService?.value.httpClientSetAdvAllowInsecureConnsForm
        }}),

      ...(this.formGroupService.value?.isEnableHttpsActive && {
        "tls": {
        ...(!!this.gatewayServiceSettingsData?.tls && {"id":this.gatewayServiceSettingsData?.tls.id}),
        "public_key": this.formGroupService.value?.publicKey,
        "private_key": this.formGroupService.value?.privateKey,
        }})
      

    }
    console.log(body);

    this.getwayService.addServiceSettings(this.gatewayServiceSettingsId, body).subscribe({
      next:(res : any)=>{
        console.log(res)
        this.showSuccess(res?.message);
      },
      error:(err)=>{
        console.error(err)
        this.showError(err?.message);
      }
    })
  }


}
