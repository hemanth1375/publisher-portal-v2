import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// import { SharedDataService } from '../services/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EndpointService } from '../services/endpoint.service';
import { HttpsecurityService } from '../services/httpsecurity.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-gateways-httpsecurity',
  templateUrl: './gateways-httpsecurity.component.html',
  styleUrl: './gateways-httpsecurity.component.css'
})
export class GatewaysHttpsecurityComponent {

  krakendId: any
  selectedValues: string[] = []; // Array to store selected values
  formGroupHttpSecurity: FormGroup;
  httpSecurityIpFilterToolTip = "The IP filtering plugin allows you to restrict the traffic to your API gateway based on the IP address. It works in two different modes (allow or deny) where you define the list of IPs (CIDR blocks) that are authorized to use the API, or that are denied from using the API."
  basicAuthToolTip = "The Basic Authentication plugin protects the access to selected endpoints using basic username and password credentials via <b>htpasswd"
  httpSecurityToolTip = "Enforces HTTP security policies such as AllowedHosts, SSL Options, HSTS, XSS, HPKP"
  ipFilterPluginToolTip = "The IP filtering plugin allows you to restrict the traffic to your API gateway based on the IP address.It works in two different modes (allow or deny) where you define the list of IPs (CIDR blocks) that are authorized to use the API, or that are denied from using the API."
  multiProviderToolTip = "The JWK aggregator plugin allows KrakenD to validate tokens issued by multiple Identity Providers."
  corsToolTip = "Enable Cross-Origin Resource Sharing (CORS) module when the API is consumed by browsers in different domains."
  botDetectorToolTip = "Detect and reject bots carrying out scraping, content theft, and form spam."
  allowedOriginsToolTip = "Add those origins you would like to accept. Or use * for any origins"
  allowedHeadersToolTip = "Only the headers added here will be allowed"
  exposeHeadersToolTip = "Headers that are safe to expose to the API of a CORS API specification"
  botDetectorAllowToolTip = "An array with EXACT MATCHES of trusted user agents that can connect"
  botDetectorDenyToolTip = "An array of EXACT MATCHES of undesired bots, to reject immediately."
  botDetectorPatternsToolTip = "An array with all the REGULAR EXPRESSIONS that  define bots. Matching bots are rejected."
  multipleIdentityProviderOriginsArrayToolTip = "The list of all JWK URLs recognized as valid Identity Providers by the gateway."
  ipFilterCIDRToolTip = "The CIDR blocks (list of IPs) you want to allow or deny. <br>Examples: 192.168.0.0/24, 172.17.2.56/32, <br> 127.0.0.1"
  ipFilterTrustedProxiesToolTip = "A custom list of all the recognized machines/balancers that <br> proxy the client to your application. This list is used to avoid <br>spoofing when trying to get the real IP of the client."
  ipFilterClientIPHeadersToolTip = "A custom ordered list of all headers that might contain the <br> real IP of the client. The first matching IP in the list will be <br> used"
  httpSecurityAllowedHostsToolTip = " List of fully qualified domain names that are allowed, along with the origin port. Format: hostname:port.When the list is empty accepts any host name to connect."
  httpSecuritySSLProxyHeaderToolTip = "SSLProxyHeaders is set of header keys with associated values that would indicate a valid https request. Useful when using Nginx, e.g: X-Forwarded-Proto: https"
  allowedcredentialsToolTip = "When requests can include user credentials like cookies,HTTP authentication or client side SSL certificates"
  corsMaxAgeToolTip = "For how long the response can be cached"
  botDetectorCacheSizeToolTip = "Number of user agents cached to speed up repetitive bot  detection. Use 0 for no  cache."
  emptyUsersAgentsToolTip = "Whether to consider an empty user-agent a bot (and reject it)  or  not."
  multipleIdentityProviderPortToolTip = "The port of the local key server"
  multipleIdentityProviderCacheFormToolTip = "Cache keys"
  allowModeToolTip = "Check to only allow connections in the CIDR list. Uncheck to  deny all IPs from the list."
  httpSecuritySSLOptToolTip = "If set to true all HTTP requests are redirected to HTTPS. If the hostname used to redirect to https differs from the current host, specify it in the box, otherwise leave it blank."
  httpSecurityHSTSToolTip = "HSTS is a web security policy mechanism which helps to protect websites against protocol downgrade attacks and cookie hijacking. It allows web servers to declare that web browsers (or other complying user agents) should only interact with it using secure HTTPS connections,and never via the insecure HTTP protocol. When used the incoming links with http will be converted to https before accessing the server."
  includeAlsoSubdomains = "If this value is set to true, the includeSubdomains directive will be appended to the Strict-Transport-Security header."
  httpSecurityClickjackProtectToolTip = "Offers server-side partial protection against clickjacking when set to true, by adding the header X-Frame-Options: DENY."
  httpSecurityHPKPToolTip = "Allows HTTPS websites to resist impersonation by attackers using mis-issued or otherwise fraudulent certificates."
  httpSecuritySniffingToolTip = "When set prevents Internet Explorer from MIME-sniffing a response away from the declared content-type. This also applies to Google Chrome, when downloading extensions. Sets sX-Content-Type-Options: nosniff"
  browserCrossSiteScriptingToolTip = "When set adds the header X-XSS-Protection: 1; mode=block"
  basicAuthHtpasswdPathToolTip = "Absolute Path to the htpasswd filename (recommended) or relative ./ to the workdir."
  frameOptionsToolTip = "Allows HTTPS websites to resist impersonation by attackers  using mis-issued or otherwise fraudulent certificates. "
  httpSecurityConSecPolicyToolTip = "Enable Content Security Policy (CSP) by writing your policies in the header (see reference)."
  httpSecurityHSTSMaxAgeToolTip = "The max-age of the Strict-Transport-Security header. Setting to 0 disables  "
  corsAllowedMethodsToolTip = "Select which methods will be allowed"
  onToggleChangeStaticResponse(event: any, id: any) {
    console.log('id', id);
    (this as any)[id] = event.checked;
  }

