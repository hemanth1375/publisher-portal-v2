import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
