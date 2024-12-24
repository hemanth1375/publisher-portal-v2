import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { ToastService } from '../services/toast.service';
import { BackendService } from '../services/backend.service';
import { CustomValidators } from '../shared/validators/custom-validators';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrl: './backend.component.css'
})
export class BackendComponent {

  bodyEditor_tooltip = "The response body you will return to the end-user. You can introduce the variables.resp_headers.xxx, .resp_headers.xxx (with no-op), .resp_status.xxx (with no-op), .resp_body.xxx,.req_params.Xxx, .req_headers.xxx, .req_querystring.xxx, .req_path";
  url_tooltip = "The endpoint of the backend server to query. Reuse here any &#123;parameters&#125;defined in the parent endpoint. Also see Header routing";
  decodeas_tooltip = "How to decode the response of the backend.";
  disSanitization_tooltip = "For non-HTTP hosts. If unsure, leave the proposed value.";
  staticUrl_tooltip = "The folder in the filesystem containing the static files. Relative to the working dir where KrakenD config is (e.g.: ./assets) or absolute (e.g.: /etc/krakend/assets).";
  directory_tooltip = "For non-HTTP hosts. If unsure, leave the proposed value.";
  contentType_tooltip = "The Content-Type that you are coding in the template. Defaults to application/json";
  debug_tooltip = "shows useful information in the logs with DEBUG level about the input received and the body generated. Do not enable in production."
  path_tooltip = "You can load the request from an external file instead of editing the template.";
  martian_tooltip = "Paste here your JSON configuration to be used in the martian modifier.";
  rootObj_tooltip = "Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces,special characters, or emoji.";
  collection_tooltip = "KrakenD expects an object as a response in json inside brackets, e.g:'status':'OK' but if the backend returns a collection instead (e.g: [ 'a', 'b' ]) check this option.The collection will be returned inside the collection attribute. Use the renaming below to rename it to anything else."
  allowDeny_tooltip = "If you want to filter the response, choose between allowing or denying attributes.If both are set, allowing will be used. If it's the same for you, denying performs much better"
  wrappingGroup_tooltip = "Fill only if you want to capture all the response and encapsulate inside an attribute name."
  sharedCache_tooltip = "Allow cached entries to be reused in different backend definitions when possible.";
  expression_tooltip = "JMESpath query to execute on returned results of /"
  bodyEditorRes_tooltip = "The response body you will return to the end-user. You can introduce the variables.resp_headers.xxx, .resp_headers.xxx (with no-op), .resp_status.xxx (with no-op), .resp_body.xxx,.req_params.Xxx, .req_headers.xxx, .req_querystring.xxx, .req_path"
  contentTypeRes_tooltip = "The Content-Type that you are coding in the template. Defaults to application/json";
  debudRes_tooltip = "shows useful information in the logs with DEBUG level about the input received and the body generated. Do not enable in production.";
  pathRes_tooltip = "The Content-Type that you are coding in the template. Defaults to application/json"
  contentReplacer_tooltip = "The find expression or literal you want to use";
  keyToReplace_tooltip = "Write the key of the object you would like to replace content."
  replaceBy_tooltip = "The literal string or expression you want to use as a replacement. You can use capture groups with $1, $2, etc."
  regexMode_tooltip = "Check if you want to use regular expression instead of a literal string (faster)."
  bodyEditorMartian_tooltip = "Paste here your JSON configuration to be used in the martian modifier."
  circuitName_tooltip = "How this circuit breaker is shown in the logging.A friendly name to follow this circuit breaker's activity in the logs.Example: 'cb-backend-1'";
  maxErrors_tooltip = "Consecutive failures from the backend to stop sending traffic to it";
  interval_tooltip = "Time window where this circuit breaker counts errors";
  renaming_tooltip = "You can rename any attributes returned by the backend and use a name more convenient for you."
  timeout_tooltip = "Time to wait before stressing again a failing backend";
  logStatusChange_tooltip = "Write in the logs when the circuit changes its state (open/closed).";
  maxRateLimit_tooltip = "Maximum requests you want to let this backend handle in the specified time (every)";
  everyThrot_tooltip = "Time window where this rate limit applies.";
  capacityThrot_tooltip = "Recommended value capacity=max_rate. A token bucket algorithm is used with a bucket capacity == tokens added per second. KrakenD is able to allow bursting on the request rates.";
  clientId_tooltip = "The Client ID as it will provided to the Auth server";
  clientSecret_tooltip = "The Client secret as it will provided to the Auth server";
  tokenUrl_tooltip = "The URL where the negotiation of the token will happen";
  scopes_tooltip = "Comma separated list of scopes needed.";
  objEndpointParameter_tooltip = "You can rename any attributes returned by the backend and use a name more convenient for you."
  audienceAuth_tooltip = "The audience in GCP looks like an URL, and contains the destination service you will ask a token for. Most of the times this URL will match exactly with the host entry. Credentials are taken from the environment variable GOOGLE_APPLICATION_CREDENTIALS, which Cloud Run passes automatically."
  user_tooltip = "The proxy address used to forward the traffic. The address must contain the protocol and the port."
  password_tooltip = "The proxy address used to forward the traffic. The address must contain the protocol and the port."
  reqpolicies_tooltip = "Policy. Example: hasQuerystring('q')";
  reqErrCode_tooltip = "Returned status on violated policy";
  reqErrBody_tooltip = "Empty string to return the validation error, or write a string with the error response body. You can add escaped JSON, XML, etc in the string and add a Content-Type."
  reqContentType_tooltip = "The Content-Type header you'd like to send with the error response. When unset, uses text/plain by default.";
  resPolicies_tooltip = "Policy. Example: hasQuerystring('q')";
  resErrCode_tooltip = "Returned status on violated policy";
  resErrBody_tooltip = "mpty string to return the validation error, or write a string with the error response body. You can add escaped JSON, XML, etc in the string and add a Content-Type."
  resErrContentType_tooltip = "The Content-Type header you'd like to send with the error response. When unset, uses text/plain by default."
  jwtPolicies_tooltip = "Policy. Example:has(JWT.user_id) && 'legal' == JWT.department";
  jwtDebug_tooltip = "Evaluation results are printed in the console.";
  autoJoinPolicies_tooltip = "All policies concatenate with an AND operation to evaluate a single expression. Faster, but harder to debug.";
  disableMacros_tooltip = "Advanced macros can be disabled when not used for a faster evaluation.";
  errMessage_tooltip = "The error message you want to show when the validation fails. Leave it empty to show the JSON-schema validation error.";
  errStatusCode_tooltip = "The HTTP status code you want to set back in the response."
  bodyEditConn_tooltip = "The response body you will return to the end-user. You can introduce the variables.resp_headers.xxx, .resp_headers.xxx (with no-op), .resp_status.xxx (with no-op), .resp_body.xxx,.req_params.Xxx, .req_headers.xxx, .req_querystring.xxx, .req_path";
  contentTypeConn_tooltip = "The Content-Type that you are coding in the template. Defaults to application/json";
  enableDebugConn_tooltip = "shows useful information in the logs with DEBUG level about the input received and the body generated. Do not enable in production."
  pathConn_tooltip = "The Content-Type that you are coding in the template. Defaults to application/json";
  connectWebProxy_tooltip = "The proxy address used to forward the traffic. The address must contain the protocol and the port."
  redirectConn_tooltip = "Check if you don't want KrakenD to follow redirects and let <br> the consuming user to receive the 30x status code.";
  restToGraphType_tooltip = "The type of query you are declaring.";
  restToGraphName_tooltip = "A meaningful and explicit name for your operation, required in multi-operation documents and for helpful debugging and server-side logging.";
  restToGraphQueryPath_tooltip = "Path to the file containing the query. This file is loaded during startup and never checked again, if it changes KrakenD will be unaware of it.";
  restToGraphInlineQuery_tooltip = "An inline GraphQL query you want to send to the server. Use this attribute for simple and inline queries, use query_path instead for larger queries. Use escaping when needed.";
  restToGraphvarValue_tooltip = "A dictionary defining all the variables sent to the GraphQL server. You can use {placeholders} to inject parameters from the endpoint URL. In the example above, the GraphQL server receives a variable user with the {user_id} declared in the endpoint. The dictionary can have any nesting level you need, but nested variables cannot contain {placeholders}."
  amqpConsName_tooltip = "The name of the queue you want to connect to";
  amqpConExchange_tooltip = "The entity name where messages are <br> sent for routing";
  amqpConoperationType_tooltip = "The type of query you are declaring.";
  amqpRoutKeys_tooltip = "List of all the routing keys or pattern to bind the queue to the exchange";
  amqpConPrefetch_tooltip = "Specifies a prefetch window in terms of whole messages";
  amqpConDurable_tooltip = "Durable exchanges survive broker restart (persist to disk) whereas transient exchanges do not";
  amqpConNoLocal_tooltip = "The server will not send messages to the connection that published them.";
  awsLambdaFunc_tooltip = "Name of the lambda function as saved in the AWS service. Leave EMPTY if taken from a parameter.";
  awsLambdaFuncParam_tooltip = "When the lambda function name comes in a {placeholder} inside the endpoint.";
  awsLambdaRegion_tooltip = "The AWS identifier region (e.g.: us-east-1, eu-west-2, etc.)";
  awsMaxRetries_tooltip = "Maximum times you want to execute the function until you have a successful response.";
  awsLambdaEndpoint_tooltip = "An optional parameter to customize the Lambda endpoint to call. Useful when Localstack is used for testing.";
  restToGrpcReqNameCon_tooltip = "Defines the naming convention used to format the data.";
  restToGrpcResNameCon_tooltip = "Defines the naming convention used to format the data.";
  restToGrpcUserReqBody_tooltip = "Enables the use of the sent body to fill the gRPC request.";
  restToGrpcAllowInsecure_tooltip = "Allow untrusted certificates in development stage.";
  restToGrpcRemoveUnset_tooltip = "When the response has missing fields from the  definition, they are returned with default values. Setting this flag to true removes those fields from the response, while setting it to false or not setting it, returns all the fields in the definition.";
  restToGrpcEnumasString_tooltip = "Enum types are returned as numeric values (flag set to false). Set this flag to true to return the string representation of the enum value. For instance, an enum representing allergies, such as ['NUTS', 'MILK', ' SOY', 'WHEAT'] would return a value SOY when this flag is true, or 2 when false.";
  restToGrpcTimestampAsString_tooltip = "Well-known Timestamp types (google.protobuf.Timestamp) are returned as a struct containing fields with seconds and nanos fields (flag set to false). Setting this flag to true transforms the timestamps into a string representation in RFC3999 format.";
  restToGrpcDurationAsString_tooltip = "Well-known Duration types (google.protobuf.Duration) are returned as a struct containing fields with seconds and nanos fields (flag set to false). Setting this flag to true transforms the timestamps into a string representation in seconds.";
  restToGrpcDisableQuery_tooltip = "When checked it does not use URL parameters or query strings to fill the gRPC payload to send. If you don't set request body, there will be no input used for the gRPC message (it's fine if you want an empty message)";
  restToGrpcInputMap_tooltip = "A dictionary that converts the user input into a different field during the backend request.";
  pubSubType_tooltip = "Click on a subscription_url type to load an example URL.";
  pubSubUrl_tooltip = "The subscription URL. See the pub/sub documentation for all supported protocols";
  pubSubPublisherType_tooltip = "Click on a subscription_url type to load an example URL.";
  pubSubPublisherUrl_tooltip = "The subscription URL. See the pub/sub documentation for all supported protocols";
  amqpProName_tooltip = "The name of the queue you want to connect to";
  amqpProExchange_tooltip = "The entity name where messages are sent for routing";
  amqpProBackoffst_tooltip = "When the connection to your event source gets interrupted for whatever reason, KrakenD keeps trying to reconnect after a delay";
  amqpProDurable_tooltip = "Durable exchanges survive broker restart whereas transient exchanges do not";


  panelOpenState = false;
  mainUrl: any;
  mainMethod: any;
  mainHost: any;
  // items=[
  //   {name:'abc',id:1},
  //   {name:'abcd',id:2},
  //   {name:'abcde',id:3},
  // ]
  // addPanel() {
  //   const newPanel = {
  //     id: this.items.length + 1, 
  //     name: `Panel ${this.items.length + 1}`
  //   };
  //   this.items.push(newPanel);
  // }
  formGroupUpstreamRequest: FormGroup | any;

  // response manipulation
  deniedAttributesArr: any[] = [];
  allowedAttributesArr: string[] = [];
  faltMapArr: any[] = [];
  itemsRes: any;
  formGroupResManipulation: FormGroup | any;
  objectMap: Map<string, string> = new Map();
  objectMapAuth: Map<string, string> = new Map();
  isKeyCreated: boolean = false;