  corsAllowedMethodsArray: any[] = []
  corsAllowedOriginsArray: any[] = [];
  corsAllowedHeadersArray: any[] = [];
  corsExposeHeadersArray: any[] = [];
  corsMaxAgeArray: any[] = [];
  botDetectorAllowArray: any[] = [];
  botDetectorDenyArray: any[] = [];
  botDetectorPatternsArray: any[] = [];
  multipleIdentityProviderOriginsArray: any[] = [];
  ipFilterCIDRArray: any[] = [];
  ipFilterTrustedProxiesArray: any[] = [];
  ipFilterClientIPHeadersArray: any[] = [];
  httpSecurityAllowedHostsArray: any[] = [];

  objectMap: Map<string, string> = new Map();
  entireJsonData: any;

  endPointData: any;

  removeAttribute(index: number): void {
    this.selectedValues.splice(index, 1);
    this.formGroupHttpSecurity.get('multiSelect')?.setValue(this.selectedValues); // Update the form control
  }

  patchRenamingObj(renamingObj: Record<string, string>) {
    if (renamingObj) {
      const mapArray = Object.entries(renamingObj);
      // const currentMap = new Map<string, string>(mapArray);
      // Update objectMaps
      // this.objectMaps[formGroupIndex] = currentMap;
      // Update the form control
      // this.getFormGroup(formGroupIndex).get('objectMapValue')?.setValue(mapArray);
      this.formGroupHttpSecurity.get('objectMapValue')?.setValue(mapArray)
      this.objectMap = new Map(mapArray); // Convert the array back to a Map

      console.log(this.formGroupHttpSecurity.get('objectMapValue'));

    }
  }

  fetchkrakendJson() {
    this.httpSecurityService.getHttpSecurity(this.krakendId).subscribe({
      next: (result) => {
        this.entireJsonData = result
        if (this.entireJsonData != undefined) {
          console.log(this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers);
          // if (this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers != undefined) {
          // this.patchRenamingObj(this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers)
          // }
          if (this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers) {
            // console.log(this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers);
            //  let vlauess=this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers
            //   const mapArray = Array.from(vlauess.entries());
            //   this.formGroupHttpSecurity.get('objectMapValue')?.setValue(mapArray);

            this.patchRenamingObj(this.entireJsonData.extra_config["security/http"].ssl_proxy_headers);
          }

          this.corsAllowedOriginsArray = this.entireJsonData?.extra_config?.["security/cors"]?.allow_origins || [];
          this.corsAllowedHeadersArray = this.entireJsonData?.extra_config?.["security/cors"]?.allow_headers || [];
          this.corsExposeHeadersArray = this.entireJsonData?.extra_config["security/cors"]?.expose_headers || [];
          this.botDetectorAllowArray = this.entireJsonData?.extra_config?.["security/bot-detector"]?.allow || [];
          this.botDetectorDenyArray = this.entireJsonData?.extra_config?.["security/bot-detector"]?.deny || [];
          this.botDetectorPatternsArray = this.entireJsonData?.extra_config?.["security/bot-detector"]?.patterns || [];
          this.multipleIdentityProviderOriginsArray = this.entireJsonData?.extra_config?.["plugin/http-server"]?.["jwk-aggregator"]?.origins || [];
          this.ipFilterCIDRArray = this.entireJsonData?.extra_config?.["plugin/http-server"]?.["ip-filter"]?.CIDR || [];
          this.ipFilterTrustedProxiesArray = this.entireJsonData?.extra_config?.["plugin/http-server"]?.["ip-filter"]?.trusted_proxies || [];
          this.ipFilterClientIPHeadersArray = this.entireJsonData?.extra_config?.["plugin/http-server"]?.["ip-filter"]?.client_ip_headers || [];
          this.httpSecurityAllowedHostsArray = this.entireJsonData?.extra_config?.["security/http"]?.allowed_hosts || [];
          // this.objectMap = this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers || [];
        }
        this.formGroupHttpSecurity.patchValue({
          isCorsActive: !!this.entireJsonData?.extra_config?.["security/cors"],
          isBotDetectorActive: !!this.entireJsonData?.extra_config?.["security/bot-detector"],
          isMultipleIdentityProviderActive: !!this.entireJsonData?.extra_config?.["plugin/http-server"]?.name?.includes("jwk-aggregator"),
          isIpFilterActive: !!this.entireJsonData?.extra_config?.["plugin/http-server"]?.name?.includes("ip-filter"),
          isHttpSecurityActive: !!this.entireJsonData?.extra_config?.["security/http"],
          isBasicAuthActive: !!this.entireJsonData?.extra_config?.["auth/basic"],
          corsAllowedOriginsForm: '',
          corsAllowedHeadersForm: '',
          corsExposeHeadersForm: '',
          multiSelect: this.entireJsonData?.extra_config?.['security/cors']?.allow_methods,
          corsAllowCredentialsForm: this.entireJsonData?.extra_config?.["security/cors"]?.allow_credentials,
          corsMaxAgeForm: this.entireJsonData?.extra_config?.["security/cors"]?.max_age,
          botDetectorAllowForm: '',
          botDetectorDenyForm: '',
          botDetectorPatternsForm: '',
          botDetectorCacheSizeForm: this.entireJsonData?.extra_config?.["security/bot-detector"]?.cache_size,
          botDetectorEmptyUsersForm: this.entireJsonData?.extra_config?.["security/bot-detector"]?.empty_user_agent_is_bot,
          multipleIdentityProviderOriginsForm: '',
          multipleIdentityProviderPortForm: this.entireJsonData?.extra_config?.["plugin/http-server"]?.["jwk-aggregator"]?.port ?? [],
          multipleIdentityProviderCacheForm: this.entireJsonData?.extra_config?.["plugin/http-server"]?.["jwk-aggregator"]?.cache,
          ipFilterCIDRForm: '',
          ipFilterClientIPHeadersForm: '',
          ipFilterTrustedProxiesForm: '',
          ipFilterAllowModeForm: this.entireJsonData?.extra_config?.["plugin/http-server"]?.["ip-filter"]?.allow,
          httpSecurityAllowedHostsForm: '',
          httpSecuritySSLOptForceSSLForm: this.entireJsonData?.extra_config?.["security/http"]?.ssl_redirect,
          httpSecuritySSLOptForm: this.entireJsonData?.extra_config?.["security/http"]?.ssl_host,
          httpSecuritySSLOptPortForm: this.entireJsonData?.extra_config?.["security/http"]?.ssl_port,
          httpSecuritySSLProxyHeaderForm: '',
          httpSecurityHeaderValueForm: '',
          httpSecurityHSTSForm: this.entireJsonData?.extra_config?.["security/http"]?.sts_seconds,
          httpSecurityIncSubdomainForm: this.entireJsonData?.extra_config?.["security/http"]?.sts_include_subdomains,
          httpSecurityClickjackProtectForm: this.entireJsonData?.extra_config?.["security/http"]?.frame_deny,
          httpSecurityHPKPForm: this.entireJsonData?.extra_config?.["security/http"]?.hpkp_public_key,
          httpSecuritySniffingForm: this.entireJsonData?.extra_config?.["security/http"]?.content_type_nosniff,
          httpSecurityXSSProtectionForm: this.entireJsonData?.extra_config?.["security/http"]?.browser_xss_filter,
          httpSecurityConSecPolicyForm: this.entireJsonData?.extra_config?.["security/http"]?.content_security_policy,
          basicAuthHtpasswdPathForm: this.entireJsonData?.extra_config?.["auth/basic"]?.htpasswd_path,
          //corsAllowedMethodsFormArray: this.entireJsonData?.extra_config?.["security/cors"]?.allow_methods ?? [],
          corsAllowedOriginsFormArray: this.entireJsonData?.extra_config?.["security/cors"]?.allow_origins ?? [],
          corsAllowedHeadersFormArray: this.entireJsonData?.extra_config?.["security/cors"]?.allow_headers ?? [],
          corsExposeHeadersFormArray: this.entireJsonData?.extra_config?.["security/cors"]?.expose_headers ?? [],
          corsMaxAgeFormArray: [[]],
          botDetectorAllowFormArray: this.entireJsonData?.extra_config?.["security/bot-detector"]?.allow ?? [],
          botDetectorDenyFormArray: this.entireJsonData?.extra_config?.["security/bot-detector"]?.deny ?? [],
          botDetectorPatternsFormArray: this.entireJsonData?.extra_config?.["security/bot-detector"]?.patterns ?? [],
          multipleIdentityProviderOriginsFormArray: this.entireJsonData?.extra_config?.["plugin/http-server"]?.["jwk-aggregator"]?.origins ?? [],
          ipFilterCIDRFormArray: this.entireJsonData?.extra_config?.["plugin/http-server"]?.["ip-filter"]?.CIDR ?? [],
          ipFilterTrustedProxiesFormArray: this.entireJsonData?.extra_config?.["plugin/http-server"]?.["ip-filter"]?.trusted_proxies ?? [],
          ipFilterClientIPHeadersFormArray: this.entireJsonData?.extra_config?.["plugin/http-server"]?.["ip-filter"]?.client_ip_headers ?? [],
          httpSecurityAllowedHostsFormArray: this.entireJsonData?.extra_config?.["security/http"]?.allowed_hosts ?? [],
          // objectMapValue: [[]],
          frameOptions: this.entireJsonData?.extra_config?.["security/http"]?.custom_frame_options_value
        })
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  ngOnInit() {
    // if (this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers) {
    //   this.patchRenamingObj(this.entireJsonData?.extra_config?.["security/http"]?.ssl_proxy_headers)
    // }

    // this.sharedService.getEntireJsonData$().subscribe(data => {
    //   this.entireJsonData = data;
    // })

    this.route.parent?.paramMap.subscribe((params: any) => {
      this.krakendId = params.get('id')
      console.log('krakendId ID:', this.krakendId);
      if (this.krakendId) {
        this.fetchkrakendJson();
      }
    }
    )

    this.formGroupHttpSecurity.get('multiSelect')?.valueChanges.subscribe((values) => {
      this.selectedValues = values;
    });


  }
  getSelectedValues(): string {
    const values = this.formGroupHttpSecurity.get('multiSelect')?.value || [];
    return values.join(', '); // Convert array to a comma-separated string
  }


  updateMapControl() {
    // Convert Map to array of key-value pairs
    const mapArray = Array.from(this.objectMap.entries());
    this.formGroupHttpSecurity.get('objectMapValue')?.setValue(mapArray);
  }

  addToMap(key: string, value: string) {
    this.objectMap.set(key, value);
    this.updateMapControl();  // Sync form control with updated Map
  }
  removeFromMap(key: string) {
    this.objectMap.delete(key);
    this.updateMapControl();  // Sync form control with updated Map
  }





  addParameter(fieldName: 'corsAllowedMethodsForm' | 'corsAllowedOriginsForm' | 'corsAllowedHeadersForm' | 'corsExposeHeadersForm' | 'corsMaxAgeForm' | 'botDetectorAllowForm' | 'botDetectorDenyForm' | 'botDetectorPatternsForm' | 'multipleIdentityProviderOriginsForm' | 'ipFilterCIDRForm' | 'ipFilterTrustedProxiesForm' | 'ipFilterClientIPHeadersForm' | 'httpSecurityAllowedHostsForm' | 'httpSecurityHeaderAndHearValue') {
    const fieldValue = this.formGroupHttpSecurity.get(fieldName)?.value;


    if (fieldName) {
      if (fieldName === 'corsAllowedMethodsForm') {
        this.corsAllowedMethodsArray.push(fieldValue);
        this.formGroupHttpSecurity.get('corsAllowedMethodsArray')?.setValue([...this.corsAllowedMethodsArray])
      }
    }


    if (fieldName) {
      if (fieldName === 'corsAllowedOriginsForm') {
        this.corsAllowedOriginsArray.push(fieldValue);
        this.formGroupHttpSecurity.get('corsAllowedOriginsFormArray')?.setValue([...this.corsAllowedOriginsArray]);
      }
      else if (fieldName === 'corsAllowedHeadersForm') {
        console.log(this.corsAllowedHeadersArray);

        this.corsAllowedHeadersArray.push(fieldValue);
        this.formGroupHttpSecurity.get('corsAllowedHeadersFormArray')?.setValue([...this.corsAllowedHeadersArray]);
      } else if (fieldName === 'corsExposeHeadersForm') {
        this.corsExposeHeadersArray.push(fieldValue);
        this.formGroupHttpSecurity.get('corsExposeHeadersFormArray')?.setValue([...this.corsExposeHeadersArray]);
      } else if (fieldName === 'corsMaxAgeForm') {
        this.corsMaxAgeArray.push(fieldValue);
        this.formGroupHttpSecurity.get('corsMaxAgeFormArray')?.setValue([...this.corsMaxAgeArray]);
      }
      else if (fieldName === 'botDetectorAllowForm') {
        this.botDetectorAllowArray.push(fieldValue);
        this.formGroupHttpSecurity.get('botDetectorAllowFormArray')?.setValue([...this.botDetectorAllowArray]);
      } else if (fieldName === 'botDetectorDenyForm') {
        this.botDetectorDenyArray.push(fieldValue);
        this.formGroupHttpSecurity.get('botDetectorDenyFormArray')?.setValue([...this.botDetectorDenyArray]);
      } else if (fieldName === 'botDetectorPatternsForm') {
        this.botDetectorPatternsArray.push(fieldValue);
        this.formGroupHttpSecurity.get('botDetectorPatternsFormArray')?.setValue([...this.botDetectorPatternsArray]);
      } else if (fieldName === 'multipleIdentityProviderOriginsForm') {
        this.multipleIdentityProviderOriginsArray.push(fieldValue);
        this.formGroupHttpSecurity.get('multipleIdentityProviderOriginsFormArray')?.setValue([...this.multipleIdentityProviderOriginsArray]);
      } else if (fieldName === 'ipFilterCIDRForm') {
        this.ipFilterCIDRArray.push(fieldValue);
        this.formGroupHttpSecurity.get('ipFilterCIDRFormArray')?.setValue([...this.ipFilterCIDRArray]);
      } else if (fieldName === 'ipFilterTrustedProxiesForm') {
        this.ipFilterTrustedProxiesArray.push(fieldValue);
        this.formGroupHttpSecurity.get('ipFilterTrustedProxiesFormArray')?.setValue([...this.ipFilterTrustedProxiesArray]);
      } else if (fieldName === 'ipFilterClientIPHeadersForm') {
        this.ipFilterClientIPHeadersArray.push(fieldValue);
        this.formGroupHttpSecurity.get('ipFilterClientIPHeadersFormArray')?.setValue([...this.ipFilterClientIPHeadersArray]);
      } else if (fieldName === 'httpSecurityAllowedHostsForm') {
        this.httpSecurityAllowedHostsArray.push(fieldValue);
        this.formGroupHttpSecurity.get('httpSecurityAllowedHostsFormArray')?.setValue([...this.httpSecurityAllowedHostsArray]);
      } else if (fieldName === 'httpSecurityHeaderAndHearValue') {
        console.log("clicked");

        const originalObject = this.formGroupHttpSecurity.get('httpSecuritySSLProxyHeaderForm')?.value;
        const renamedObject = this.formGroupHttpSecurity.get('httpSecurityHeaderValueForm')?.value;

        if (originalObject && renamedObject) {
          this.addToMap(originalObject, renamedObject)
          console.log(this.objectMap);

        }
      }

    }
    this.formGroupHttpSecurity.get(fieldName)?.reset();

  }

  removeParameter(index: any, fieldName: 'corsAllowedOriginsForm' | 'corsAllowedHeadersForm' | 'corsExposeHeadersForm' | 'corsMaxAgeForm' | 'botDetectorAllowForm' | 'botDetectorDenyForm' | 'botDetectorPatternsForm' | 'multipleIdentityProviderOriginsForm' | 'ipFilterCIDRForm' | 'ipFilterTrustedProxiesForm' | 'ipFilterClientIPHeadersForm' | 'httpSecurityAllowedHostsForm' | 'httpSecurityHeaderAndHearValue') {
    if (fieldName === "corsAllowedOriginsForm") {
      this.corsAllowedOriginsArray.splice(index, 1);
      this.formGroupHttpSecurity.get('corsAllowedOriginsFormArray')?.setValue([...this.corsAllowedOriginsArray]);
    } else if (fieldName === "corsAllowedHeadersForm") {
      this.corsAllowedHeadersArray.splice(index, 1);
      this.formGroupHttpSecurity.get('corsAllowedHeadersFormArray')?.setValue([...this.corsAllowedHeadersArray]);
    } else if (fieldName === "corsExposeHeadersForm") {
      this.corsExposeHeadersArray.splice(index, 1);
      this.formGroupHttpSecurity.get('corsExposeHeadersFormArray')?.setValue([...this.corsExposeHeadersArray]);
    } else if (fieldName === "corsMaxAgeForm") {
      this.corsMaxAgeArray.splice(index, 1);
      this.formGroupHttpSecurity.get('corsMaxAgeFormArray')?.setValue([...this.corsMaxAgeArray]);
    } else if (fieldName === "botDetectorAllowForm") {
      this.botDetectorAllowArray.splice(index, 1);
      this.formGroupHttpSecurity.get('botDetectorAllowFormArray')?.setValue([...this.botDetectorAllowArray]);
    } else if (fieldName === "botDetectorDenyForm") {
      this.botDetectorDenyArray.splice(index, 1);
      this.formGroupHttpSecurity.get('botDetectorDenyFormArray')?.setValue([...this.botDetectorDenyArray]);
    } else if (fieldName === "botDetectorPatternsForm") {
      this.botDetectorPatternsArray.splice(index, 1);
      this.formGroupHttpSecurity.get('botDetectorPatternsFormArray')?.setValue([...this.botDetectorPatternsArray]);
    } else if (fieldName === "multipleIdentityProviderOriginsForm") {
      this.multipleIdentityProviderOriginsArray.splice(index, 1);
      this.formGroupHttpSecurity.get('multipleIdentityProviderOriginsFormArray')?.setValue([...this.multipleIdentityProviderOriginsArray]);
    } else if (fieldName === "ipFilterCIDRForm") {
      this.ipFilterCIDRArray.splice(index, 1);
      this.formGroupHttpSecurity.get('ipFilterCIDRFormArray')?.setValue([...this.ipFilterCIDRArray]);
    } else if (fieldName === "ipFilterTrustedProxiesForm") {
      this.ipFilterTrustedProxiesArray.splice(index, 1);
      this.formGroupHttpSecurity.get('ipFilterTrustedProxiesFormArray')?.setValue([...this.ipFilterTrustedProxiesArray]);
    } else if (fieldName === "ipFilterClientIPHeadersForm") {
      this.ipFilterClientIPHeadersArray.splice(index, 1);
      this.formGroupHttpSecurity.get('ipFilterClientIPHeadersFormArray')?.setValue([...this.ipFilterClientIPHeadersArray]);
    } else if (fieldName === "httpSecurityAllowedHostsForm") {
      this.httpSecurityAllowedHostsArray.splice(index, 1);
      this.formGroupHttpSecurity.get('httpSecurityAllowedHostsFormArray')?.setValue([...this.httpSecurityAllowedHostsArray]);
    } else if (fieldName == "httpSecurityHeaderAndHearValue") {
      this.removeFromMap(index);
    }
  }

  showSuccess(message: string) {
    this.toastService.show(message, { type: 'success' });
  }
  showError(message: string) {
    this.toastService.show(message, { type: "error" })
  }

  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private httpSecurityService: HttpsecurityService, private route: ActivatedRoute, private toastService: ToastService) {
    this.formGroupHttpSecurity = this.formBuilder.group({
      isCorsActive: [false],
      isBotDetectorActive: [false],
      isMultipleIdentityProviderActive: [false],
      isIpFilterActive: [false],
      isHttpSecurityActive: [false],
      isBasicAuthActive: [false],
      multiSelect: [[]], // Initialize the form control with an empty array
      corsAllowedMethodsForm: [null],
      corsAllowedOriginsForm: [null],
      corsAllowedHeadersForm: [null],
      corsExposeHeadersForm: [null],
      corsAllowCredentialsForm: [false],
      corsMaxAgeForm: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      botDetectorAllowForm: [null],
      botDetectorDenyForm: [null],
      botDetectorPatternsForm: [null],
      botDetectorCacheSizeForm: [1000],
      botDetectorEmptyUsersForm: [false],
      multipleIdentityProviderOriginsForm: [null],
      multipleIdentityProviderPortForm: [null, Validators.required],
      // timeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      multipleIdentityProviderCacheForm: [false],
      ipFilterCIDRForm: [null],
      ipFilterClientIPHeadersForm: [null],
      ipFilterTrustedProxiesForm: [null],
      ipFilterAllowModeForm: [false],
      httpSecurityAllowedHostsForm: [null],
      httpSecuritySSLOptForceSSLForm: [false],
      httpSecuritySSLOptForm: [null],
      httpSecuritySSLOptPortForm: [null],
      httpSecuritySSLProxyHeaderForm: [null],
      httpSecurityHeaderValueForm: [null],
      httpSecurityHSTSForm: [null],
      httpSecurityIncSubdomainForm: [false],
      httpSecurityClickjackProtectForm: [false],
      httpSecurityHPKPForm: [null],
      httpSecuritySniffingForm: [false],
      httpSecurityXSSProtectionForm: [false],
      httpSecurityConSecPolicyForm: [null],
      basicAuthHtpasswdPathForm: [null],
      corsAllowedOriginsFormArray: [[]],
      corsAllowedHeadersFormArray: [[]],
      corsExposeHeadersFormArray: [[]],
      corsMaxAgeFormArray: [[]],
      botDetectorAllowFormArray: [[]],
      botDetectorDenyFormArray: [[]],
      botDetectorPatternsFormArray: [[]],
      multipleIdentityProviderOriginsFormArray: [[]],
      ipFilterCIDRFormArray: [[]],
      ipFilterTrustedProxiesFormArray: [[]],
      ipFilterClientIPHeadersFormArray: [[]],
      httpSecurityAllowedHostsFormArray: [[]],
      objectMapValue: [[]],
      frameOptions: [null]
    })
  }
  emitValue() {
    console.log(this.formGroupHttpSecurity.value);
    // const renamingObj = data?.objectMapValue?.reduce((acc:any, [key, value]:any) => {
    //   acc[key] = value;
    //   return acc;
    // }, {});
    const ssl_proxy_headers_values = this.formGroupHttpSecurity.get('objectMapValue')?.value.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    const httpbody = {
      // "id": this.cardId?this.cardId:null,

      //       ...(this.formGroupHttpSecurity.get('corsAllowedHeadersFormArray') as FormArray)?.length != 0 &&
      // {
      //   "allow_headers": (this.formGroupHttpSecurity.get('corsAllowedHeadersFormArray') as FormArray)?.value
      // }),
      ...(this.formGroupHttpSecurity.get('isCorsActive')?.value && {
        "security/cors": {
          // ...(this.formGroupHttpSecurity.get('corsAllowedOriginsFormArray')?.length!=0 &&{"allow_origins": this.formGroupHttpSecurity.get('corsAllowedOriginsFormArray')}),
          // "allow_methods": [
          //   ''
          // ],
          "id": this.entireJsonData?.extra_config?.["security/cors"]?.id ? this.entireJsonData?.extra_config?.["security/cors"]?.id : null,
          ...(this.formGroupHttpSecurity.get('multiSelect')?.value?.length && {
            "allow_methods": this.formGroupHttpSecurity.get('multiSelect')?.value
          }),
          ...((this.formGroupHttpSecurity.get('corsAllowedOriginsFormArray')?.value)?.length != 0 &&
            { "allow_origins": this.formGroupHttpSecurity.get('corsAllowedOriginsFormArray')?.value }),

          // ...(this.formGroupHttpSecurity.get('corsAllowedHeadersFormArray')?.length != 0 && {"allow_headers": this.formGroupHttpSecurity.get('corsAllowedHeadersFormArray')}),
          ...(this.formGroupHttpSecurity.get('corsAllowedHeadersFormArray')?.value)?.length != 0 && {
            "allow_headers": this.formGroupHttpSecurity.get('corsAllowedHeadersFormArray')?.value
          },
          // ...(this.formGroupHttpSecurity.get('corsExposeHeadersFormArray')?.length!=0 &&{"expose_headers": this.formGroupHttpSecurity.get('corsExposeHeadersFormArray')}),
          ...(this.formGroupHttpSecurity.get('corsExposeHeadersFormArray')?.value)?.length != 0 && {
            "expose_headers": this.formGroupHttpSecurity.get('corsExposeHeadersFormArray')?.value
          },
          // ...(this.formGroupHttpSecurity?.corsMaxAgeForm &&{"max_age": this.formGroupHttpSecurity?.corsMaxAgeForm}),
          ...(this.formGroupHttpSecurity.get('corsMaxAgeForm')?.value && {
            "max_age": this.formGroupHttpSecurity.get('corsMaxAgeForm')?.value
          }),
          //   ...(this.formGroupHttpSecurity?.corsAllowCredentialsForm &&{"allow_credentials": this.formGroupHttpSecurity?.corsAllowCredentialsForm})
          // }}),
          ...(this.formGroupHttpSecurity.get('corsAllowCredentialsForm')?.value && { "allowedCredentials": this.formGroupHttpSecurity.get('corsAllowCredentialsForm')?.value })
        }
      }),

      ...(this.formGroupHttpSecurity.get('isBotDetectorActive')?.value &&
      {
        "security/bot-detector": {
          "id": this.entireJsonData?.extra_config?.["security/bot-detector"]?.id ? this.entireJsonData?.extra_config?.["security/bot-detector"]?.id : null,
          ...(this.formGroupHttpSecurity.get('botDetectorAllowFormArray')?.value)?.length != 0 && {
            "allow": (this.formGroupHttpSecurity.get('botDetectorAllowFormArray')?.value),
          },
          // ...(this.formGroupHttpSecurity.get('botDetectorCacheSizeForm')?.value && {
          //   "cache_size": this.formGroupHttpSecurity.get('botDetectorCacheSizeForm')?.value,
          // }),
          "cache_size": this.formGroupHttpSecurity.get('botDetectorCacheSizeForm')?.value,
          ...(this.formGroupHttpSecurity.get('botDetectorDenyFormArray')?.value)?.length != 0 && {
            "deny": (this.formGroupHttpSecurity.get('botDetectorDenyFormArray'))?.value,
          },
          // ...(this.formGroupHttpSecurity.get('botDetectorEmptyUsersForm')?.value && {
          // "empty_user_agent_is_bot": this.formGroupHttpSecurity.get('botDetectorEmptyUsersForm')?.value,
          // }),
          "empty_user_agent_is_bot": this.formGroupHttpSecurity.get('botDetectorEmptyUsersForm')?.value,
          ...(this.formGroupHttpSecurity.get('botDetectorPatternsFormArray')?.value)?.length != 0 && {
            "patterns": (this.formGroupHttpSecurity.get('botDetectorPatternsFormArray')?.value),
          },
        },
      }
      ),

      ...((this.formGroupHttpSecurity.get('isIpFilterActive')?.value || this.formGroupHttpSecurity.get('isMultipleIdentityProviderActive')?.value) && {
        "plugin/http-server": {
          // "name": [
          //   this.formGroupHttpSecurity.get('isIpFilterActive') && 'ip-filter',
          //   this.formGroupHttpSecurity.get('isMultipleIdentityProviderActive') && 'jwk-aggregator'
          // ].filter(Boolean),
          // ...(this.formGroupHttpSecurity?.isGeoIpActive &&{"geoip": {
          //   ...(this.formGroupHttpSecurity?.databasePath &&{"citydb_path":this.formGroupHttpSecurity?.databasePath})
          // }}),
          // ...(this.formGroupHttpSecurity?.isUrlRewriteActive && {"url-rewrite": {
          //   "literal": literalObj,
          //   "regexp": this.formGroupHttpSecurity?.regExpMatchObjectMapValue
          // }}),

          // "name": [
          //   this.formGroupHttpSecurity.get('isIpFilterActive')?.value && 'ip-filter',
          //   this.formGroupHttpSecurity.get('isMultipleIdentityProviderActive') && 'jwk-aggregator'
          // ].filter(Boolean),
          ...((this.formGroupHttpSecurity.get('isIpFilterActive')?.value || this.formGroupHttpSecurity.get('isMultipleIdentityProviderActive')?.value) && {
            "name": [
              this.formGroupHttpSecurity.get('isIpFilterActive')?.value && 'ip-filter',
              this.formGroupHttpSecurity.get('isMultipleIdentityProviderActive')?.value && 'jwk-aggregator'
            ].filter(Boolean),
          }),
          ...(this.formGroupHttpSecurity.get('isIpFilterActive')?.value && {
            "ip-filter": {
              "id": this.entireJsonData?.extra_config?.["ip-filter"]?.id ? this.entireJsonData?.extra_config?.["ip-filter"]?.id : null,
              // ...(this.formGroupHttpSecurity?.ipFilterCIDRFormArray.length!=0 &&{"CIDR": this.formGroupHttpSecurity?.ipFilterCIDRFormArray}),
              ...(this.formGroupHttpSecurity.get('ipFilterCIDRFormArray')?.value?.length != 0 && {
                "CIDR": this.formGroupHttpSecurity.get('ipFilterCIDRFormArray')?.value
              }),

              // "allow": this.formGroupHttpSecurity.get('ipFilterAllowModeForm')?.value,
              // "allow": this.formGroupHttpSecurity.get('ipFilterAllowModeForm')?.value,
              // ...(this.formGroupHttpSecurity.get('ipFilterAllowModeForm')?.value && {
              "allow": this.formGroupHttpSecurity.get('ipFilterAllowModeForm')?.value,
              // }),
              // ...(this.formGroupHttpSecurity?.ipFilterClientIPHeadersFormArray.length!=0 &&{"client_ip_headers": this.formGroupHttpSecurity?.ipFilterClientIPHeadersFormArray}),
              ...this.formGroupHttpSecurity.get('ipFilterClientIPHeadersFormArray')?.value.length != 0 && {
                "client_ip_headers": this.formGroupHttpSecurity.get('ipFilterClientIPHeadersFormArray')?.value
              },
              // ...(this.formGroupHttpSecurity?.ipFilterTrustedProxiesFormArray.length!=0 &&{"trusted_proxies": this.formGroupHttpSecurity?.ipFilterTrustedProxiesFormArray})
              ...(this.formGroupHttpSecurity.get('ipFilterTrustedProxiesFormArray')?.value?.length != 0 && {
                "trusted_proxies": (this.formGroupHttpSecurity.get('ipFilterTrustedProxiesFormArray') as FormArray)?.value
              }),

            }
          }),
          ...(this.formGroupHttpSecurity.get('isMultipleIdentityProviderActive')?.value && {
            "jwk-aggregator": {
              "id": this.entireJsonData?.extra_config?.["jwk-aggregator"]?.id ? this.entireJsonData?.extra_config?.["jwk-aggregator"]?.id : null,
              "cache": this.formGroupHttpSecurity.get('multipleIdentityProviderCacheForm')?.value,
              // ...(this.formGroupHttpSecurity?.multipleIdentityProviderOriginsFormArray.length!=0 &&{"origins": this.formGroupHttpSecurity?.multipleIdentityProviderOriginsFormArray}),
              ...(this.formGroupHttpSecurity.get('multipleIdentityProviderOriginsFormArray')?.value?.length != 0 && {
                "origins": this.formGroupHttpSecurity.get('multipleIdentityProviderOriginsFormArray')?.value
              }),
              // ...(this.formGroupHttpSecurity?.multipleIdentityProviderPortForm &&{"port": this.formGroupHttpSecurity?.multipleIdentityProviderPortForm})
              ...(this.formGroupHttpSecurity.get('multipleIdentityProviderPortForm')?.value?.length != 0 && {
                "port": this.formGroupHttpSecurity.get('multipleIdentityProviderPortForm')?.value
              }),
            }
          }),
        }
      }),

      ...(this.formGroupHttpSecurity.get('isHttpSecurityActive')?.value && {
        "security/http":
        {
          "id": this.entireJsonData?.extra_config?.["security/http"]?.id ? this.entireJsonData?.extra_config?.["security/http"]?.id : null,
          ...(this.formGroupHttpSecurity.get('httpSecurityAllowedHostsFormArray')?.value?.length && {
            "allowed_hosts": (this.formGroupHttpSecurity.get('httpSecurityAllowedHostsFormArray')?.value)
          }),
          ...(this.formGroupHttpSecurity.get('httpSecurityXSSProtectionForm')?.value && { "browser_xss_filter": this.formGroupHttpSecurity.get('httpSecurityXSSProtectionForm')?.value }),
          ...(this.formGroupHttpSecurity.get('httpSecurityConSecPolicyForm')?.value && { "content_security_policy": this.formGroupHttpSecurity.get('httpSecurityConSecPolicyForm')?.value }),
          ...(this.formGroupHttpSecurity.get('httpSecuritySniffingForm')?.value && { "content_type_nosniff": this.formGroupHttpSecurity.get('httpSecuritySniffingForm')?.value }),

          ...(this.formGroupHttpSecurity.get('httpSecurityClickjackProtectForm')?.value && {
            ...(this.formGroupHttpSecurity.get('frameOptions')?.value && {
              "custom_frame_options_value": this.formGroupHttpSecurity.get('frameOptions')?.value
            }),
          }),
          ...(this.formGroupHttpSecurity.get('httpSecurityClickjackProtectForm')?.value && { "frame_deny": this.formGroupHttpSecurity.get('httpSecurityClickjackProtectForm')?.value }),
          ...(this.formGroupHttpSecurity.get('httpSecurityHPKPForm')?.value && { "hpkp_public_key": this.formGroupHttpSecurity.get('httpSecurityHPKPForm')?.value }),
          ...(this.formGroupHttpSecurity.get('httpSecuritySSLOptForm')?.value && { "ssl_host": this.formGroupHttpSecurity.get('httpSecuritySSLOptForm')?.value }),
          ...(this.formGroupHttpSecurity.get('httpSecuritySSLOptPortForm')?.value && { "ssl_port": this.formGroupHttpSecurity.get('httpSecuritySSLOptPortForm')?.value }),
          "ssl_proxy_headers": ssl_proxy_headers_values,
          ...(this.formGroupHttpSecurity.get('httpSecuritySSLOptForceSSLForm')?.value && { "ssl_redirect": this.formGroupHttpSecurity.get('httpSecuritySSLOptForceSSLForm')?.value }),

          // ...(this.formGroupHttpSecurity?.httpSecurityIncSubdomainForm &&{"sts_include_subdomains": this.formGroupHttpSecurity?.httpSecurityIncSubdomainForm}),
          ...(this.formGroupHttpSecurity.get('httpSecurityIncSubdomainForm')?.value && { "sts_include_subdomains": this.formGroupHttpSecurity.get('httpSecurityIncSubdomainForm')?.value }),

          // ...(this.formGroupHttpSecurity?.httpSecurityHSTSForm &&{"sts_seconds": this.formGroupHttpSecurity?.httpSecurityHSTSForm})
          ...(this.formGroupHttpSecurity.get('httpSecurityHSTSForm')?.value && { "sts_seconds": this.formGroupHttpSecurity.get('httpSecurityHSTSForm')?.value }),

        }
      }),

      ...(this.formGroupHttpSecurity.get('isBasicAuthActive')?.value && {
        "auth/basic": {
          "id": this.entireJsonData?.extra_config?.["auth/basic"]?.id ? this.entireJsonData?.extra_config?.["auth/basic"]?.id : null,
          ...(this.formGroupHttpSecurity.get('basicAuthHtpasswdPathForm')?.value && { "htpasswd_path": this.formGroupHttpSecurity.get('basicAuthHtpasswdPathForm')?.value })
        }
      })
    }

    console.log("******************httpbody", httpbody);

    if (this.formGroupHttpSecurity.valid) {
      this._snackBar.open('Saved Successfully', 'OK', {
        duration: 5000
      });

      // this.sharedService.setHttpSecurityData(this.formGroupHttpSecurity.value)
    }

    this.httpSecurityService.createData(this.krakendId, httpbody).subscribe({
      next: (res) => {
        console.log(res);
        this.showSuccess(res?.message);
        this.fetchkrakendJson()
      },
      error: (error) => {
        console.error(error);
        this.showError(error?.message)
        this.fetchkrakendJson()

      }
    })
    console.log("***************************************************");

  }




}