  // policies
  parameterArraySecReqPolicy: any = [];
  parameterArraySecResPolicy: any = [];
  parameterArrayJwtValReqPolicy: any = [];

  // connectivity options
  amqpRoutingKeysArray: any[] = [];

  objectMapConnect: Map<string, string> = new Map();
  objectMapConnectRestToGraph: Map<string, string> = new Map();

  jsonData = {
    "students": [
      { "name": "Bill", "age": 23 },
      { "name": "Mary", "age": 16 },
      { "name": "Jessica", "age": 19 }
    ]
  };

  selectedItem: any;

  selectItem(item: any) {
    console.log(item);
    this.selectedItem = item;
  }


  formArray: FormArray; // Holds a FormGroup for each panel
  items: any[] = []; // Items from the backend

  constructor(private fb: FormBuilder, private http: HttpClient, private mainSer: MainService, private route: ActivatedRoute, private router: Router, private communucationSer: CommunicationService, private toastService: ToastService, private backendser: BackendService) {
    this.itemsRes = [
      { name: 'Deny' },
      { name: 'Allow' },
    ];
    this.formArray = this.fb.array([]);
    // response manipulation
    // this.formArray.controls.forEach((_, index) => {
    //   this.applyDynamicLogic(index);
    // });
  }
  // patchRenamingObj(formGroupIndex: number, renamingObj: Record<string, string>) {
  //   // Convert renamingObj (object) to array of key-value pairs
  //   const mapArray = Object.entries(renamingObj);

  //   // Update the objectMap
  //   this.objectMap.clear(); // Clear existing map to avoid duplicates
  //   mapArray.forEach(([key, value]) => this.objectMap.set(key, value));

  //   // Patch the mapArray to the form control
  //   this.getFormGroup(formGroupIndex).get('objectMapValue')?.setValue(mapArray);
  // }

  applyDynamicLogic(group: any, index: number): void {
    // const formGroup = this.getFormGroup(index);

    // Disable 'path' field initially
    group.get('path')?.disable();

    // Watch 'isCollection' changes and enable/disable 'rootObject'
    group.get('isCollection')?.valueChanges.subscribe((isChecked: any) => {
      const rootObjectControl = group.get('rootObject');
      if (isChecked) {
        rootObjectControl?.disable();
      } else {
        rootObjectControl?.enable();
      }
    });


  }

  endpointId: any;
  // ngOnInit(): void {
  //   this.fetchItemsFromBackend();
  //   this.selectedItem = this.itemsRes[0];
  //   this.route.parent?.paramMap.subscribe((params:any) => {
  //     this.endpointId = params.get('id');
  //     console.log('Parent ID:', this.endpointId);
  //   });

  // }
  ngOnInit(): void {
    this.selectedItem = this.itemsRes[0];
    this.route.parent?.paramMap.subscribe((params: any) => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);

      // Fetch items only after the endpointId is set
      if (this.endpointId) {
        this.fetchItemsFromBackend();

      }
    });

  }


  fetchItemsFromBackend() {
    this.mainSer.getEndpoint(this.endpointId).subscribe((data: any) => {
      this.items = data.backend.map((item: any) => ({ ...item, isNew: false })); // Mark all as existing
      this.initializeFormGroups();
    });
  }
 
  initializeFormGroups() {
    this.items.forEach((item, index) => {
      console.log(item);
      const flatmapFilters = item.flatmap_filter || [];

      const group = this.fb.group({
        id: [item.id],
        extraConfigId: [item?.extra_config?.id],
        httpClientConnectId: [item?.extra_config?.['backend/http/client']?.id],
        regExContentReplacerPluginId: [item?.extra_config?.['plugin/req-resp-modifier']?.id],
        proxyId: [item?.extra_config?.['proxy']?.id],

        isStaticServerActive: [!!item?.extra_config?.['backend/static-filesystem']],
        isBodymanipulationActive: [!!item?.extra_config?.['modifier/body-generator']],
        isMartianActive: [!!item?.extra_config?.['modifier/martian']],
        sanitization: [item?.disable_host_sanitize],
        method: [item?.method],
        endpointUrl: [item?.url_pattern],
        decodeAs: [item?.encoding],
        staticUrl: [item?.extra_config?.['backend/static-filesystem']?.path],
        directory_Listing: [item?.extra_config?.['backend/static-filesystem']?.directory_listing],
        bodyEditor: [item?.extra_config?.['modifier/body-generator']?.path ? "external" : "bodyeditor"],
        template: [item?.extra_config?.['modifier/body-generator']?.template,[CustomValidators.jsonValidator()]],
        contentType: [item?.extra_config?.['modifier/body-generator']?.content_type],
        debug: [item?.extra_config?.['modifier/body-generator']?.debug],
        path: [item?.extra_config?.['modifier/body-generator']?.path],
        martianDslTextarea: [item?.extra_config?.['modifier/martian'],[CustomValidators.jsonValidator()]],
        host: [''],
        hostArrayValue: [item?.host ?? []],

        // response manipulation
        isCollection: [item?.is_collection],
        rootObject: [{ value: item.rootObject, disabled: false }],
        deniedAttr: [item?.deny ?? []],
        allowedAttr: [item.allowedAttr],
        deniedAttributesArrValue: [item?.deny],
        allowedAttributesArrValue: [item?.allow],
        wrappingGroup: [item?.group],
        originalObj: [''],
        renamedObj: [''],
        objectMapValue: [[]],
        isCachingActive: [!!item?.extra_config?.['qos/http-cache']],
        isSharedCacheActive: [item?.extra_config?.['qos/http-cache']?.shared],
        AdvResManipulationActive: [item?.extra_config?.["modifier/jmespath"]],
        resManiWithGoTemplActive: [item?.extra_config?.["modifier/response-body-generator"]],

        expression: [item?.extra_config?.["modifier/jmespath"]?.expr],


        bodyEditorResponse: [item?.extra_config?.["modifier/response-body-generator"]?.path ? "externalResponse" : "bodyeditorResponse"],
        templateResponse: [item?.extra_config?.["modifier/response-body-generator"]?.template,[CustomValidators.jsonValidator()]],
        contentTypeResponse: [item?.extra_config?.["modifier/response-body-generator"]?.content_type],
        debugResponse: [item?.extra_config?.["modifier/response-body-generator"]?.debug],
        pathResponse: [item?.extra_config?.["modifier/response-body-generator"]?.path],

        contentReplacer: this.fb.group({}),
        contentReplacerKey: [''],


        regexConReplacerActive: [item?.extra_config?.["plugin/req-resp-modifier"]?.name.includes('content-replacer')],


        operationType: [item.operationType],
        // flatmapTargetObj:[item.flatmapTargetObj],
        // flatmapOriginalObj:[item.flatmapOriginalObj],
        // flatmapFilterArr:[[]],
        flatmapFilterArr: [flatmapFilters.map((filter: any) => ({ ...filter }))],
        flatmapOriginalObj: [''],
        flatmapTargetObj: [''],
        martianActive: [item.martianActive],
        martian: [item.martian],
        // throttling
        isCircuitBreakerActive: [!!item?.extra_config?.["qos/circuit-breaker"]],
        isProxyRateLimitActive: [!!item?.extra_config?.["qos/ratelimit/proxy"]],
        circuitBreakerName: [item?.extra_config?.["qos/circuit-breaker"]?.name],
        maxError: [item?.extra_config?.["qos/circuit-breaker"]?.max_errors],
        interval: [item?.extra_config?.["qos/circuit-breaker"]?.interval],
        timeout: [item.extra_config?.["qos/circuit-breaker"]?.timeout],
        maxRateLimit: [item?.extra_config?.["qos/ratelimit/proxy"]?.max_rate],
        every: [item?.extra_config?.["qos/ratelimit/proxy"]?.every],
        capacity: [item?.extra_config?.["qos/ratelimit/proxy"]?.capacity],
        logStatusChange: [item?.extra_config?.["qos/circuit-breaker"]?.log_status_change],

        // authentication
        clientId: [item?.extra_config?.["auth/client-credentials"]?.client_id],
        clientSecret: [item?.extra_config?.["auth/client-credentials"]?.client_secret],
        tokenUrl: [item?.extra_config?.["auth/client-credentials"]?.token_url],
        scopes: [item?.extra_config?.["auth/client-credentials"]?.scopes],
        audience: [item?.extra_config?.["auth/gcp"]?.audience],
        user: [item?.extra_config?.["auth/ntlm"]?.user],
        password: [item?.extra_config?.["auth/ntlm"]?.password],
        isAuthActive: [!!item?.extra_config?.["auth/client-credentials"]],
        isGoogleCloudActive: [item?.extra_config?.["auth/gcp"]],
        isNtlmAuthActive: [item?.extra_config?.["auth/ntlm"]],
        objectMapValueAuth: [[]],
        endpointValue: [''],
        endpointKey: [''],
        // policies
        isSecPolicyActive: [!!item?.extra_config?.["security/policies"]],
        isResSchValidatorActive: [!!item?.extra_config?.["plugin/req-resp-modifier"]?.name.includes("response-schema-validator")],
        securityReqPolicy: [item.securityReqPolicy],
        secReqErrorStCode: [item?.extra_config?.["security/policies"]?.req?.error?.status],
        secReqErrorBody: [item?.extra_config?.["security/policies"]?.req?.error?.body],
        secReqErrorContentType: [item?.extra_config?.["security/policies"]?.req?.error?.content_type],
        securityResPolicy: [item.securityResPolicy],
        secResErrorStCode: [item?.extra_config?.["security/policies"]?.resp?.error?.status],
        secResErrorBody: [item?.extra_config?.["security/policies"]?.resp?.error?.body],
        secResErrorContentType: [item?.extra_config?.["security/policies"]?.resp?.error?.content_type],
        jwtReqPolicy: [item.jwtReqPolicy],
        enableDebug: [item?.extra_config?.["security/policies"]?.debug],
        autoJoinPolicies: [item?.extra_config?.["security/policies"]?.auto_join_policies],
        disableMacros: [item?.extra_config?.["security/policies"]?.disable_macros],
        resSchemaValErrorMsg: [item.resSchemaValErrorMsg],
        resSchemaValErrorStCode: [item.resSchemaValErrorStCode],
        secReqPolicyArrayValue: [item?.extra_config?.["security/policies"]?.req?.policies ?? []],
        secResPolicyArrayValue: [item?.extra_config?.["security/policies"]?.resp?.policies ?? []],
        jwtReqPolicyArrayValue: [item?.extra_config?.["security/policies"]?.jwt?.policies ?? []],
        responseSchema: [item.responseSchema],
        // connectivity options
        isRestToSoapActive: [!!item?.extra_config?.["backend/soap"]],
        isHttpClientSettingActive: [item?.extra_config?.["backend/http/client"]],
        isRestToGraphqlActive: [!!item?.extra_config?.["backend/graphql"]],
        isAMQPconsumerActive: [item?.extra_config?.["backend/amqp/consumer"]],
        isAWSlambdaActive: [!!item?.extra_config?.["backend/lambda"]],
        isrestToGRPCActive: [!!item?.extra_config?.["backend/grpc"]],
        isPublicSubscriberActive: [!!item.extra_config?.["backend/pubsub/susbcriber"]],
        isPublicPublisherActive: [!!item.extra_config?.["backend/pubsub/publisher"]],
        isAMQPproducerActive: [!!item.extra_config?.["backend/amqp/producer"]],

        bodyEditorConnect: [item?.extra_config?.["backend/soap"]?.path ? "externalConnect" : "bodyeditorConnect"],
        templateConnect: [item?.extra_config?.["backend/soap"]?.template,[CustomValidators.jsonValidator()]],
        contentTypeConnect: [item?.extra_config?.["backend/soap"]?.content_type],
        debugConnect: [item?.extra_config?.["backend/soap"]?.debug],
        pathConnect: [item?.extra_config?.["backend/soap"]?.path],

        connectvWebProxyForm: [item?.extra_config?.["backend/http/client"]?.proxy_address],
        donotFollowRedirectsForm: [item?.extra_config?.["backend/http/client"]?.no_redirect],

        objectMapValueConnect: [item.objectMapValueConnect],
        objectMapValueConnectRestToGraph: [item.objectMapValueConnectRestToGraph],

        restTogrpcReqNamingConventionForm: [item?.extra_config?.["backend/grpc"]?.request_naming_convention],
        restTogrpcResNamingConventionForm: [item?.extra_config?.["backend/grpc"]?.response_naming_convention],
        restTogrpcUseReqBodyForm: [item?.extra_config?.["backend/grpc"]?.use_request_body],
        restTogrpcAllowInsecureConForm: [item?.extra_config?.["backend/grpc"]?.allow_insecure_connections],
        restTogrpcRemoveUnsetValForm: [item?.extra_config?.["backend/grpc"]?.output_remove_unset_values],
        restTogrpcEnumsAsStrgsForm: [item?.extra_config?.["backend/grpc"]?.output_enum_as_string],
        restTogrpcTimestmpAsStrgsForm: [item?.extra_config?.["backend/grpc"]?.output_timestamp_as_string],
        restTogrpcDurationAsStrgsForm: [item?.extra_config?.["backend/grpc"]?.output_duration_as_string],
        restTogrpcDisableQueryParamForm: [item?.extra_config?.["backend/grpc"]?.disable_query_params],

        restTogprcInputMappingFieldForm: [item.restTogprcInputMappingFieldForm],
        restTogprcInputMappingMapAsForm: [item.restTogprcInputMappingMapAsForm],

        restTographQLOpTypeForm: [item?.extra_config?.["backend/graphql"]?.type],
        restTographQLInlineQueryForm: [item?.extra_config?.["backend/graphql"]?.query],
        restToGraphqlOpNameForm: [item?.extra_config?.["backend/graphql"]?.operationName],
        restTographQLQueryPathForm: [item?.extra_config?.["backend/graphql"]?.query_path],
        restTographQLVariable: [item?.restTographQLVariable],
        restTographQLValue: [item?.restTographQLValue],


        amqpConsumerQueueNameForm: [item?.extra_config?.["backend/amqp/consumer"]?.name],
        amqpConsumerExchangeForm: [item?.extra_config?.["backend/amqp/consumer"]?.exchange],
        amqpConsumerBackOffStratgyForm: [item?.extra_config?.["backend/amqp/consumer"]?.backoff_strategy],
        amqpConsumerRoutingKeysForm: [''],
        amqpConsumerRoutingKeysFormArray: [item?.extra_config?.["backend/amqp/consumer"]?.routing_key],
        amqpConsumerPrefetchCntForm: [item?.extra_config?.["backend/amqp/consumer"]?.prefetch_count],
        amqpConsumerDurableForm: [item?.extra_config?.["backend/amqp/consumer"]?.durable],
        amqpConsumerNoLocalForm: [item?.extra_config?.["backend/amqp/consumer"]?.no_local],
        // amqpRoutingKeysArray:[item.amqpRoutingKeysArray], 

        awsLambdaFunctionNameForm: [item?.extra_config?.["backend/lambda"]?.function_name],
        awsLambdaFunctionParamNameForm: [item?.extra_config?.["backend/lambda"]?.function_param_name],
        awsLambdaRegionForm: [item?.extra_config?.["backend/lambda"]?.region],
        awsLambdaMaxRetriesForm: [item?.extra_config?.["backend/lambda"]?.max_retries],
        awsLambdaEndpointForm: [item?.extra_config?.["backend/lambda"]?.endpoint],




        publicSubSubscriptionTypeForm: [''],
        publicSubSubscriptionURLForm: [item?.extra_config?.["backend/pubsub/susbcriber"]?.subscription_url],
        publicPubSubscriptionTypeForm: [''],
        publicPubTopicURLForm: [item?.extra_config?.["backend/pubsub/publisher"]?.topic_url],
        amqpProducerQueueNameForm: [item?.extra_config?.["backend/amqp/producer"]?.name],
        amqpProducerExchangeForm: [item?.extra_config?.["backend/amqp/producer"]?.exchange],
        amqpProducerBackoffStrategyForm: [item?.extra_config?.["backend/amqp/producer"]?.backoff_strategy],
        amqpProducerDurableForm: [item?.extra_config?.["backend/amqp/producer"]?.durable]
      },
      {
          validators: [this.securityPoliciesValidator()],
      }
    );
      this.subscribeToValueChanges(group, index);
      this.applyDynamicLogic(group, index);
      this.formArray.push(group);
      this.hostArray.push(item.host ?? [])
      this.parameterArraySecReqPolicy.push(item?.extra_config?.["security/policies"]?.req?.policies ?? []),
        this.parameterArraySecResPolicy.push(item?.extra_config?.["security/policies"]?.resp?.policies ?? []),
        this.parameterArrayJwtValReqPolicy.push(item?.extra_config?.["security/policies"]?.jwt?.policies ?? [])
      this.amqpRoutingKeysArray.push(item?.extra_config?.["backend/amqp/consumer"]?.routing_key ?? []),
        this.objectMaps.push(new Map<string, string>());
      this.patchRenamingObj(index, item?.mapping);
      this.objectMapsAuth.push(new Map<string, string>());
      this.patchRenamingAuthObj(index, item?.extra_config?.["auth/client-credentials"]?.endpoint_params);
      this.objectMapsConnect.push(new Map<string, string>());
      this.patchRenamingConnectObj(index, item?.extra_config?.["backend/grpc"]?.input_mapping);
      this.objectMapsConnectRestToGraph.push(new Map<string, string>());
      this.patchRenamingConnectRestToGraphObj(index, item?.extra_config?.["backend/graphql"]?.variables);
      // this.faltMapArr[index].push(item?.extra_config?.proxy?.flatmap_filter)
      this.faltMapArr.push(item?.extra_config?.proxy?.flatmap_filter ?? []);
      // this.patchFlatMapArray(index,item?.extra_config?.proxy?.flatmap_filter ??[])
    });
  }
  securityPoliciesValidator() {
    return (formGroup: FormGroup) => {
      const isActive = formGroup.get('isSecPolicyActive')?.value;
      const reqPolicies = formGroup.get('secReqPolicyArrayValue')?.value || [];
      const resPolicies = formGroup.get('secResPolicyArrayValue')?.value || [];
      const jwtPolicies = formGroup.get('jwtReqPolicyArrayValue')?.value || [];
      if (!isActive) {
        return null;
      }
  
      if (reqPolicies.length || resPolicies.length || jwtPolicies.length) {
        return null; 
      }
  
      return { policyRequired: 'At least one of Request, Response, or JWT Policies must be provided.' };
      
    };
  }
  
  subscribeToValueChanges(group: any, index: any): void {

    console.log(this.formArray.controls.length);

    // this.formArray.controls.map((group, index) => {
    // console.log(group,index);
    // const group=this.getFormGroup(index)
    // bodyeditor
    group.get('bodyEditor')?.valueChanges.subscribe((value: any) => {
      console.log(`Value changed in FormGroup at index ${index}:`, value);
      const bodyEditorControl = group.get('template');
      const pathControl = group.get('path');

      if (value === 'bodyeditor') {
        bodyEditorControl?.enable();
        pathControl?.disable();
      } else if (value === 'external') {
        bodyEditorControl?.disable();
        pathControl?.enable();
      }
    });
    group.get('bodyEditorResponse')?.valueChanges.subscribe((value: any) => {
      console.log(`Value changed in FormGroup at index ${index}:`, value);
      const bodyEditorControl = group.get('templateResponse');
      const pathControl = group.get('pathResponse');

      if (value === 'bodyeditorResponse') {
        bodyEditorControl?.enable();
        pathControl?.disable();
      } else if (value === 'externalResponse') {
        bodyEditorControl?.disable();
        pathControl?.enable();
      }
    });
    group.get('bodyEditorConnect')?.valueChanges.subscribe((value: any) => {
      console.log(`Value changed in FormGroup at index ${index}:`, value);
      const bodyEditorControl = group.get('templateConnect');
      const pathControl = group.get('pathConnect');

      if (value === 'bodyeditorConnect') {
        bodyEditorControl?.enable();
        pathControl?.disable();
      } else if (value === 'externalConnect') {
        bodyEditorControl?.disable();
        pathControl?.enable();
      }
    });

    // validation
    group.get('isCircuitBreakerActive')?.valueChanges.subscribe((value:any) => {
      const maxErrorControl = group.get('maxError');
      const intervalControl = group.get('interval');
      const timeoutControl = group.get('timeout');
      
    
      if (value) {
        maxErrorControl?.setValidators([Validators.required]);
        intervalControl?.setValidators([Validators.required]);
        timeoutControl?.setValidators([Validators.required]);
       
      } else {
        maxErrorControl?.clearValidators();
        intervalControl?.clearValidators();
        timeoutControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [maxErrorControl, intervalControl, timeoutControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });
    group.get('isStaticServerActive')?.valueChanges.subscribe((value:any) => {
      const pathControl = group.get('staticUrl');
      
      
    
      if (value) {
        pathControl?.setValidators([Validators.required]);
       
      } else {
        pathControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [pathControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });
    group.get('AdvResManipulationActive')?.valueChanges.subscribe((value:any) => {
      const exprControl = group.get('expression');
      
      
    
      if (value) {
        exprControl?.setValidators([Validators.required]);
       
      } else {
        exprControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [exprControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });
    group.get('isGoogleCloudActive')?.valueChanges.subscribe((value:any) => {
      const audienceControl = group.get('audience');
      
      
    
      if (value) {
        audienceControl?.setValidators([Validators.required]);
       
      } else {
        audienceControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [audienceControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });

    group.get('isResSchValidatorActive')?.valueChanges.subscribe((value:any) => {
      const responseSchemaControl = group.get('responseSchema');
      
      
    
      if (value) {
        responseSchemaControl?.setValidators([Validators.required]);
       
      } else {
        responseSchemaControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [responseSchemaControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });

    group.get('isRestToGraphqlActive')?.valueChanges.subscribe((value:any) => {
      const restToGraphTypeControl = group.get('restTographQLOpTypeForm');
      const restToGraphQueryPathControl = group.get('restTographQLQueryPathForm');
      
      
    
      if (value) {
        restToGraphTypeControl?.setValidators([Validators.required]);
        restToGraphQueryPathControl?.setValidators([Validators.required]);
       
      } else {
        restToGraphTypeControl?.clearValidators();
        restToGraphQueryPathControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [restToGraphTypeControl,restToGraphQueryPathControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });

    group.get('isNtlmAuthActive')?.valueChanges.subscribe((value:any) => {
      const userControl = group.get('user');
      const passwordControl = group.get('password');
      
      
    
      if (value) {
        userControl?.setValidators([Validators.required]);
        passwordControl?.setValidators([Validators.required]);
       
      } else {
        userControl?.clearValidators();
        passwordControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [userControl,passwordControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });

    group.get('isPublicPublisherActive')?.valueChanges.subscribe((value:any) => {
      const topicUrlControl = group.get('publicPubTopicURLForm');
      
      
    
      if (value) {
        topicUrlControl?.setValidators([Validators.required]);
       
      } else {
        topicUrlControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [topicUrlControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });

    group.get('isPublicSubscriberActive')?.valueChanges.subscribe((value:any) => {
      const pubSubUrlControl = group.get('publicSubSubscriptionURLForm');
      
      
    
      if (value) {
        pubSubUrlControl?.setValidators([Validators.required]);
       
      } else {
        pubSubUrlControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [pubSubUrlControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });

    group.get('isAMQPconsumerActive')?.valueChanges.subscribe((value:any) => {
      const amqpNameControl = group.get('amqpConsumerQueueNameForm');
      const amqpExchangeControl = group.get('amqpConsumerExchangeForm');
      const amqpRoutingKeysArrayControl = group.get('amqpConsumerRoutingKeysFormArray');
      
      
    
      if (value) {
        amqpNameControl?.setValidators([Validators.required]);
        amqpExchangeControl?.setValidators([Validators.required]);
        amqpRoutingKeysArrayControl?.setValidators([Validators.required]);
       
      } else {
        amqpNameControl?.clearValidators();
        amqpExchangeControl?.clearValidators();
        amqpRoutingKeysArrayControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [amqpNameControl,amqpExchangeControl,amqpRoutingKeysArrayControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });

    group.get('isAMQPproducerActive')?.valueChanges.subscribe((value:any) => {
      const amqpProdExchangeControl = group.get('amqpProducerExchangeForm');
      const amqpProdNameControl = group.get('amqpProducerQueueNameForm');
      
      
    
      if (value) {
        amqpProdExchangeControl?.setValidators([Validators.required]);
        amqpProdNameControl?.setValidators([Validators.required]);
       
      } else {
        amqpProdExchangeControl?.clearValidators();
        amqpProdNameControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [amqpProdExchangeControl,amqpProdNameControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });
    group.get('isProxyRateLimitActive')?.valueChanges.subscribe((value:any) => {
      const maxRateLimitControl = group.get('maxRateLimit');
      const everyControl = group.get('every');
      const capacityControl = group.get('capacity');
      
    
      if (value) {
        maxRateLimitControl?.setValidators([Validators.required]);
        everyControl?.setValidators([Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")]);
        capacityControl?.setValidators([Validators.required]);
       
      } else {
        maxRateLimitControl?.clearValidators();
        everyControl?.clearValidators();
        capacityControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [maxRateLimitControl, everyControl, capacityControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });


    group.get('isAuthActive')?.valueChanges.subscribe((value:any) => {
      const clientIdControl = group.get('clientId');
      const clientsecretControl = group.get('clientSecret');
      const tokenUrlControl = group.get('tokenUrl');
      
    
      if (value) {
        clientIdControl?.setValidators([Validators.required]);
        clientsecretControl?.setValidators([Validators.required]);
        tokenUrlControl?.setValidators([Validators.required]);
       
      } else {
        clientIdControl?.clearValidators();
        clientsecretControl?.clearValidators();
        tokenUrlControl?.clearValidators();
        
      }
    
      // Update the validity of all controls
      [clientIdControl, clientsecretControl, tokenUrlControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });
    // });
  }
  showBackend: boolean = true;
  addPanel() {
    const newItem = {
      mainUrl: this.mainUrl,
      mainMethod: this.mainMethod,
      mainHost: this.mainHost,
      id: null,
      extraConfigId: null,
      httpClientConnectId: null,
      regExContentReplacerPluginId: null,
      proxyId: null,
      isStaticServerActive: false,
      isBodymanipulationActive: false,
      isMartianActive: false,
      sanitization: false,
      method: null,
      endpointUrl: null,
      decodeAs: null,
      staticUrl: null,
      directory_Listing: false,
      bodyEditor: 'bodyeditor',
      template: '',
      contentType: '',
      debug: false,
      path: '',
      martianDslTextarea: null,
      host: null,
      hostArrayValue: [],

      // response manipulation
      isCollection: false,
      rootObject: '',
      deniedAttr: [],
      allowedAttr: [],
      deniedAttributesArrValue: [],
      allowedAttributesArrValue: [],
      wrappingGroup: '',
      originalObj: '',
      renamedObj: '',
      objectMapValue: [],

      isCachingActive: false,
      isSharedCacheActive: false,
      AdvResManipulationActive: false,
      resManiWithGoTemplActive: false,

      expression: '',


      bodyEditorResponse: 'bodyeditorResponse',
      templateResponse: '',
      contentTypeResponse: '',
      debugResponse: false,
      pathResponse: '',

      contentReplacer: this.fb.group({}),
      contentReplacerKey: '',


      regexConReplacerActive: false,


      // operationType:'',
      // flatmapTargetObj:'',
      // flatmapOriginalObj:'',
      // flatmapFilterArr:[],
      flatmapFilterArr: [[]], // Initialize as empty array
      operationType: [''],
      flatmapOriginalObj: [''],
      flatmapTargetObj: [''],
      martianActive: false,
      martian: '',
      // throttling
      isCircuitBreakerActive: false,
      isProxyRateLimitActive: false,
      circuitBreakerName: null,
      maxError: '',
      interval: '',
      timeout: '',
      maxRateLimit: '',
      every: '',
      capacity: '',
      logStatusChange: false,
      // authentication
      clientId: null,
      clientSecret: null,
      tokenUrl: null,
      scopes: null,
      audience: null,
      user: null,
      password: null,
      isAuthActive: false,
      isGoogleCloudActive: false,
      isNtlmAuthActive: false,
      objectMapValueAuth: [],
      endpointValue: [],
      endpointKey: [],
      // policies
      isSecPolicyActive: false,
      isResSchValidatorActive: false,
      securityReqPolicy: null,
      secReqErrorStCode: null,
      secReqErrorBody: null,
      secReqErrorContentType: null,
      securityResPolicy: null,
      secResErrorStCode: null,
      secResErrorBody: null,
      secResErrorContentType: null,
      jwtReqPolicy: null,
      enableDebug: false,
      autoJoinPolicies: false,
      disableMacros: false,
      resSchemaValErrorMsg: null,
      resSchemaValErrorStCode: null,
      secReqPolicyArrayValue: [],
      secResPolicyArrayValue: [],
      jwtReqPolicyArrayValue: [],
      responseSchema: null,

      // connectivity options
      isRestToSoapActive: false,
      isHttpClientSettingActive: false,
      isRestToGraphqlActive: false,
      isAMQPconsumerActive: false,
      isAWSlambdaActive: false,
      isrestToGRPCActive: false,
      isPublicSubscriberActive: false,
      isPublicPublisherActive: false,
      isAMQPproducerActive: false,

      bodyEditorConnect: 'bodyeditorConnect',
      templateConnect: '',
      contentTypeConnect: '',
      debugConnect: false,
      pathConnect: '',

      connectvWebProxyForm: null,
      donotFollowRedirectsForm: false,

      objectMapValueConnect: [],
      objectMapValueConnectRestToGraph: [],

      restTogrpcReqNamingConventionForm: null,
      restTogrpcResNamingConventionForm: null,
      restTogrpcUseReqBodyForm: false,
      restTogrpcAllowInsecureConForm: null,
      restTogrpcRemoveUnsetValForm: false,
      restTogrpcEnumsAsStrgsForm: false,
      restTogrpcTimestmpAsStrgsForm: false,
      restTogrpcDurationAsStrgsForm: false,
      restTogrpcDisableQueryParamForm: null,

      restTogprcInputMappingFieldForm: null,
      restTogprcInputMappingMapAsForm: null,

      restTographQLOpTypeForm: null,
      restTographQLInlineQueryForm: '',
      restToGraphqlOpNameForm: '',
      restTographQLQueryPathForm: '',
      restTographQLVariable: '',
      restTographQLValue: '',


      amqpConsumerQueueNameForm: null,
      amqpConsumerExchangeForm: null,
      amqpConsumerBackOffStratgyForm: null,
      amqpConsumerRoutingKeysForm: [],
      amqpConsumerRoutingKeysFormArray: [],
      amqpConsumerPrefetchCntForm: null,
      amqpConsumerDurableForm: null,
      amqpConsumerNoLocalForm: null,
      amqpRoutingKeysArray: null,

      awsLambdaFunctionNameForm: null,
      awsLambdaFunctionParamNameForm: null,
      awsLambdaRegionForm: null,
      awsLambdaMaxRetriesForm: null,
      awsLambdaEndpointForm: null,




      publicSubSubscriptionTypeForm: null,
      publicSubSubscriptionURLForm: null,
      publicPubSubscriptionTypeForm: null,
      publicPubTopicURLForm: null,
      amqpProducerQueueNameForm: null,
      amqpProducerExchangeForm: null,
      amqpProducerBackoffStrategyForm: null,
      amqpProducerDurableForm: null,
      isNew: true
    };
    this.items.push(newItem);

    const newGroup = this.fb.group({
      mainUrl: [this.mainUrl, Validators.required],
      mainMethod: [this.mainMethod, Validators.required],
      mainHost: [this.mainHost, Validators.required],
      id: [null],
      extraConfigId: [null],
      httpClientConnectId: [null],
      regExContentReplacerPluginId: null,
      proxyId: null,
      // name: [''],
      isStaticServerActive: [false],
      isBodymanipulationActive: [false],
      isMartianActive: [false],
      sanitization: [false],
      method: [this.mainMethod],
      endpointUrl: [this.mainUrl],
      decodeAs: [null],
      staticUrl: [null],
      directory_Listing: [false],
      bodyEditor: ['bodyeditor'],
      template: ['',[CustomValidators.jsonValidator()]],
      contentType: [''],
      debug: [false],
      path: [''],
      martianDslTextarea: [null,[CustomValidators.jsonValidator()]],
      host: [this.mainHost],
      hostArrayValue: [[]],
      // response manipulation
      isCollection: [false],
      rootObject: [{ value: '', disabled: false }],
      deniedAttr: [[]],
      allowedAttr: [[]],
      deniedAttributesArrValue: [[]],
      allowedAttributesArrValue: [[]],
      wrappingGroup: [''],
      originalObj: [''],
      renamedObj: [''],
      objectMapValue: [[]],

      isCachingActive: [false],
      isSharedCacheActive: [false],
      AdvResManipulationActive: [false],
      resManiWithGoTemplActive: [false],

      expression: [''],


      bodyEditorResponse: ['bodyeditorResponse'],
      templateResponse: ['',[CustomValidators.jsonValidator()]],
      contentTypeResponse: [''],
      debugResponse: [false],
      pathResponse: [''],

      contentReplacer: this.fb.group({}),
      contentReplacerKey: [''],


      regexConReplacerActive: [false],


      operationType: [''],
      flatmapTargetObj: [''],
      flatmapOriginalObj: [''],
      flatmapFilterArr: [[]],
      martianActive: [false],
      martian: [''],
      // throttling
      isCircuitBreakerActive: [false],
      isProxyRateLimitActive: [false],
      circuitBreakerName: [null],
      maxError: [''],
      interval: [''],
      timeout: [''],
      maxRateLimit: [''],
      every: [''],
      capacity: [''],
      logStatusChange: [false],
      // authentication
      clientId: [null],
      clientSecret: [null],
      tokenUrl: [null],
      scopes: [null],
      audience: [null],
      user: [null],
      password: [null],
      isAuthActive: [false],
      isGoogleCloudActive: [false],
      isNtlmAuthActive: [false],
      objectMapValueAuth: [[]],
      endpointValue: [],
      endpointKey: [],

      // policies
      isSecPolicyActive: [false],
      isResSchValidatorActive: [false],
      securityReqPolicy: [null],
      secReqErrorStCode: [null],
      secReqErrorBody: [null],
      secReqErrorContentType: [null],
      securityResPolicy: [null],
      secResErrorStCode: [null],
      secResErrorBody: [null],
      secResErrorContentType: [null],
      jwtReqPolicy: [null],
      enableDebug: [false],
      autoJoinPolicies: [false],
      disableMacros: [false],
      resSchemaValErrorMsg: [null],
      resSchemaValErrorStCode: [null],
      secReqPolicyArrayValue: [[]],
      secResPolicyArrayValue: [[]],
      jwtReqPolicyArrayValue: [[]],
      responseSchema: [null],
      // connectivity options
      isRestToSoapActive: [false],
      isHttpClientSettingActive: [false],
      isRestToGraphqlActive: [false],
      isAMQPconsumerActive: [false],
      isAWSlambdaActive: [false],
      isrestToGRPCActive: [false],
      isPublicSubscriberActive: [false],
      isPublicPublisherActive: [false],
      isAMQPproducerActive: [false],

      bodyEditorConnect: ['bodyeditorConnect'],
      templateConnect: ['',[CustomValidators.jsonValidator()]],
      contentTypeConnect: [''],
      debugConnect: [false],
      pathConnect: [''],

      connectvWebProxyForm: [null],
      donotFollowRedirectsForm: [false],

      objectMapValueConnect: [[]],
      objectMapValueConnectRestToGraph: [[]],

      restTogrpcReqNamingConventionForm: [null],
      restTogrpcResNamingConventionForm: [null],
      restTogrpcUseReqBodyForm: [false],
      restTogrpcAllowInsecureConForm: [null],
      restTogrpcRemoveUnsetValForm: [false],
      restTogrpcEnumsAsStrgsForm: [false],
      restTogrpcTimestmpAsStrgsForm: [false],
      restTogrpcDurationAsStrgsForm: [false],
      restTogrpcDisableQueryParamForm: [null],
      restTogprcInputMappingFieldForm: [null],
      restTogprcInputMappingMapAsForm: [null],
      restTographQLOpTypeForm: [null],
      restTographQLInlineQueryForm: [],
      restToGraphqlOpNameForm: [],
      restTographQLQueryPathForm: [],
      restTographQLVariable: [],
      restTographQLValue: [],
      amqpConsumerQueueNameForm: [null],
      amqpConsumerExchangeForm: [null],
      amqpConsumerBackOffStratgyForm: [null],
      amqpConsumerRoutingKeysForm: [],
      amqpConsumerRoutingKeysFormArray: [[]],
      amqpConsumerPrefetchCntForm: [null],
      amqpConsumerDurableForm: [null],
      amqpConsumerNoLocalForm: [null],
      amqpRoutingKeysArray: [null],
      awsLambdaFunctionNameForm: [null],
      awsLambdaFunctionParamNameForm: [null],
      awsLambdaRegionForm: [null],
      awsLambdaMaxRetriesForm: [null],
      awsLambdaEndpointForm: [null],
      publicSubSubscriptionTypeForm: [null],
      publicSubSubscriptionURLForm: [null],
      publicPubSubscriptionTypeForm: [null],
      publicPubTopicURLForm: [null],
      amqpProducerQueueNameForm: [null],
      amqpProducerExchangeForm: [null],
      amqpProducerBackoffStrategyForm: [null],
      amqpProducerDurableForm: [null]
    },
    {
      validators: [this.securityPoliciesValidator()],
  });
    this.mainHost = null;
    this.mainUrl = null;
    this.mainMethod = null;
    this.formArray.push(newGroup);
    this.hostArray[this.formArray.length - 1] = [];
    this.hostArray[this.formArray.length - 1].push(newGroup?.get('host')?.value);
    this.updateParametersArrayRequest(this.formArray.length - 1);
    this.parameterArraySecReqPolicy[this.formArray.length - 1] = [];
    this.parameterArraySecResPolicy[this.formArray.length - 1] = [];
    this.parameterArrayJwtValReqPolicy[this.formArray.length - 1] = [];
    this.amqpRoutingKeysArray[this.formArray.length - 1] = [];

    this.objectMaps.push(new Map<string, string>());
    this.objectMapsAuth.push(new Map<string, string>());
    this.objectMapsConnect.push(new Map<string, string>());
    this.objectMapsConnectRestToGraph.push(new Map<string, string>());
    this.faltMapArr[this.formArray.length - 1] = [];
    // this.objectMaps[this.formArray.length-1].set(new Map<string, string>())
    this.subscribeToValueChanges(newGroup, this.formArray.length - 1)
    this.applyDynamicLogic(newGroup, this.formArray.length - 1);
    console.log(this.objectMaps);
  }

  showSuccess(message: string) {
    this.toastService.show(message, { type: "success" })
  }
  showError(message: string) {
    this.toastService.show(message, { type: "error" })
  }
  // ribbons
  successMessage:any;
  errorMessage:any;
  closeAlert(type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = '';
    } else {
      this.errorMessage = '';
    }
  }
 
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
  saveBackend(index: number) {
    const formGroup = this.getFormGroup(index);
    const data = formGroup.value;
    console.log(data);
    const renamingObj = data?.objectMapValue?.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    const inputMapObjConnectRestToGrpc = data?.objectMapValueConnect?.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    const inputMapObjConnectRestToGraphql = data?.objectMapValueConnectRestToGraph?.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    const endpointMapObj = data?.objectMapValueAuth?.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    console.log(data?.objectMapValue);
    
    const backendBody =
    {
      "id": null,
      "host": data?.hostArrayValue,
      "url_pattern": data?.endpointUrl,
      ...((this.selectedItem.name==="Allow" && data?.allowedAttributesArrValue?.length > 0 ) &&{"allow": data?.allowedAttributesArrValue}),
      ...(data?.objectMapValue?.length>0 && { "mapping": renamingObj }),
      ...(data?.wrappingGroup &&{"group": data?.wrappingGroup}),
      ...(data?.isCollection &&{"is_collection": data?.isCollection}),
      ...(data?.decodeAs &&{"encoding": data?.decodeAs}),
      "extra_config": {
        "id": null,
        ...(data?.isCircuitBreakerActive && {
          "qos/circuit-breaker": {
            ...(data?.interval && { "interval": data?.interval }),
            ...(data?.circuitBreakerName && { "name": data?.circuitBreakerName }),
            ...(data?.timeout && { "timeout": data?.timeout }),
            ...(data?.maxError && { "max_errors": data?.maxError }),
            ...(data?.logStatusChange && { "log_status_change": data?.logStatusChange })
          }
        }),
        ...((data.regexConReplacerActive || data?.isResSchValidatorActive) && {
          "plugin/req-resp-modifier": {
            "id": data?.regExContentReplacerPluginId,
            "name": [
              data.regexConReplacerActive && 'content-replacer',
              data?.isResSchValidatorActive && 'response-schema-validator'
            ].filter(Boolean),
            ...(data.regexConReplacerActive && { "content-replacer": data.contentReplacer }),
            ...(data?.isResSchValidatorActive && {
              "response-schema-validator": {
                ...(data?.responseSchema &&{"schema": data?.responseSchema}),
                ...((data?.resSchemaValErrorStCode || data?.resSchemaValErrorMsg)&&{"error": {
                  ...(data?.resSchemaValErrorStCode &&{"status": data?.resSchemaValErrorStCode}),
                  ...(data?.resSchemaValErrorMsg &&{"body": data?.resSchemaValErrorMsg})
                }})
              }
            })
          }
        }),
        ...(data?.isProxyRateLimitActive && {
          "qos/ratelimit/proxy": {
            ...(data?.maxRateLimit &&{"max_rate": data?.maxRateLimit}),
            ...(data?.capacity &&{"capacity": data?.capacity}),
            ...(data?.every &&{"every": data?.every})
          }
        }),
        ...(data.isCachingActive && {
          "qos/http-cache": {
            ...(data?.isSharedCacheActive &&{"shared": data.isSharedCacheActive})
          }
        }),
        ...(data?.isAuthActive && {
          "auth/client-credentials": {
            ...(data?.objectMapValueAuth?.length>0 &&{"endpoint_params": endpointMapObj}),
            ...(data?.clientId && { "client_id": data?.clientId }),
            ...(data?.clientSecret && { "client_secret": data?.clientSecret }),
            ...(data?.tokenUrl && { "token_url": data?.tokenUrl }),
            ...(data?.scopes && { "scopes": data?.scopes })
          }
        }),
        ...(data?.isGoogleCloudActive && {
          "auth/gcp": {
            ...(data?.audience && { "audience": data?.audience })
          }
        }),
        ...(data?.isNtlmAuthActive && {
          "auth/ntlm": {
            ...(data?.user &&{"user": data?.user}),
            ...(data?.password &&{"password": data?.password})
          }
        }),
        ...(data?.isSecPolicyActive && {
          "security/policies": {
            ...((data?.secReqPolicyArrayValue.length>0 || data?.secReqErrorStCode ||data?.secReqErrorBody || data?.secReqErrorContentType) &&{"req": {
              ...(data?.secReqPolicyArrayValue.length>0 &&{"policies": data?.secReqPolicyArrayValue}),
              ...((data?.secReqErrorStCode ||data?.secReqErrorBody || data?.secReqErrorContentType)&& {"error": {
                ...(data?.secReqErrorStCode &&{"status": data?.secReqErrorStCode}),
                ...(data?.secReqErrorBody &&{"body": data?.secReqErrorBody}),
                ...(data?.secReqErrorContentType &&{"content_type": data?.secReqErrorContentType})
              }})
            }}),
            ...((data?.secResPolicyArrayValue.length>0 || data?.secResErrorStCode || data?.secResErrorBody || data?.secResErrorContentType)&&{"resp": {
              ...(data?.secResPolicyArrayValue.length>0 &&{"policies": data?.secResPolicyArrayValue}),
              ...((data?.secResErrorStCode || data?.secResErrorBody || data?.secResErrorContentType)&&{"error": {
                ...(data?.secResErrorStCode &&{"status": data?.secResErrorStCode}),
                ...(data?.secResErrorBody &&{"body": data?.secResErrorBody}),
                ...(data?.secResErrorContentType &&{"content_type": data?.secResErrorContentType})
              }})
            }}),
            ...(data?.jwtReqPolicyArrayValue?.length>0 &&{"jwt": {
              ...(data?.jwtReqPolicyArrayValue?.length>0 &&{"policies": data?.jwtReqPolicyArrayValue})
            }}),
            ...(data?.enableDebug &&{"debug": data?.enableDebug}),
            ...(data?.autoJoinPolicies &&{"auto_join_policies": data?.autoJoinPolicies}),
            ...(data?.disableMacros &&{"disable_macros": data?.disableMacros})
          }
        }),
        ...(data?.isRestToGraphqlActive && {
          "backend/graphql": {
            ...(data?.restTographQLOpTypeForm && { "type": data?.restTographQLOpTypeForm }),
            ...(data?.restTographQLInlineQueryForm && { "query": data?.restTographQLInlineQueryForm }),
            ...(data?.objectMapValueConnectRestToGraph?.length>0 &&{"variables": inputMapObjConnectRestToGraphql}),
            ...(data?.restToGraphqlOpNameForm && { "operationName": data?.restToGraphqlOpNameForm }),
            ...(data?.restTographQLQueryPathForm && { "query_path": data?.restTographQLQueryPathForm }),
          }
        }),
        ...(data?.isRestToSoapActive && {
          "backend/soap": {
            // "@comment": null,
            ...(data?.bodyEditorConnect === 'bodyeditorConnect' && { "template": data?.templateConnect }),
            ...(data?.contentTypeConnect && { "content_type": data?.contentTypeConnect }),
            ...(data?.debugConnect && { "debug": data?.debugConnect }),
            ...(data?.bodyEditorConnect === 'externalConnect' && { "path": data?.pathConnect })
          }
        }),
        ...(data?.isrestToGRPCActive && {
          "backend/grpc": {
            ...(data?.objectMapValueConnect?.length>0 && { "input_mapping": inputMapObjConnectRestToGrpc }),
            ...(data?.restTogrpcResNamingConventionForm && { "response_naming_convention": data?.restTogrpcResNamingConventionForm }),
            ...(data?.restTogrpcEnumsAsStrgsForm && { "output_enum_as_string": data?.restTogrpcEnumsAsStrgsForm }),
            ...(data?.restTogrpcTimestmpAsStrgsForm && { "output_timestamp_as_string": data?.restTogrpcTimestmpAsStrgsForm }),
            ...(data?.restTogrpcDurationAsStrgsForm && { "output_duration_as_string": data?.restTogrpcDurationAsStrgsForm }),
            // "client_tls": {
            //   "allow_insecure_connections": true
            // },
            ...(data?.restTogrpcRemoveUnsetValForm && { "output_remove_unset_values": data?.restTogrpcRemoveUnsetValForm }),
            ...(data?.restTogrpcUseReqBodyForm && { "use_request_body": data?.restTogrpcUseReqBodyForm })
          }
        }),
        ...(data?.isHttpClientSettingActive && {
          "backend/http/client": {
            id: data?.httpClientConnectId,
            ...(data?.connectvWebProxyForm && { "proxy_address": data?.connectvWebProxyForm }),
            ...(data?.donotFollowRedirectsForm &&{"no_redirect": data?.donotFollowRedirectsForm})
          }
        }),
        ...(data?.isStaticServerActive && {
          "backend/static-filesystem": {
            ...(data?.directory_Listing &&{"directory_listing": data?.directory_Listing}),
            ...(data?.staticUrl && { "path": data?.staticUrl })
          }
        }),
        ...(data?.isBodymanipulationActive && {
          "modifier/body-generator": {
            ...(data?.bodyEditor === 'bodyeditor' && { "template": data?.template }),
            ...(data?.contentType && { "content_type": data?.contentType }),
            ...(data?.debug && { "debug": data?.debug }),
            ...(data?.bodyEditor === 'external' && { "path": data?.path })
          }
        }),
        ...(data?.isMartianActive && { "modifier/martian": data?.martianDslTextarea }),
        ...(data.AdvResManipulationActive && {
          "modifier/jmespath": {
            ...(data?.expression &&{"expr": data.expression})
          }
        }),
        ...(data.resManiWithGoTemplActive && {
          "modifier/response-body-generator": {
            ...(data.contentTypeResponse && { "content_type": data.contentTypeResponse }),
            ...(data.debugResponse && { "debug": data.debugResponse }),
            ...(data?.bodyEditorResponse === 'externalResponse' && { "path": data.pathResponse }),
            ...(data?.bodyEditorResponse === 'bodyeditorResponse' && { "template": data.templateResponse })
          }
        }),
        ...(data.isPublicSubscriberActive && {
          "backend/pubsub/susbcriber": {
            ...(data?.publicSubSubscriptionURLForm &&{"subscription_url": data.publicSubSubscriptionURLForm})
          }
        }),
        ...(data.isPublicPublisherActive && {
          "backend/pubsub/publisher": {
            ...(data?.publicPubTopicURLForm &&{"topic_url": data.publicPubTopicURLForm})
          }
        }),
        ...(data.isAMQPproducerActive && {
          "backend/amqp/producer": {
            ...(data?.amqpProducerExchangeForm &&{"exchange": data.amqpProducerExchangeForm}),
            ...(data?.amqpProducerBackoffStrategyForm &&{"backoff_strategy": data.amqpProducerBackoffStrategyForm}),
            ...(data?.amqpProducerDurableForm &&{"durable": data.amqpProducerDurableForm}),
            // "mandatory": true,
            // "immediate": false,
            ...(data?.amqpProducerQueueNameForm &&{"name": data.amqpProducerQueueNameForm})
          }
        }),
        ...(data?.flatmapFilterArr?.length > 0 && {
          "proxy": {
            "id": data?.proxyId,
            ...(data?.flatmapFilterArr?.length>0 &&{"flatmap_filter": data?.flatmapFilterArr.map((filter: any) => ({
              "id": filter.id || undefined, // Include `id` only if it exists
              "type": filter.type,
              "args": filter.args
            }))})
          }
        }),
        ...(data.isAMQPconsumerActive && {
          "backend/amqp/consumer": {
            ...(data.amqpConsumerQueueNameForm && { "name": data.amqpConsumerQueueNameForm }),
            ...(data.amqpConsumerExchangeForm && { "exchange": data.amqpConsumerExchangeForm }),
            ...(data.amqpConsumerBackOffStratgyForm && { "backoff_strategy": data.amqpConsumerBackOffStratgyForm }),
            ...(data.amqpConsumerDurableForm && { "durable": data.amqpConsumerDurableForm }),
            ...(data.amqpRoutingKeysArray && { "routing_key": data.amqpRoutingKeysArray }),
            ...(data.amqpConsumerPrefetchCntForm && { "prefetch_count": data.amqpConsumerPrefetchCntForm }),
            ...(data.amqpConsumerNoLocalForm && { "no_local": data.amqpConsumerNoLocalForm })
          }
        })
      },
      // "target": null,
      ...(data?.method &&{"method": data?.method}),
      ...((this.selectedItem.name==="Deny" && data?.deniedAttributesArrValue?.length > 0) &&{"deny": data?.deniedAttributesArrValue}),
      // "@comment": null,
      // "@test_with": null,
      "disable_host_sanitize": true


    }
    console.log(backendBody);
//     const errors = this.getFormGroup(index).errors;
//     // if(this.getFormGroup(index).valid){}
//     if(this.getFormGroup(index).get('martianDslTextarea')?.hasError('invalidJson')){
// this.showErrorAlert("invalid json")
//     }else if (errors?.['policyRequired']) {
//       this.showErrorAlert(errors?.['policyRequired']);
//     }else if(this.getFormGroup(index).valid){
//     this.mainSer.addBackend(this.endpointId, backendBody).subscribe({
//       next: (res: any) => {
//         console.log(res);
//         // this.fetchItemsFromBackend();
//         this.router.navigate([`apis/viewapi/${this.endpointId}/overview`])
//       },
//       error: (err: any) => {
//         console.log(err);
//         this.showError(err?.message);

//       }
//     })
//   }



const securityPolicies = backendBody?.extra_config?.['security/policies'];
let isValid = true;

// Check for invalid JSON in form fields
if (this.getFormGroup(index).get('template')?.hasError('invalidJson')) {
  this.showErrorAlert("Invalid JSON in Body Manipulation and Generation");
  isValid = false;
} else if (this.getFormGroup(index).get('templateResponse')?.hasError('invalidJson')) {
  this.showErrorAlert("Invalid JSON in Response Manipulation with Go templates");
  isValid = false;
} else if (this.getFormGroup(index).get('templateConnect')?.hasError('invalidJson')) {
  this.showErrorAlert("Invalid JSON in Rest to SOAP in Connectivity Options");
  isValid = false;
} else if (this.getFormGroup(index).get('martianDslTextarea')?.hasError('invalidJson')) {
  this.showErrorAlert("Invalid JSON in Martian DSL");
  isValid = false;
}

// Check for policy requirement errors
const errors = this.getFormGroup(index).errors;
if (isValid && errors?.['policyRequired']) {
  this.showErrorAlert(errors['policyRequired']);
  isValid = false;
}

// Validate security policies
if (isValid && securityPolicies) {
  const keys = ['req', 'resp', 'jwt'];
  const enabledKeys = keys.filter(key => securityPolicies[key]);

  if (enabledKeys.length === 0) {
    this.showErrorAlert("At least one policy (req, resp, or jwt) must be enabled with its policies defined");
    isValid = false;
  } else {
    for (const key of enabledKeys) {
      const policies = securityPolicies[key];
      if (!Object.keys(policies).includes('policies')) {
        this.showErrorAlert(`Policy required for ${key}`);
        isValid = false;
        break; // Stop further checks if any policy is missing
      }
    }
  }
}

// Proceed with API call only if all checks pass
if (isValid && this.getFormGroup(index).valid) {
  this.mainSer.addBackend(this.endpointId, backendBody).subscribe({
    next: (res: any) => {
      console.log(res);
      // this.fetchItemsFromBackend();
      this.router.navigate([`apis/viewapi/${this.endpointId}/overview`])
    },
    error: (err: any) => {
      console.log(err);
      this.showError(err?.message);

    }
  })
}else{
  this.showErrorAlert('Please fill required fields')
}

    // this.http.post('https://api.example.com/items', data).subscribe((response: any) => {
    //   this.items[index] = { ...data, id: response.id, isNew: false }; // Update item with ID and mark as not new
    //   alert('Panel saved successfully!');
    // });
  }

  updateBackend(index: number, backendId: number) {
    const formGroup = this.getFormGroup(index);
    const data = formGroup.value;
    console.log(data);
    const renamingObj = data?.objectMapValue?.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    console.log(renamingObj);
    console.log(data.objectMapValue);

    const inputMapObjConnectRestToGrpc = data?.objectMapValueConnect?.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    const inputMapObjConnectRestToGraphql = data?.objectMapValueConnectRestToGraph?.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    const endpointMapObj = data?.objectMapValueAuth?.reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});
    console.log(endpointMapObj);
    console.log(data.objectMapValueAuth);
    const backendBody = {
      "id": data?.id,
      ...(data?.hostArrayValue?.length > 0 && { "host": data?.hostArrayValue }),
      "url_pattern": data?.endpointUrl,
      ...((this.selectedItem.name==="Allow" && data?.allowedAttributesArrValue?.length > 0 ) && { "allow": data?.allowedAttributesArrValue }),
      ...(data?.objectMapValue?.length>0 && { "mapping": renamingObj }),
      ...(data?.wrappingGroup &&{"group": data?.wrappingGroup}),
      ...(data?.isCollection &&{"is_collection": data?.isCollection}),
      ...(data?.decodeAs &&{"encoding": data?.decodeAs}),
      "extra_config": {
        "id": data?.extraConfigId,
        ...(data?.isCircuitBreakerActive && {
          "qos/circuit-breaker": {
            ...(data?.interval && { "interval": data?.interval }),
            ...(data?.circuitBreakerName && { "name": data?.circuitBreakerName }),
            ...(data?.timeout && { "timeout": data?.timeout }),
            ...(data?.maxError && { "max_errors": data?.maxError }),
            ...(data?.logStatusChange && { "log_status_change": data?.logStatusChange })
          }
        }),
        ...((data.regexConReplacerActive || data?.isResSchValidatorActive) && {
          "plugin/req-resp-modifier": {
            "id": data?.regExContentReplacerPluginId,
            "name": [
              data.regexConReplacerActive && 'content-replacer',
              data?.isResSchValidatorActive && 'response-schema-validator'
            ].filter(Boolean),
            ...(data?.regexConReplacerActive && { "content-replacer": data?.contentReplacer }),
            ...(data?.isResSchValidatorActive && {
              "response-schema-validator": {
                ...(data?.responseSchema &&{"schema": data?.responseSchema}),
                ...((data?.resSchemaValErrorStCode || data?.resSchemaValErrorMsg)&&{"error": {
                  ...(data?.resSchemaValErrorStCode &&{"status": data?.resSchemaValErrorStCode}),
                  ...(data?.resSchemaValErrorMsg &&{"body": data?.resSchemaValErrorMsg})
                }})
              }
            })
          }
        }),
        ...(data?.isProxyRateLimitActive && {
          "qos/ratelimit/proxy": {
            ...(data?.maxRateLimit &&{"max_rate": data?.maxRateLimit}),
            ...(data?.capacity &&{"capacity": data?.capacity}),
            ...(data?.every && { "every": data?.every })
          }
        }),
        ...(data.isCachingActive && {
          "qos/http-cache": {
            ...(data?.isSecPolicyActive &&{"shared": data.isSharedCacheActive})
          }
        }),
        ...(data?.isAuthActive && {
          "auth/client-credentials": {
            ...(data?.objectMapValueAuth?.length>0 &&{"endpoint_params": endpointMapObj}),
            ...(data?.clientId && { "client_id": data?.clientId }),
            ...(data?.clientSecret && { "client_secret": data?.clientSecret }),
            ...(data?.tokenUrl && { "token_url": data?.tokenUrl }),
            ...(data?.scopes && { "scopes": data?.scopes })
          }
        }),
        ...(data?.isGoogleCloudActive && {
          "auth/gcp": {
            ...(data?.audience && { "audience": data?.audience })
          }
        }),
        ...(data?.isNtlmAuthActive && {
          "auth/ntlm": {
            ...(data?.user &&{"user": data?.user}),
            ...(data?.password &&{"password": data?.password})
          }
        }),
        ...(data?.isSecPolicyActive && {
          "security/policies": {
            ...((data?.secReqPolicyArrayValue.length>0 || data?.secReqErrorStCode ||data?.secReqErrorBody || data?.secReqErrorContentType) &&{"req": {
              ...(data?.secReqPolicyArrayValue.length>0 &&{"policies": data?.secReqPolicyArrayValue}),
              ...((data?.secReqErrorStCode ||data?.secReqErrorBody || data?.secReqErrorContentType)&& {"error": {
                ...(data?.secReqErrorStCode &&{"status": data?.secReqErrorStCode}),
                ...(data?.secReqErrorBody &&{"body": data?.secReqErrorBody}),
                ...(data?.secReqErrorContentType &&{"content_type": data?.secReqErrorContentType})
              }})
            }}),
            ...((data?.secResPolicyArrayValue.length>0 || data?.secResErrorStCode || data?.secResErrorBody || data?.secResErrorContentType)&&{"resp": {
              ...(data?.secResPolicyArrayValue.length>0 &&{"policies": data?.secResPolicyArrayValue}),
              ...((data?.secResErrorStCode || data?.secResErrorBody || data?.secResErrorContentType)&&{"error": {
                ...(data?.secResErrorStCode &&{"status": data?.secResErrorStCode}),
                ...(data?.secResErrorBody &&{"body": data?.secResErrorBody}),
                ...(data?.secResErrorContentType &&{"content_type": data?.secResErrorContentType})
              }})
            }}),
            ...(data?.jwtReqPolicyArrayValue?.length>0 &&{"jwt": {
              ...(data?.jwtReqPolicyArrayValue?.length>0 &&{"policies": data?.jwtReqPolicyArrayValue})
            }}),
            ...(data?.enableDebug &&{"debug": data?.enableDebug}),
            ...(data?.autoJoinPolicies &&{"auto_join_policies": data?.autoJoinPolicies}),
            ...(data?.disableMacros &&{"disable_macros": data?.disableMacros})
          }
        }),
        ...(data?.isRestToGraphqlActive && {
          "backend/graphql": {
            ...(data?.restTographQLOpTypeForm && { "type": data?.restTographQLOpTypeForm }),
            ...(data?.restTographQLInlineQueryForm && { "query": data?.restTographQLInlineQueryForm }),
            ...(data?.objectMapValueConnectRestToGraph?.length>0 &&{"variables": inputMapObjConnectRestToGraphql}),
            ...(data?.restToGraphqlOpNameForm && { "operationName": data?.restToGraphqlOpNameForm }),
            ...(data?.restTographQLQueryPathForm && { "query_path": data?.restTographQLQueryPathForm }),
          }
        }),
        ...(data?.isRestToSoapActive && {
          "backend/soap": {
            // "@comment": null,
            ...(data?.bodyEditorConnect === 'bodyeditorConnect' && { "template": data?.templateConnect }),
            ...(data?.contentTypeConnect && { "content_type": data?.contentTypeConnect }),
            ...(data?.debugConnect && { "debug": data?.debugConnect }),
            ...(data?.bodyEditorConnect === 'externalConnect' && { "path": data?.pathConnect })
          }
        }),
        ...(data?.isrestToGRPCActive && {
          "backend/grpc": {
            ...(data?.objectMapValueConnectRestToGraph?.length>0 && { "input_mapping": inputMapObjConnectRestToGrpc }),
            ...(data?.restTogrpcResNamingConventionForm && { "response_naming_convention": data?.restTogrpcResNamingConventionForm }),
            ...(data?.restTogrpcEnumsAsStrgsForm && { "output_enum_as_string": data?.restTogrpcEnumsAsStrgsForm }),
            ...(data?.restTogrpcTimestmpAsStrgsForm && { "output_timestamp_as_string": data?.restTogrpcTimestmpAsStrgsForm }),
            ...(data?.restTogrpcDurationAsStrgsForm && { "output_duration_as_string": data?.restTogrpcDurationAsStrgsForm }),
            // "client_tls": {
            //   "allow_insecure_connections": true
            // },
            ...(data?.restTogrpcRemoveUnsetValForm && { "output_remove_unset_values": data?.restTogrpcRemoveUnsetValForm }),
            ...(data?.restTogrpcUseReqBodyForm && { "use_request_body": data?.restTogrpcUseReqBodyForm })
          }
        }),
        ...(data?.isHttpClientSettingActive && {
          "backend/http/client": {
            id: data?.httpClientConnectId,
            ...(data?.connectvWebProxyForm && { "proxy_address": data?.connectvWebProxyForm }),
            ...(data?.donotFollowRedirectsForm &&{"no_redirect": data?.donotFollowRedirectsForm})
          }
        }),
        ...(data?.isStaticServerActive && {
          "backend/static-filesystem": {
            ...(data?.directory_Listing &&{"directory_listing": data?.directory_Listing}),
            ...(data?.staticUrl && { "path": data?.staticUrl })
          }
        }),
        ...(data?.isBodymanipulationActive && {
          "modifier/body-generator": {
            ...(data?.bodyEditor === 'bodyeditor' && { "template": data?.template }),
            ...(data?.contentType && { "content_type": data?.contentType }),
            ...(data?.debug && { "debug": data?.debug }),
            ...(data?.bodyEditor === 'external' && { "path": data?.path })
          }
        }),
        ...(data?.isMartianActive && { "modifier/martian": data?.martianDslTextarea }),
        ...(data.AdvResManipulationActive && {
          "modifier/jmespath": {
            ...(data?.expression &&{"expr": data.expression})
          }
        }),
        ...(data.resManiWithGoTemplActive && {
          "modifier/response-body-generator": {
            ...(data.contentTypeResponse && { "content_type": data.contentTypeResponse }),
            ...(data.debugResponse && { "debug": data.debugResponse }),
            ...(data.bodyEditorResponse === 'bodyeditorResponse' && { "path": data.pathResponse }),
            ...(data.bodyEditorResponse === 'bodyeditorResponse' && { "template": data.templateResponse })
          }
        }),
        ...(data.isPublicSubscriberActive && {
          "backend/pubsub/susbcriber": {
            ...(data?.publicSubSubscriptionURLForm &&{"subscription_url": data.publicSubSubscriptionURLForm})
          }
        }),
        ...(data.isPublicPublisherActive && {
          "backend/pubsub/publisher": {
            ...(data?.publicPubTopicURLForm &&{"topic_url": data.publicPubTopicURLForm})
          }
        }),
        ...(data.isAMQPproducerActive && {
          "backend/amqp/producer": {
            ...(data?.amqpProducerExchangeForm &&{"exchange": data.amqpProducerExchangeForm}),
            ...(data?.amqpProducerBackoffStrategyForm &&{"backoff_strategy": data.amqpProducerBackoffStrategyForm}),
            ...(data?.amqpProducerDurableForm &&{"durable": data.amqpProducerDurableForm}),
            // "mandatory": true,
            // "immediate": false,
            ...(data?.amqpProducerQueueNameForm &&{"name": data.amqpProducerQueueNameForm})
          }
        }),
        ...(data?.flatmapFilterArr?.length > 0 && {
          "proxy": {
            "id": data?.proxyId,
            ...(data?.flatmapFilterArr?.length>0 &&{"flatmap_filter": data?.flatmapFilterArr.map((filter: any) => ({
              "id": filter.id || undefined, // Include `id` only if it exists
              "type": filter.type,
              "args": filter.args
            }))})
          }
        }),
        ...(data.isAMQPconsumerActive && {
          "backend/amqp/consumer": {
            ...(data.amqpConsumerQueueNameForm && { "name": data.amqpConsumerQueueNameForm }),
            ...(data.amqpConsumerExchangeForm && { "exchange": data.amqpConsumerExchangeForm }),
            ...(data.amqpConsumerBackOffStratgyForm && { "backoff_strategy": data.amqpConsumerBackOffStratgyForm }),
            ...(data.amqpConsumerDurableForm && { "durable": data.amqpConsumerDurableForm }),
            ...(data.amqpRoutingKeysArray && { "routing_key": data.amqpRoutingKeysArray }),
            ...(data.amqpConsumerPrefetchCntForm && { "prefetch_count": data.amqpConsumerPrefetchCntForm }),
            ...(data.amqpConsumerNoLocalForm && { "no_local": data.amqpConsumerNoLocalForm })
          }
        })
      },
      // "target": null,
      ...(data?.method &&{"method": data?.method}),
      ...((this.selectedItem.name==="Deny" && data?.deniedAttributesArrValue?.length > 0) && { "deny": data?.deniedAttributesArrValue }),
      // "@comment": null,
      // "@test_with": null,
      "disable_host_sanitize": true


    }
    console.log(backendBody?.extra_config?.['security/policies']?.req);
    
    // const errors = this.getFormGroup(index).errors;
    // let isValid = true;

    // Check for invalid JSON in form fields
    const securityPolicies = backendBody?.extra_config?.['security/policies'];
let isValid = true;

// Check for invalid JSON in form fields
if (this.getFormGroup(index).get('template')?.hasError('invalidJson')) {
  this.showErrorAlert("Invalid JSON in Body Manipulation and Generation");
  isValid = false;
} else if (this.getFormGroup(index).get('templateResponse')?.hasError('invalidJson')) {
  this.showErrorAlert("Invalid JSON in Response Manipulation with Go templates");
  isValid = false;
} else if (this.getFormGroup(index).get('templateConnect')?.hasError('invalidJson')) {
  this.showErrorAlert("Invalid JSON in Rest to SOAP in Connectivity Options");
  isValid = false;
} else if (this.getFormGroup(index).get('martianDslTextarea')?.hasError('invalidJson')) {
  this.showErrorAlert("Invalid JSON in Martian DSL");
  isValid = false;
}

// Check for policy requirement errors
const errors = this.getFormGroup(index).errors;
if (isValid && errors?.['policyRequired']) {
  this.showErrorAlert(errors['policyRequired']);
  isValid = false;
}

// Validate security policies
if (isValid && securityPolicies) {
  const keys = ['req', 'resp', 'jwt'];
  const enabledKeys = keys.filter(key => securityPolicies[key]);

  if (enabledKeys.length === 0) {
    this.showErrorAlert("At least one policy (req, resp, or jwt) must be enabled with its policies defined");
    isValid = false;
  } else {
    for (const key of enabledKeys) {
      const policies = securityPolicies[key];
      if (!Object.keys(policies).includes('policies')) {
        this.showErrorAlert(`Policy required for ${key}`);
        isValid = false;
        break; // Stop further checks if any policy is missing
      }
    }
  }
}

// Proceed with API call only if all checks pass
if (isValid && this.getFormGroup(index).valid) {
  this.mainSer.updateBackend(backendId, backendBody).subscribe({
    next: (res: any) => {
      console.log(res);
      this.router.navigate([`apis/viewapi/${this.endpointId}/overview`]);
    },
    error: (err: any) => {
      console.log(err);
      this.showError(err?.message);
    }
  });
}else{
  this.showErrorAlert('Please fill required fields')
}

    
  // else{
   
  // }

    // this.http.put(`https://api.example.com/items/${data.id}`, data).subscribe(() => {
    //   alert('Panel updated successfully!');
    // });
  }

  getFormGroup(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }


  // constructor(private formBuilder:FormBuilder){
  //   this.formGroupUpstreamRequest=this.formBuilder.group({

  //     isStaticServerActive:[false],
  //     isBodymanipulationActive:[false],
  //     isMartianActive:[false],
  //     sanitization:[false],
  //     method:[null],
  //     endpointUrl:[null],
  //     decodeAs:[null],
  //     staticUrl:[null],
  //     directory_Listing:[false],
  //     bodyEditor:['bodyeditor'],
  //     template:[''],
  //     contentType:[''],
  //     debug:[false],
  //     path:[''],
  //     martianDslTextarea:[null],
  //     host:[null],
  //     hostArrayValue:[[]]
  //   })
  // }
  hostArray: any = [];
  parameterHeaderArray: any = [];
  updateParametersArrayRequest(index: any) {
    this.getFormGroup(index).get('hostArrayValue')?.setValue([...this.hostArray[index]]);
  }
  addParameterRequest(formIndex: number) {
    const queryParamsValue = this.getFormGroup(formIndex).get('host')?.value;

    if (queryParamsValue) {
      if (!this.hostArray[formIndex]) {
        this.hostArray[formIndex] = [];
      }
      this.hostArray[formIndex].push(queryParamsValue);
      this.updateParametersArrayRequest(formIndex);
      this.getFormGroup(formIndex).get('host')?.reset();
    }
  }
  removeParameterRequest(formIndex: number, index: number) {
    this.hostArray[formIndex].splice(index, 1);
    this.updateParametersArrayRequest(formIndex);
  }

  // response manipulation
  objectMaps: Map<string, string>[] = [];
  updateMapControl(formGroupIndex: number) {
    const mapArray = Array.from(this.objectMaps[formGroupIndex].entries());
    this.getFormGroup(formGroupIndex).get('objectMapValue')?.setValue(mapArray);
  }



  addToMap(formGroupIndex: number, key: string, value: string) {
    const currentMap = this.objectMaps[formGroupIndex];
    currentMap.set(key, value);
    this.updateMapControl(formGroupIndex);
  }

  removeFromMap(formGroupIndex: number, key: string) {
    const currentMap = this.objectMaps[formGroupIndex];
    currentMap.delete(key);
    this.updateMapControl(formGroupIndex);
  }
  patchRenamingObj(formGroupIndex: number, renamingObj: Record<string, string>) {
    if (renamingObj) {
      const mapArray = Object.entries(renamingObj);
      const currentMap = new Map<string, string>(mapArray);

      // Update objectMaps
      this.objectMaps[formGroupIndex] = currentMap;

      // Update the form control
      this.getFormGroup(formGroupIndex).get('objectMapValue')?.setValue(mapArray);
    }
  }


  getMapFromControl(index: any): Map<string, string> {
    const mapArray = this.getFormGroup(index).get('objectMapValue')?.value || [];
    return new Map(mapArray);
  }

  addParameter(formGroupIndex: number, fieldName: 'deniedAttr' | 'allowedAttr' | 'renaming' | 'flatMap') {
    const fieldValue = this.getFormGroup(formGroupIndex).get(fieldName)?.value;

    if (fieldName) {
      if (fieldName === 'deniedAttr') {
        this.deniedAttributesArr.push(fieldValue);
        this.getFormGroup(formGroupIndex).get('deniedAttributesArrValue')?.setValue([...this.deniedAttributesArr]);
      }
      else if (fieldName === 'allowedAttr') {
        this.allowedAttributesArr.push(fieldValue);
        this.getFormGroup(formGroupIndex).get('allowedAttributesArrValue')?.setValue([...this.allowedAttributesArr]);
      } else if (fieldName === 'renaming') {
        const originalObject = this.getFormGroup(formGroupIndex).get('originalObj')?.value;
        const renamedObject = this.getFormGroup(formGroupIndex).get('renamedObj')?.value;

        if (originalObject && renamedObject) {
          this.addToMap(formGroupIndex, originalObject, renamedObject)
        }
      } else if (fieldName === 'flatMap') {
        const operationType = this.getFormGroup(formGroupIndex).get('operationType')?.value;
        const originalObj = this.getFormGroup(formGroupIndex).get('flatmapOriginalObj')?.value;
        const targetObj = this.getFormGroup(formGroupIndex).get('flatmapTargetObj')?.value;

        if (operationType && originalObj) {
          const newFlatmap = {
            type: operationType,
            args: [
              originalObj,
              targetObj || undefined
            ].filter(value => value !== undefined) // Remove undefined
          };

          const currentFlatmapArr = this.getFormGroup(formGroupIndex).get('flatmapFilterArr')?.value || [];
          this.getFormGroup(formGroupIndex).get('flatmapFilterArr')?.setValue([...currentFlatmapArr, newFlatmap]);
          this.faltMapArr[formGroupIndex].push(newFlatmap)
          // Reset inputs
          this.getFormGroup(formGroupIndex).get('operationType')?.reset();
          this.getFormGroup(formGroupIndex).get('flatmapOriginalObj')?.reset();
          this.getFormGroup(formGroupIndex).get('flatmapTargetObj')?.reset();
        }
      }
      this.getFormGroup(formGroupIndex).get(fieldName)?.reset();
    }
  }

  removeParameter(formGroupIndex: number, index: any, fieldName: 'deniedAttr' | 'allowedAttr' | 'renaming' | 'flatMap') {
    if (fieldName === "deniedAttr") {
      this.deniedAttributesArr.splice(index, 1);
      this.getFormGroup(formGroupIndex).get('deniedAttributesArrValue')?.setValue([...this.deniedAttributesArr]);
    } else if (fieldName === 'allowedAttr') {
      this.allowedAttributesArr.splice(index, 1);
      this.getFormGroup(formGroupIndex).get('allowedAttributesArrValue')?.setValue([...this.allowedAttributesArr]);
    }
    else if (fieldName === 'renaming') {
      this.removeFromMap(formGroupIndex, index);
    }
    else if (fieldName === 'flatMap') {
      this.faltMapArr[formGroupIndex].splice(index, 1);
      this.getFormGroup(formGroupIndex)
        .get('flatmapFilterArr')
        ?.setValue([...this.faltMapArr[formGroupIndex]]);
    }

  }

  createContentReplacerKey(formGroupIndex: any) {
    if (this.getFormGroup(formGroupIndex).get('contentReplacerKey')?.value) {
      const contentReplacerGroup = this.getFormGroup(formGroupIndex).get('contentReplacer') as FormGroup;

      // Create a new FormGroup with find, replace, and regexp
      const nestedFormGroup = this.fb.group({
        find: [''],    // Default empty value for find
        replace: [''], // Default empty value for replace
        regexp: [false] // Default checkbox unchecked
      });

      // Add the new group to contentReplacer with the entered key
      contentReplacerGroup.addControl(this.getFormGroup(formGroupIndex).get('contentReplacerKey')?.value, nestedFormGroup);

      // Reset the key input and set flag to show nested controls
      this.isKeyCreated = true;
    }
  }

  resetFields(formGroupIndex: any) {
    const key = this.getFormGroup(formGroupIndex).get('contentReplacerKey')?.value;
    if (key) {
      const contentReplacerGroup = this.getFormGroup(formGroupIndex).get('contentReplacer') as FormGroup;
      contentReplacerGroup.removeControl(key);
      this.getFormGroup(formGroupIndex).get('contentReplacerKey')?.reset();
      this.isKeyCreated = false;
    }
  }

  // authentication 

  addParameterAuth(formGroupIndex: number, fieldName: 'endpoint_params') {
    const fieldValue = this.getFormGroup(formGroupIndex).get(fieldName)?.value;

    if (fieldName) {

      if (fieldName === 'endpoint_params') {
        const endpointKey = this.getFormGroup(formGroupIndex).get('endpointKey')?.value;
        const endpointValue = this.getFormGroup(formGroupIndex).get('endpointValue')?.value;

        if (endpointKey && endpointValue) {
          this.addToMapAuth(formGroupIndex, endpointKey, endpointValue)
        }
      }
    }
  }

  removeParameterAuth(formGroupIndex: number, index: any, fieldName: 'endpoint_params') {

    if (fieldName === 'endpoint_params') {
      this.removeFromMapAuth(formGroupIndex, index);
    }

  }
  objectMapsAuth: Map<string, string>[] = [];
  updateMapControlAuth(formGroupIndex: number) {
    // Convert Map to array of key-value pairs
    const mapArray = Array.from(this.objectMapsAuth[formGroupIndex].entries());
    this.getFormGroup(formGroupIndex).get('objectMapValueAuth')?.setValue(mapArray);
  }

  addToMapAuth(formGroupIndex: number, key: string, value: string) {
    // this.objectMapAuth.set(key, value);
    // this.updateMapControlAuth(formGroupIndex);  
    const currentMap = this.objectMapsAuth[formGroupIndex];
    currentMap.set(key, value);
    this.updateMapControlAuth(formGroupIndex);
  }

  removeFromMapAuth(formGroupIndex: number, key: string) {
    const currentMap = this.objectMapsAuth[formGroupIndex];
    currentMap.delete(key);
    // this.objectMapAuth.delete(key);
    this.updateMapControlAuth(formGroupIndex);
  }
  patchFlatMapArray(formGroupIndex: number, resultArray: any[]) {
    this.getFormGroup(formGroupIndex).get('flatmapFilterArr')?.setValue([...resultArray]);
  }
  patchRenamingAuthObj(formGroupIndex: number, renamingObj: Record<string, string>) {
    if (renamingObj) {
      const mapArray = Object.entries(renamingObj);
      const currentMap = new Map<string, string>(mapArray);

      // Update objectMaps
      this.objectMapsAuth[formGroupIndex] = currentMap;

      // Update the form control
      this.getFormGroup(formGroupIndex).get('objectMapValueAuth')?.setValue(mapArray);
    }
  }
  patchRenamingConnectObj(formGroupIndex: number, renamingObj: Record<string, string>) {
    if (renamingObj) {
      const mapArray = Object.entries(renamingObj);
      const currentMap = new Map<string, string>(mapArray);

      // Update objectMaps
      this.objectMapsConnect[formGroupIndex] = currentMap;

      // Update the form control
      this.getFormGroup(formGroupIndex).get('objectMapValueConnect')?.setValue(mapArray);
    }
  }
  patchRenamingConnectRestToGraphObj(formGroupIndex: number, renamingObj: Record<string, string>) {
    if (renamingObj) {
      const mapArray = Object.entries(renamingObj);
      const currentMap = new Map<string, string>(mapArray);

      // Update objectMaps
      this.objectMapsConnectRestToGraph[formGroupIndex] = currentMap;

      // Update the form control
      this.getFormGroup(formGroupIndex).get('objectMapValueConnectRestToGraph')?.setValue(mapArray);
    }
  }
  getMapFromControlAuth(formGroupIndex: number): Map<string, string> {
    const mapArray = this.getFormGroup(formGroupIndex).get('objectMapValueAuth')?.value || [];
    return new Map(mapArray);
  }

  // policies
  addParameterPolicies(formGroupIndex: number, fieldName: 'securityReqPolicy' | 'securityResPolicy' | 'jwtReqPolicy') {
    const fieldValue = this.getFormGroup(formGroupIndex).get(fieldName)?.value;
    if (fieldName) {
      if (fieldName === 'securityReqPolicy') {
        this.parameterArraySecReqPolicy[formGroupIndex].push(fieldValue);
        this.getFormGroup(formGroupIndex).get('secReqPolicyArrayValue')?.setValue([...this.parameterArraySecReqPolicy[formGroupIndex]]);
      }
      else if (fieldName === 'securityResPolicy') {
        this.parameterArraySecResPolicy[formGroupIndex].push(fieldValue);
        this.getFormGroup(formGroupIndex).get('secResPolicyArrayValue')?.setValue([...this.parameterArraySecResPolicy[formGroupIndex]]);
      }
      else if (fieldName === 'jwtReqPolicy') {
        this.parameterArrayJwtValReqPolicy[formGroupIndex].push(fieldValue);
        this.getFormGroup(formGroupIndex).get('jwtReqPolicyArrayValue')?.setValue([...this.parameterArrayJwtValReqPolicy[formGroupIndex]]);
      }
      this.getFormGroup(formGroupIndex).get(fieldName)?.reset();
    }

  }

  removeParameterPolicies(formGroupIndex: number, index: number, fieldName: 'securityReqPolicy' | 'securityResPolicy' | 'jwtReqPolicy') {
    if (fieldName === 'securityReqPolicy') {
      this.parameterArraySecReqPolicy[formGroupIndex].splice(index, 1);
      this.getFormGroup(formGroupIndex).get('secReqPolicyArrayValue')?.setValue([...this.parameterArraySecReqPolicy[formGroupIndex]]);
    }
    else if (fieldName === 'securityResPolicy') {
      this.parameterArraySecResPolicy[formGroupIndex].splice(index, 1);
      this.getFormGroup(formGroupIndex).get('secResPolicyArrayValue')?.setValue([...this.parameterArraySecResPolicy[formGroupIndex]]);
    }
    else if (fieldName === 'jwtReqPolicy') {
      this.parameterArrayJwtValReqPolicy[formGroupIndex].splice(index, 1);
      this.getFormGroup(formGroupIndex).get('jwtReqPolicyArrayValue')?.setValue([...this.parameterArrayJwtValReqPolicy[formGroupIndex]]);
    }
  }

  // connectivity options
  objectMapsConnect: Map<string, string>[] = [];
  objectMapsConnectRestToGraph: Map<string, string>[] = [];
  updateMapControlConnect(formGroupIndex: number) {
    // Convert Map to array of key-value pairs
    const mapArray = Array.from(this.objectMapsConnect[formGroupIndex].entries());
    this.getFormGroup(formGroupIndex).get('objectMapValueConnect')?.setValue(mapArray);
  }
  updateMapControlConnectRestToGraph(formGroupIndex: number) {
    // Convert Map to array of key-value pairs
    const mapArray = Array.from(this.objectMapsConnectRestToGraph[formGroupIndex].entries());
    this.getFormGroup(formGroupIndex).get('objectMapValueConnectRestToGraph')?.setValue(mapArray);
  }

  addToMapConnect(formGroupIndex: number, key: string, value: string) {
    // this.objectMapConnect.set(key, value);
    const currentMap = this.objectMapsConnect[formGroupIndex];
    currentMap.set(key, value);
    this.updateMapControlConnect(formGroupIndex);
  }

  addToMapConnectRestToGraph(formGroupIndex: number, key: string, value: string) {
    // this.objectMapConnectRestToGraph.set(key, value);
    const currentMap = this.objectMapsConnectRestToGraph[formGroupIndex];
    currentMap.set(key, value);
    this.updateMapControlConnectRestToGraph(formGroupIndex);
  }

  removeFromMapConnect(formGroupIndex: number, key: string) {
    // this.objectMapConnect.delete(key);
    const currentMap = this.objectMapsConnect[formGroupIndex];
    currentMap.delete(key);
    this.updateMapControlConnect(formGroupIndex);
  }

  removeFromMapConnectRestToGraph(formGroupIndex: number, key: string) {
    // this.objectMapConnectRestToGraph.delete(key);
    const currentMap = this.objectMapsConnectRestToGraph[formGroupIndex];
    currentMap.delete(key);
    this.updateMapControlConnectRestToGraph(formGroupIndex);
  }



  addParameterConnect(formGroupIndex: number, fieldName: 'amqpConsumerRoutingKeysForm' | 'restToGraphQLMap' | 'inputMappingFieldAndMapAs') {


    const fieldValue = this.getFormGroup(formGroupIndex).get(fieldName)?.value;

    if (fieldName) {
      if (fieldName === 'amqpConsumerRoutingKeysForm') {
        this.amqpRoutingKeysArray[formGroupIndex].push(fieldValue);
        this.getFormGroup(formGroupIndex).get('amqpConsumerRoutingKeysFormArray')?.setValue([...this.amqpRoutingKeysArray[formGroupIndex]]);
      }
      else if (fieldName === 'restToGraphQLMap') {

        const originalObject = this.getFormGroup(formGroupIndex).get('restTographQLVariable')?.value;
        const renamedObject = this.getFormGroup(formGroupIndex).get('restTographQLValue')?.value;

        if (originalObject && renamedObject) {
          this.addToMapConnectRestToGraph(formGroupIndex, originalObject, renamedObject)
          console.log(this.objectMapConnectRestToGraph);

        }
      } else if (fieldName === 'inputMappingFieldAndMapAs') {

        const originalObject = this.getFormGroup(formGroupIndex).get('restTogprcInputMappingFieldForm')?.value;
        const renamedObject = this.getFormGroup(formGroupIndex).get('restTogprcInputMappingMapAsForm')?.value;

        if (originalObject && renamedObject) {
          this.addToMapConnect(formGroupIndex, originalObject, renamedObject)
          console.log(this.objectMapConnect);

        }
      }
    }
    this.getFormGroup(formGroupIndex).get(fieldName)?.reset();
  }

  removeParameterConnect(formGroupIndex: number, index: any, fieldName: 'amqpConsumerRoutingKeysForm' | 'restToGraphQLMap' | 'inputMappingFieldAndMapAs') {
    if (fieldName === "amqpConsumerRoutingKeysForm") {
      this.amqpRoutingKeysArray[formGroupIndex].splice(index, 1);
      this.getFormGroup(formGroupIndex).get('amqpConsumerRoutingKeysFormArray')?.setValue([...this.amqpRoutingKeysArray[formGroupIndex]]);
    } else if (fieldName == "restToGraphQLMap") {
      this.removeFromMapConnectRestToGraph(formGroupIndex, index);
    } else if (fieldName === "inputMappingFieldAndMapAs") {
      this.removeFromMapConnect(formGroupIndex, index);
    }
  }

  deleteBackend(backendId: any) {
    this.backendser.deleteBackend(backendId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showSuccess(res?.message);
        this.router.navigate([`apis/viewapi/${this.endpointId}/overview`]);
      },
      error: (err: any) => {
        console.log(err);
        this.showError(err?.message);
        this.router.navigate([`apis/viewapi/${this.endpointId}/overview`]);
      }
    })
  }
}
