import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gateway-telemetry',
  templateUrl: './gateway-telemetry.component.html',
  styleUrl: './gateway-telemetry.component.css'
})
export class GatewayTelemetryComponent {

  tagsArray: any[] = [];
  globalTagsArray: any[] = [];
  headersToPassArray: any[] = [];
  objectMap: Map<string, string> = new Map();
  headerObjectMap: Map<string, string> = new Map();
  levelToolTip = "The reporting level, from more to less verbosity"
  TelemertyFormGroup: FormGroup;

  newRelicToolTip = "Push KrakenD metrics and distributed traces to your New Relic dashboard."
  opencensusToolTip = "The Opencensus middleware provides several integrations to export tracing and metrics to different third party systems."
  metricsApiToolTip = "The metrics API listens in a new address and exposes a /__stats/ endpoint with all the KrakenD metrics."
  openTelementryToolTip = "The OpenTelemetry middleware provides several integrations to export tracing and metrics to different third party systems."
  loggingToolTip = "Extend the default logging behaviour"
  logprefixToolTip = "Prepend a string before the the log lines"
  opTypeToolTip = "The format of the log record"
  syslogFacilityToolTip = "Facility to send the messages as set in the rsyslog standard"
  gelfAddToolTip = "The address (including the port) of your graylog server (or any service that receives gelf inputs)."
  enableTCPToolTip = "By default uses UDP but you can enable TCP by setting this  option to true(not recommended, your performance might suffer)."
  sampleRateToolTip = "Percentage of traces you want to sample (decimal between 0 and 1)."
  reportingPeriodToolTip = "Time between sent reports to the backend"
  metricsDisableEndpointToolTip = "Metrics won't be published but still collected (can be sent to InfluxDB)."
  metricsDisableProxyToolTip = "Skip any metrics happening in the proxy layer"
  metricsDisableRouterToolTip = "Skip any metrics happening in the router layer"
  metricsDisableBackendToolTip = "Skip any metrics when interacting with backends"
  listenAddToolTip = "Change the listen address where the metrics endpoint will be exposed. Defaults to :8090. "
  collecTimeToolTip = "Prepend a string before the the log lines"
  newRelicNativeLogprefixSDKActiveToolTip = " The API key provided by New Relic to push data into your account."
  newRelicSDKDebugToolTip = "Set to true when configuring New Relic for the first time while in development, to see the activity in the logs. Set to false in production."
  headertopassToolTip = "Defines an explicit list of headers sent during the client request that will be reported to NewRelic, in addition to the default headers NewRelic sets. Setting the * value will send all headers sent by the client to NewRelic. Whether you declare this setting or not, you will usually receive from the NewRelic SDK the Accept, Content-Type, User-Agent, and Referer headers"
  globalSettingSampleRateToolTip = "Percentage of requests you want to sample (0-100)."
  OCreportingPeriodToolTip = "Time between sent reports to the backend"
  prometheusNameToolTip = "A unique name to identify this exporter."
  prometheusPortToolTip = "The port in KrakenD where Prometheus will connect to"
  otlpPortToolTip = "The port where the collector listens"
  hostNameToolTip = " The host where you want to push the data"
  useHttpToolTip = "Check when the collector uses HTTP instead of gRPC"
  otlpNameToolTip = "Prepend a string before the the log lines"
  loggerToolTip = "Will use your Logger settings to expose the metrics"
  nameSpaceToolTip = "Namespace specifies the namespaces to which metric keys are appended"
  serviceToolTip = "Service specifies the service name used for tracing."
  traceAddressToolTip = "The host[:port] address of the Datadog Trace Agent. It defaults to localhost:8126"
  statsAddressToolTip = "The port where the collector listens"
  tagsToolTip = "Set of global tags to attach to each metric"
  globalTagsToolTip = " Set of tags applied to all exported spans"
  countPerBucketsToolTip = "Specifies whether to emit count_per_bucket metrics"
  relicServiceNameToolTip = "The service name as shown in the New Relic dashboard"
  relicApiKeyToolTip = "The API key provided by New Relic to push data into your account"
  relicSpansURLToolTip = "New Relic might use different endpoints to report traces from its customers depending on the location of their accounts"
  relicMetricsURLToolTip = "New Relic might use different endpoints to report metrics from its customers depending on the location of their accounts "
  relicsDebugToolTip = "Set to true when setting New Relic for the first time, and you want to see the logs of the exporter activity. Remove in production. "
  headerKeyToolTip = "Sent headers with its values."
  labelNameToolTip = "Enter here any label that will be assigned by default to the reported metric so you can filter later on Stack Driver."
  constructor(private fb: FormBuilder) {
    this.TelemertyFormGroup = this.fb.group({
      isLoggingActive: [false],
      logginngLevel: [],
      loggingPrefix: [],
      enableLogstash: [false],
      logMsgFormat: [],
      logStdOut: [false],
      logSysLog: [false],
      logSysLogFacility: [],
      isGelfActive: [false],
      GELFAdrress: [],
      enableTCP: [false],
      isOpenTelActive: [false],
      OTsampleRate: [],
      OTreportingPeriod: [],
      isMetricsAPiActive: [false],
      metricsDisableEndpoint: [false],
      metricsDisableProxy: [false],
      metricsDisableRouter: [false],
      metricsDisableBackend: [false],
      metricsListenAddress: [],
      metricCollecTime: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      openCensusActive: [true],
      otlp: this.fb.array([]),
      prometheus: this.fb.array([]),
      prometheusActive: [false],
      influxDBActive: [false],
      jaegerActive: [false],
      zipkinActive: [false],
      loggerActive: [false],
      newRelicActive: [false],
      datadogActive: [true],
      googleStkActive: [false],
      awsActice: [false],
      openCensusAgentActive: [false],
      OCsampleRate: [],
      OCreportingPeriod: [],
      zipkincollectorURL: [],
      zipkinServiceName: [],
      jeagerEndpoint: [],
      jeagerServiceName: [],
      influxDBaddress: [],
      infulxDBdatabase: [],
      influxwriteTimeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      port: [],
      prometheusPort: [],
      useCredFromEnvActice: [],
      awsRegion: [],
      awsService: [],
      awsAccessKey: [],
      awsSecretKey: [],
      stkMetricsPrefix: [],
      stkProjectID: [],
      labelName: [],
      labelValue: [],
      objectMapValue: [[]],
      datadogNamespace: [],
      datadogService: [],
      datadogTraceAdd: [],
      datadogStatusAdd: [],
      datadogTag: [],
      tagsArrayValue: [[]],
      globalTag: [],
      globalTagsArrayValue: [[]],
      countPerBuckets: [false],
      relicServiceName: [],
      relicApiKey: [],
      relicSpansURL: [],
      relicMetricsURL: [],
      relicsDebug: [false],
      ocagentCollectorsAddress: [],
      ocagentServiceName: [],
      ocagentReconTime: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      ocagentInsecure: [],
      ocagentEnableCompression: [],
      headerKey: [],
      headerValue: [],
      headerObjectMapValue: [],
      newRelicNativeSDKActive: [false],
      newRelicLicense: [],
      newRelicSDKDebug: [false],
      headersToPass: [],
      headersToPassArrayValue: [[]],
      openTelId: [null],
      openTelExporterId: [null]
    });

  }
  entireJsonData: any
  ngOnInit() {

    this.TelemertyFormGroup.get('useCredFromEnvActice')?.valueChanges.subscribe((value) => {
      if (value === true) {
        this.TelemertyFormGroup.get('awsAccessKey')?.reset();
        this.TelemertyFormGroup.get('awsSecretKey')?.reset();
      }
    });

    // this.sharedService.getEntireJsonData$().subscribe(data => {
    //   this.entireJsonData = data;

    // })
    console.log(this.entireJsonData);
    this.tagsArray = this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog?.tags || [];
    this.headersToPassArray = this.entireJsonData?.extra_config?.["telemetry/newrelic"]?.headers_to_pass || [];
    this.TelemertyFormGroup.patchValue({
      isLoggingActive: !!this.entireJsonData?.extra_config?.["telemetry/logging"],
      logginngLevel: this.entireJsonData?.extra_config?.["telemetry/logging"]?.level,
      loggingPrefix: this.entireJsonData?.extra_config?.["telemetry/logging"]?.prefix,
      // enableLogstash: [false],
      logMsgFormat: this.entireJsonData?.extra_config?.["telemetry/logging"]?.custom_format,
      logStdOut: this.entireJsonData?.extra_config?.["telemetry/logging"]?.stdout,
      logSysLog: this.entireJsonData?.extra_config?.["telemetry/logging"]?.syslog,
      logSysLogFacility: this.entireJsonData?.extra_config?.["telemetry/logging"]?.syslog_facility,
      isGelfActive: false,
      // GELFAdrress: [],
      // enableTCP: [false],
      isOpenTelActive: !!this.entireJsonData?.extra_config?.["telemetry/opentelemetry"],
      OTsampleRate: this.entireJsonData?.extra_config?.["telemetry/opentelemetry"]?.trace_sample_rate,
      OTreportingPeriod: this.entireJsonData?.extra_config?.["telemetry/opentelemetry"]?.metric_reporting_period,
      isMetricsAPiActive: !!this.entireJsonData?.extra_config?.["telemetry/metrics"],
      metricsDisableEndpoint: this.entireJsonData?.extra_config?.["telemetry/metrics"]?.endpoint_disabled,
      metricsDisableProxy: this.entireJsonData?.extra_config?.["telemetry/metrics"]?.proxy_disabled,
      metricsDisableRouter: this.entireJsonData?.extra_config?.["telemetry/metrics"]?.router_disabled,
      metricsDisableBackend: this.entireJsonData?.extra_config?.["telemetry/metrics"]?.backend_disabled,
      metricsListenAddress: this.entireJsonData?.extra_config?.["telemetry/metrics"]?.listen_address,
      metricCollecTime: this.entireJsonData?.extra_config?.["telemetry/metrics"]?.collection_time,
      openCensusActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"],
      otlp: this.entireJsonData?.extra_config?.["telemetry/opentelemetry"]?.exporters?.otlp,
      prometheus: this.entireJsonData?.extra_config?.["telemetry/opentelemetry"]?.exporters?.prometheus,
      prometheusActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.prometheus,
      influxDBActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.influxdb,
      jaegerActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.jeager,
      zipkinActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.zipkin,
      loggerActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.logger,
      newRelicActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.newrelic,
      datadogActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog,
      googleStkActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.stackdriver,
      awsActice: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.xray,
      openCensusAgentActive: !!this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.ocagent,
      // OCsampleRate: [],
      // OCreportingPeriod: [],
      zipkincollectorURL: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.zipkin?.collector_url,
      zipkinServiceName: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.zipkin?.service_name,
      jeagerEndpoint: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.jeager?.endpoint,
      jeagerServiceName: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.jeager?.service_name,
      influxDBaddress: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.influxdb?.address,
      infulxDBdatabase: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.influxdb?.db,
      influxwriteTimeout: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.influxdb?.timeout,
      // port: [],
      prometheusPort: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.prometheus?.port,
      useCredFromEnvActice: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.xray?.use_env,
      awsRegion: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.xray?.region,
      awsService: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.xray?.version,
      awsAccessKey: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.xray?.access_key_id,
      awsSecretKey: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.xray?.awsSecretKey,
      stkMetricsPrefix: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.stackdriver?.metric_prefix,
      stkProjectID: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.stackdriver?.project_id,
      // labelName: [],
      // labelValue: [],
      // objectMapValue: [[]],
      datadogNamespace: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog?.namespace,
      datadogService: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog?.service,
      datadogTraceAdd: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog?.trace_address,
      datadogStatusAdd: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog?.stats_address,
      // datadogTag: [],
      tagsArrayValue: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog?.tags,
      // globalTag: [],
      globalTagsArrayValue: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog?.global_tags,
      countPerBuckets: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.datadog?.disable_count_per_buckets,
      relicServiceName: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.newrelic?.service_name,
      relicApiKey: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.newrelic?.api_key,
      relicSpansURL: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.newrelic?.spans_url,
      relicMetricsURL: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.newrelic?.metrics_url,
      relicsDebug: this.entireJsonData?.extra_config?.["telemetry/opencensus"]?.exporters?.newrelic?.debug,
      ocagentCollectorsAddress: this.entireJsonData?.extra_config?.["telemetry/opencencus"]?.exporters?.ocagent?.address,
      ocagentServiceName: this.entireJsonData?.extra_config?.["telemetry/opencencus"]?.exporters?.ocagent?.service_name,
      ocagentReconTime: this.entireJsonData?.extra_config?.["telemetry/opencencus"]?.exporters?.ocagent?.reconnection,
      ocagentInsecure: this.entireJsonData?.extra_config?.["telemetry/opencencus"]?.exporters?.ocagent?.insecure,
      ocagentEnableCompression: this.entireJsonData?.extra_config?.["telemetry/opencencus"]?.exporters?.ocagent?.enable_compression,
      // headerKey: [],
      // headerValue: [],
      // headerObjectMapValue: [],
      newRelicNativeSDKActive: !!this.entireJsonData?.extra_config?.["telemetry/newrelic"],
      newRelicLicense: this.entireJsonData?.extra_config?.["telemetry/newrelic"]?.license,
      newRelicSDKDebug: this.entireJsonData?.extra_config?.["telemetry/newrelic"]?.debug,
      // headersToPass: [],
      headersToPassArrayValue: this.entireJsonData?.extra_config?.["telemetry/newrelic"]?.headers_to_pass,
      openTelId: this.entireJsonData?.extra_config?.["telemetry/opentelemetry"]?.id,
      openTelExporterId: this.entireJsonData?.extra_config?.["telemetry/opentelemetry"]?.exporters?.id
    })
  }
  emitValue() {
    console.log(this.TelemertyFormGroup.value);
    const telementryBody = {}
    //  const telementryBody =  {
    //   "name": "Telementry and Analytics"
    //   "extra_config": {
    //     //   ...(this.telemetryData?.isOpenTelActive && 

    //     //     {
    //     //     "telemetry/opentelemetry": {
    //     //     "id": this.telemetryData?.openTelId ? this.telemetryData?.openTelId:null,
    //     //     // "service_name": null,
    //     //     ...(this.telemetryData?.OTreportingPeriod &&{"metric_reporting_period": this.telemetryData?.OTreportingPeriod}),
    //     //     ...(this.telemetryData?.OTsampleRate &&{"trace_sample_rate": this.telemetryData?.OTsampleRate}),
    //     //     // "service_version": null,
    //     //     // "skip_paths": [
    //     //     //   ''
    //     //     // ],
    //     //     "exporters": {
    //     //       "id": this.telemetryData?.openTelExporterId ? this.telemetryData?.openTelExporterId:null,
    //     //       ...(this.telemetryData?.otlp.length!==0)&&{"otlp": this.telemetryData?.otlp},
    //     //       ...(this.telemetryData?.prometheus.length!==0)&&{"prometheus": this.telemetryData?.prometheus}
    //     //     },
    //     //   }
    //     // }
    //     // ),
    //     ...(this.telemetryData?.isOpenTelActive && {
    //       "telemetry/opentelemetry": {
    //         "id": this.telemetryData?.openTelId ? this.telemetryData?.openTelId : null,
    //         ...(this.telemetryData?.OTreportingPeriod && { "metric_reporting_period": this.telemetryData?.OTreportingPeriod }),
    //         ...(this.telemetryData?.OTsampleRate && { "trace_sample_rate": this.telemetryData?.OTsampleRate }),
    //         "exporters": {
    //           "id": this.telemetryData?.openTelExporterId ? this.telemetryData?.openTelExporterId : null,
    //           ...(this.telemetryData?.otlp.length !== 0) && { "otlp": this.telemetryData?.otlp },
    //           ...(this.telemetryData?.prometheus.length !== 0) && { "prometheus": this.telemetryData?.prometheus }
    //         }
    //       }
    //     }),

    //     // ...(this.TelemertyFormGroup.get('isLoggingActive').value &&{"telemetry/logging": {
    //     //   ...(this.TelemertyFormGroup?.logMsgFormat &&{"format": this.TelemertyFormGroup?.logMsgFormat}),
    //     //   ...(this.TelemertyFormGroup?.logSysLogFacility &&{"syslog_facility": this.TelemertyFormGroup?.logSysLogFacility}),
    //     //   ...(this.TelemertyFormGroup?.logginngLevel &&{"level": this.TelemertyFormGroup?.logginngLevel}),
    //     //   ...(this.TelemertyFormGroup?.loggingPrefix &&{"prefix": this.TelemertyFormGroup?.loggingPrefix}),
    //     //   ...(this.TelemertyFormGroup?.logSysLog &&{"syslog": this.TelemertyFormGroup?.logSysLog}),
    //     //   ...(this.TelemertyFormGroup?.logStdOut &&{"stdout": this.TelemertyFormGroup?.logStdOut})
    //     // }}),
    //     ...(this.TelemertyFormGroup.get('isLoggingActive')?.value && {
    //       "telemetry/logging": {
    //         ...(this.TelemertyFormGroup.get('logMsgFormat')?.value && {
    //           format: this.TelemertyFormGroup.get('logMsgFormat')?.value,
    //         }),
    //         ...(this.TelemertyFormGroup.get('logSysLogFacility')?.value && {
    //           syslog_facility: this.TelemertyFormGroup.get('logSysLogFacility')?.value,
    //         }),
    //         ...(this.TelemertyFormGroup.get('loggingLevel')?.value && {
    //           level: this.TelemertyFormGroup.get('loggingLevel')?.value,
    //         }),
    //         ...(this.TelemertyFormGroup.get('loggingPrefix')?.value && {
    //           prefix: this.TelemertyFormGroup.get('loggingPrefix')?.value,
    //         }),
    //         ...(this.TelemertyFormGroup.get('logSysLog')?.value && {
    //           syslog: this.TelemertyFormGroup.get('logSysLog')?.value,
    //         }),
    //         ...(this.TelemertyFormGroup.get('logStdOut')?.value && {
    //           stdout: this.TelemertyFormGroup.get('logStdOut')?.value,
    //         }),
    //       },
    //     }),

    //     // ...(this.TelemertyFormGroup?.isGelfActive && {"telemetry/gelf": {
    //     //   ...(this.TelemertyFormGroup?.GELFAdrress &&{"address": this.TelemertyFormGroup?.GELFAdrress}),
    //     //   ...(this.TelemertyFormGroup?.enableTCP &&{"enable_tcp": this.TelemertyFormGroup?.enableTCP})
    //     // }}),
    //     ...(this.TelemertyFormGroup.get('isGelfActive')?.value && {
    //       "telemetry/gelf": {
    //         ...(this.TelemertyFormGroup.get('GELFAdrress')?.value && {
    //           address: this.TelemertyFormGroup.get('GELFAdrress')?.value,
    //         }),
    //         ...(this.TelemertyFormGroup.get('enableTCP')?.value && {
    //           enable_tcp: this.TelemertyFormGroup.get('enableTCP')?.value,
    //         }),
    //       },
    //     }),

    //     // ...(this.apiMonetizationdata?.isApiMonetizationActive &&{"telemetry/moesif": {
    //     //   // "@comment": null,
    //     //   "application_id": this.apiMonetizationdata?.apiMonetizationAppIDForm,
    //     //   "user_id_headers": this.apiMonetizationdata?.apiMonetizationHeadersFormArray,
    //     //   "user_id_jwt_claim": this.apiMonetizationdata?.apiMonetizationClaimForm,
    //     //   // "identify_company": {
    //     //   //   "jwt_claim": null
    //     //   // },
    //     //   "debug": this.apiMonetizationdata?.apiMonetizationDebugForm,
    //     //   // "log_body": true,
    //     //   // "event_queue_size": 0,
    //     //   // "batch_size": 0,
    //     //   // "timer_wake_up_seconds": 0,
    //     //   // "request_body_masks": [
    //     //   //   ''
    //     //   // ],
    //     //   // "request_header_masks": [
    //     //   //   ''
    //     //   // ],
    //     //   // "response_body_masks": [
    //     //   //   ''
    //     //   // ],
    //     //   // "response_header_masks": [
    //     //   //   ''
    //     //   // ],
    //     //   // "should_skip": null
    //     // }}),
    //     ...(this.apiMonetizationdata?.isApiMonetizationActive && {
    //       "telemetry/moesif": {
    //         ...(this.apiMonetizationdata?.apiMonetizationAppIDForm && {
    //           application_id: this.apiMonetizationdata.apiMonetizationAppIDForm,
    //         }),
    //         ...(this.apiMonetizationdata?.apiMonetizationHeadersFormArray && {
    //           user_id_headers: this.apiMonetizationdata.apiMonetizationHeadersFormArray,
    //         }),
    //         ...(this.apiMonetizationdata?.apiMonetizationClaimForm && {
    //           user_id_jwt_claim: this.apiMonetizationdata.apiMonetizationClaimForm,
    //         }),
    //         ...(this.apiMonetizationdata?.apiMonetizationDebugForm !== undefined && {
    //           debug: this.apiMonetizationdata.apiMonetizationDebugForm,
    //         }),
    //         // Uncomment and conditionally add other fields if needed
    //         // ...(this.apiMonetizationdata?.logBody !== undefined && {
    //         //   log_body: this.apiMonetizationdata.logBody,
    //         // }),
    //         // ...(this.apiMonetizationdata?.eventQueueSize !== undefined && {
    //         //   event_queue_size: this.apiMonetizationdata.eventQueueSize,
    //         // }),
    //       },
    //     }),


    //     // ...(this.TelemertyFormGroup?.openCensusActive && 
    //     //   {
    //     //     "telemetry/opencensus": {
    //     //   // "enabled_layers": {
    //     //   //   "backend": true,
    //     //   //   "pipe": true,
    //     //   //   "router": true
    //     //   // },
    //     //   "exporters": {
    //     //     ...(this.TelemertyFormGroup?.datadogActive && {
    //     //       "datadog": {
    //     //         ...(this.TelemertyFormGroup?.datadogNamespace) &&{"namespace": this.TelemertyFormGroup?.datadogNamespace},
    //     //         ...(this.TelemertyFormGroup?.datadogService) &&{"service": this.TelemertyFormGroup?.datadogService},
    //     //         ...(this.TelemertyFormGroup?.datadogTraceAdd) &&{"trace_address": this.TelemertyFormGroup?.datadogTraceAdd},
    //     //         ...(this.TelemertyFormGroup?.datadogStatusAdd) &&{"stats_address": this.TelemertyFormGroup?.datadogStatusAdd},
    //     //         ...(this.TelemertyFormGroup?.tagsArrayValue) &&{"tags": this.TelemertyFormGroup?.tagsArrayValue},
    //     //         ...(this.TelemertyFormGroup?.globalTagsArrayValue &&{"global_tags": this.TelemertyFormGroup?.globalTagsArrayValue}),
    //     //         ...(this.TelemertyFormGroup?.countPerBuckets &&{"disable_count_per_buckets": this.TelemertyFormGroup?.countPerBuckets})
    //     //     },
    //     //     }),
    //     //     ...(this.TelemertyFormGroup?.influxDBActive) &&{
    //     //     "influxdb": {
    //     //       ...(this.TelemertyFormGroup?.influxDBaddress)&&{"address": this.TelemertyFormGroup?.influxDBaddress},
    //     //       ...(this.TelemertyFormGroup?.infulxDBdatabase) &&{"db": this.TelemertyFormGroup?.infulxDBdatabase},
    //     //       // "username": null,
    //     //       // "password": null,
    //     //       ...(this.TelemertyFormGroup?.influxwriteTimeout)&&{"timeout": this.TelemertyFormGroup?.influxwriteTimeout}
    //     //     }
    //     //     },
    //     //     ...(this.TelemertyFormGroup?.jaegerActive) && {
    //     //       "jeager":{
    //     //       //   "agent_endpoint": null,
    //     //       // "buffer_max_count": 0,
    //     //       ...(this.TelemertyFormGroup?.jeagerEndpoint)&&{"endpoint": this.TelemertyFormGroup?.jeagerEndpoint},
    //     //       ...(this.TelemertyFormGroup?.jeagerServiceName)&&{"service_name": this.TelemertyFormGroup?.jeagerServiceName}
    //     //       }
    //     //     },
    //     //     ...(this.TelemertyFormGroup?.loggerActive &&
    //     //       {"logger": {
    //     //       // "spans": true,
    //     //       // "stats": true
    //     //     }}),
    //     //     ...(this.TelemertyFormGroup?.openCensusAgentActive &&
    //     //       {"ocagent": {
    //     //       ...(this.TelemertyFormGroup?.ocagentCollectorsAddress &&{"address": this.TelemertyFormGroup?.ocagentCollectorsAddress}),
    //     //       ...(this.TelemertyFormGroup?.ocagentEnableCompression &&{"enable_compression": this.TelemertyFormGroup?.ocagentEnableCompression}),
    //     //       ...(this.TelemertyFormGroup?.headerObjectMapValue&&{"headers": openCensusAGentObj}),
    //     //       ...(this.TelemertyFormGroup?.ocagentInsecure &&{"insecure": this.TelemertyFormGroup?.ocagentInsecure}),
    //     //       ...(this.TelemertyFormGroup?.ocagentReconTime &&{"reconnection": this.TelemertyFormGroup?.ocagentReconTime}),
    //     //       ...(this.TelemertyFormGroup?.ocagentServiceName &&{"service_name": this.TelemertyFormGroup?.ocagentServiceName})
    //     //     }}),
    //     //     ...(this.TelemertyFormGroup?.prometheusActive &&{
    //     //       "prometheus": {
    //     //       // "namespace": null,
    //     //       "port": this.TelemertyFormGroup?.prometheusPort,
    //     //       // "tag_host": true,
    //     //       // "tag_method": true,
    //     //       // "tag_path": true,
    //     //       // "tag_statuscode": true
    //     //     }}),
    //     //     ...(this.TelemertyFormGroup?.googleStkActive &&{
    //     //       "stackdriver": {
    //     //       ...(this.TelemertyFormGroup?.stkProjectID &&{"project_id": this.TelemertyFormGroup?.stkProjectID}),
    //     //       ...(this.TelemertyFormGroup?.objectMapValue &&{"default_labels": telStackDriverObj}),
    //     //       ...(this.TelemertyFormGroup?.stkMetricsPrefix &&{"metric_prefix": this.TelemertyFormGroup?.stkMetricsPrefix})
    //     //     }}),
    //     //     ...(this.TelemertyFormGroup?.awsActice &&{
    //     //       "xray": {
    //     //       ...(this.TelemertyFormGroup?.awsRegion &&{"region": this.TelemertyFormGroup?.awsRegion}),
    //     //       ...(this.TelemertyFormGroup?.awsService &&{"version": this.TelemertyFormGroup?.awsService}),
    //     //       ...(this.TelemertyFormGroup?.awsAccessKey &&{"access_key_id": this.TelemertyFormGroup?.awsAccessKey}),
    //     //       ...(this.TelemertyFormGroup?.awsSecretKey &&{"secret_access_key": this.TelemertyFormGroup?.awsSecretKey}),
    //     //       ...(this.TelemertyFormGroup?.useCredFromEnvActice &&{"use_env": this.TelemertyFormGroup?.useCredFromEnvActice})
    //     //     }}),
    //     //     ...(this.TelemertyFormGroup?.zipkinActive &&
    //     //     {"zipkin": {
    //     //       ...(this.TelemertyFormGroup?.zipkincollectorURL)&& {"collector_url": this.TelemertyFormGroup?.zipkincollectorURL},
    //     //       ...(this.TelemertyFormGroup?.zipkinServiceName)&&{"service_name": this.TelemertyFormGroup?.zipkinServiceName}
    //     //     }}),
    //     //     ...(this.TelemertyFormGroup?.newRelicActive &&{
    //     //       "newrelic": {
    //     //       ...(this.TelemertyFormGroup?.relicServiceName &&{"service_name": this.TelemertyFormGroup?.relicServiceName}),
    //     //       ...(this.TelemertyFormGroup?.relicApiKey &&{"api_key": this.TelemertyFormGroup?.relicApiKey}),
    //     //       ...(this.TelemertyFormGroup?.relicSpansURL &&{"spans_url": this.TelemertyFormGroup?.relicSpansURL}),
    //     //       ...(this.TelemertyFormGroup?.relicMetricsURL &&{"metrics_url": this.TelemertyFormGroup?.relicMetricsURL}),
    //     //       ...(this.TelemertyFormGroup?.relicsDebug &&{"debug": this.TelemertyFormGroup?.relicsDebug})
    //     //     }})
    //     //   },
    //     //   "reporting_period": this.TelemertyFormGroup?.OTreportingPeriod,
    //     //   "sample_rate": this.TelemertyFormGroup?.OTsampleRate
    //     // },
    //     //   }
    //     // ),
    //     ...(this.TelemertyFormGroup?.openCensusActive && {
    //       "telemetry/opencensus": {
    //         "exporters": {
    //           ...(this.TelemertyFormGroup?.datadogActive && {
    //             "datadog": {
    //               ...(this.TelemertyFormGroup?.datadogNamespace && { "namespace": this.TelemertyFormGroup?.datadogNamespace }),
    //               ...(this.TelemertyFormGroup?.datadogService && { "service": this.TelemertyFormGroup?.datadogService }),
    //               ...(this.TelemertyFormGroup?.datadogTraceAdd && { "trace_address": this.TelemertyFormGroup?.datadogTraceAdd }),
    //               ...(this.TelemertyFormGroup?.datadogStatusAdd && { "stats_address": this.TelemertyFormGroup?.datadogStatusAdd }),
    //               ...(this.TelemertyFormGroup?.tagsArrayValue && { "tags": this.TelemertyFormGroup?.tagsArrayValue }),
    //               ...(this.TelemertyFormGroup?.globalTagsArrayValue && { "global_tags": this.TelemertyFormGroup?.globalTagsArrayValue }),
    //               ...(this.TelemertyFormGroup?.countPerBuckets && { "disable_count_per_buckets": this.TelemertyFormGroup?.countPerBuckets })
    //             }
    //           }),
    //           ...(this.TelemertyFormGroup?.influxDBActive && {
    //             "influxdb": {
    //               ...(this.TelemertyFormGroup?.influxDBaddress && { "address": this.TelemertyFormGroup?.influxDBaddress }),
    //               ...(this.TelemertyFormGroup?.infulxDBdatabase && { "db": this.TelemertyFormGroup?.infulxDBdatabase }),
    //               ...(this.TelemertyFormGroup?.influxwriteTimeout && { "timeout": this.TelemertyFormGroup?.influxwriteTimeout })
    //             }
    //           }),
    //           ...(this.TelemertyFormGroup?.jaegerActive && {
    //             "jeager": {
    //               ...(this.TelemertyFormGroup?.jeagerEndpoint && { "endpoint": this.TelemertyFormGroup?.jeagerEndpoint }),
    //               ...(this.TelemertyFormGroup?.jeagerServiceName && { "service_name": this.TelemertyFormGroup?.jeagerServiceName })
    //             }
    //           }),
    //           ...(this.TelemertyFormGroup?.loggerActive && {
    //             "logger": {}
    //           }),
    //           ...(this.TelemertyFormGroup?.openCensusAgentActive && {
    //             "ocagent": {
    //               ...(this.TelemertyFormGroup?.ocagentCollectorsAddress && { "address": this.TelemertyFormGroup?.ocagentCollectorsAddress }),
    //               ...(this.TelemertyFormGroup?.ocagentEnableCompression && { "enable_compression": this.TelemertyFormGroup?.ocagentEnableCompression }),
    //               ...(this.TelemertyFormGroup?.headerObjectMapValue && { "headers": openCensusAGentObj }),
    //               ...(this.TelemertyFormGroup?.ocagentInsecure && { "insecure": this.TelemertyFormGroup?.ocagentInsecure }),
    //               ...(this.TelemertyFormGroup?.ocagentReconTime && { "reconnection": this.TelemertyFormGroup?.ocagentReconTime }),
    //               ...(this.TelemertyFormGroup?.ocagentServiceName && { "service_name": this.TelemertyFormGroup?.ocagentServiceName })
    //             }
    //           }),
    //           ...(this.TelemertyFormGroup?.prometheusActive && {
    //             "prometheus": {
    //               "port": this.TelemertyFormGroup?.prometheusPort
    //             }
    //           }),
    //           ...(this.TelemertyFormGroup?.googleStkActive && {
    //             "stackdriver": {
    //               ...(this.TelemertyFormGroup?.stkProjectID && { "project_id": this.TelemertyFormGroup?.stkProjectID }),
    //               ...(this.TelemertyFormGroup?.objectMapValue && { "default_labels": telStackDriverObj }),
    //               ...(this.TelemertyFormGroup?.stkMetricsPrefix && { "metric_prefix": this.TelemertyFormGroup?.stkMetricsPrefix })
    //             }
    //           }),
    //           ...(this.TelemertyFormGroup?.awsActice && {
    //             "xray": {
    //               ...(this.TelemertyFormGroup?.awsRegion && { "region": this.TelemertyFormGroup?.awsRegion }),
    //               ...(this.TelemertyFormGroup?.awsService && { "version": this.TelemertyFormGroup?.awsService }),
    //               ...(this.TelemertyFormGroup?.awsAccessKey && { "access_key_id": this.TelemertyFormGroup?.awsAccessKey }),
    //               ...(this.TelemertyFormGroup?.awsSecretKey && { "secret_access_key": this.TelemertyFormGroup?.awsSecretKey }),
    //               ...(this.TelemertyFormGroup?.useCredFromEnvActice && { "use_env": this.TelemertyFormGroup?.useCredFromEnvActice })
    //             }
    //           }),
    //           ...(this.TelemertyFormGroup?.zipkinActive && {
    //             "zipkin": {
    //               ...(this.TelemertyFormGroup?.zipkincollectorURL && { "collector_url": this.TelemertyFormGroup?.zipkincollectorURL }),
    //               ...(this.TelemertyFormGroup?.zipkinServiceName && { "service_name": this.TelemertyFormGroup?.zipkinServiceName })
    //             }
    //           }),
    //           ...(this.TelemertyFormGroup?.newRelicActive && {
    //             "newrelic": {
    //               ...(this.TelemertyFormGroup?.relicServiceName && { "service_name": this.TelemertyFormGroup?.relicServiceName }),
    //               ...(this.TelemertyFormGroup?.relicApiKey && { "api_key": this.TelemertyFormGroup?.relicApiKey }),
    //               ...(this.TelemertyFormGroup?.relicSpansURL && { "spans_url": this.TelemertyFormGroup?.relicSpansURL }),
    //               ...(this.TelemertyFormGroup?.relicMetricsURL && { "metrics_url": this.TelemertyFormGroup?.relicMetricsURL }),
    //               ...(this.TelemertyFormGroup?.relicsDebug && { "debug": this.TelemertyFormGroup?.relicsDebug })
    //             }
    //           })
    //         },
    //         "reporting_period": this.TelemertyFormGroup?.OTreportingPeriod,
    //         "sample_rate": this.TelemertyFormGroup?.OTsampleRate
    //       }
    //     }),



    //     // ...(this.TelemertyFormGroup?.newRelicNativeSDKActive &&{"telemetry/newrelic": {
    //     //   ...(this.TelemertyFormGroup?.newRelicSDKDebug &&{"debug": this.TelemertyFormGroup?.newRelicSDKDebug}),
    //     //   ...(this.TelemertyFormGroup?.headersToPassArrayValue.length!=0 &&{"headers_to_pass": this.TelemertyFormGroup?.headersToPassArrayValue}),
    //     //   ...(this.TelemertyFormGroup?.newRelicLicense &&{"license": this.TelemertyFormGroup?.newRelicLicense})
    //     // }}),
    //     ...(this.TelemertyFormGroup?.newRelicNativeSDKActive && {
    //       "telemetry/newrelic": {
    //         ...(this.TelemertyFormGroup?.newRelicSDKDebug && { "debug": this.TelemertyFormGroup?.newRelicSDKDebug }),
    //         ...(this.TelemertyFormGroup?.headersToPassArrayValue.length != 0 && { "headers_to_pass": this.TelemertyFormGroup?.headersToPassArrayValue }),
    //         ...(this.TelemertyFormGroup?.newRelicLicense && { "license": this.TelemertyFormGroup?.newRelicLicense })
    //       }
    //     }),

    //     // ...(this.TelemertyFormGroup?.isMetricsAPiActive &&{"telemetry/metrics": {
    //     //   ...(this.TelemertyFormGroup?.metricsDisableBackend && {"backend_disabled": this.TelemertyFormGroup?.metricsDisableBackend}),
    //     //   ...(this.TelemertyFormGroup?.metricCollecTime && {"collection_time": this.TelemertyFormGroup?.metricCollecTime}),
    //     //   ...(this.TelemertyFormGroup?.metricsDisableEndpoint && {"endpoint_disabled": this.TelemertyFormGroup?.metricsDisableEndpoint}),
    //     //   ...(this.TelemertyFormGroup?.metricsListenAddress && {"listen_address": this.TelemertyFormGroup?.metricsListenAddress}),
    //     //   ...(this.TelemertyFormGroup?.metricsDisableProxy && {"proxy_disabled": this.TelemertyFormGroup?.metricsDisableProxy}),
    //     //   ...(this.TelemertyFormGroup?.metricsDisableRouter && {"router_disabled": this.telemetryData?.metricsDisableRouter})
    //     // }})
    //     ...(this.TelemertyFormGroup?.isMetricsAPiActive && {
    //       "telemetry/metrics": {
    //         ...(this.TelemertyFormGroup?.metricsDisableBackend && { "backend_disabled": this.TelemertyFormGroup?.metricsDisableBackend }),
    //         ...(this.TelemertyFormGroup?.metricCollecTime && { "collection_time": this.TelemertyFormGroup?.metricCollecTime }),
    //         ...(this.TelemertyFormGroup?.metricsDisableEndpoint && { "endpoint_disabled": this.TelemertyFormGroup?.metricsDisableEndpoint }),
    //         ...(this.TelemertyFormGroup?.metricsListenAddress && { "listen_address": this.TelemertyFormGroup?.metricsListenAddress }),
    //         ...(this.TelemertyFormGroup?.metricsDisableProxy && { "proxy_disabled": this.TelemertyFormGroup?.metricsDisableProxy }),
    //         ...(this.TelemertyFormGroup?.metricsDisableRouter && { "router_disabled": this.telemetryData?.metricsDisableRouter })
    //       }
    //     }),

    //   }
    //  }
    console.log("*******************telemertyformdata", telementryBody);

    // if(this.TelemertyFormGroup.valid){
    //   this.sharedService.setTelemetryData(this.TelemertyFormGroup.value)
    //   this._snackBar.open('Saved Successfully', 'OK', {
    //     duration: 3000
    //   });
    // }else{
    //   this._snackBar.open('Please fill required details', 'OK', {
    //     duration: 3000
    //   });
    // }

  }
  addParameter(fieldName: 'label' | 'datadogTag' | 'globalTag' | 'header' | 'headersToPass') {
    const fieldValue = this.TelemertyFormGroup.get(fieldName)?.value;

    if (fieldName) {
      if (fieldName === 'label') {
        const labelName = this.TelemertyFormGroup.get('labelName')?.value;
        const labelValue = this.TelemertyFormGroup.get('labelValue')?.value;

        if (labelName && labelValue) {
          this.addToMap(labelName, labelValue, fieldName)
        }
      } else if (fieldName === 'header') {
        const headerKey = this.TelemertyFormGroup.get('headerKey')?.value;
        const headerValue = this.TelemertyFormGroup.get('headerValue')?.value;

        if (headerKey && headerValue) {
          this.addToMap(headerKey, headerValue, fieldName)
        }

      } else if (fieldName === 'datadogTag') {
        this.tagsArray.push(fieldValue);
        this.TelemertyFormGroup.get('tagsArrayValue')?.setValue([...this.tagsArray])
      } else if (fieldName === 'globalTag') {
        this.globalTagsArray.push(fieldValue);
        this.TelemertyFormGroup.get('globalTagsArrayValue')?.setValue([...this.globalTagsArray])
      } else if (fieldName === 'headersToPass') {
        this.headersToPassArray.push(fieldValue)
        this.TelemertyFormGroup.get('headersToPassArrayValue')?.setValue([...this.headersToPassArray])
      }

      this.TelemertyFormGroup.get(fieldName)?.reset();
    }
  }

  removeParameter(index: any, fieldName: 'label' | 'datadogTag' | 'globalTag' | 'header' | 'headersToPass') {
    if (fieldName === 'label') {
      this.removeFromMap(index, fieldName);
    } else if (fieldName === 'datadogTag') {
      this.tagsArray.splice(index, 1);
      this.TelemertyFormGroup.get('tagsArrayValue')?.setValue([...this.tagsArray]);
    } else if (fieldName === 'globalTag') {
      this.globalTagsArray.splice(index, 1);
      this.TelemertyFormGroup.get('globalTagsArrayValue')?.setValue([...this.globalTagsArray])
    } else if (fieldName === 'headersToPass') {
      this.headersToPassArray.splice(index, 1);
      this.TelemertyFormGroup.get('headersToPassArrayValue')?.setValue([...this.headersToPassArray])
    }

  }


  updateMapControl(which: any) {

    // Convert Map to array of key-value pairs
    if (which === 'label') {
      const mapArray: any = Array.from(this.objectMap.entries());
      this.TelemertyFormGroup.get('objectMapValue')?.setValue(mapArray);
    } else if (which === 'header') {
      const mapArray: any = Array.from(this.headerObjectMap.entries());
      this.TelemertyFormGroup.get('headerObjectMapValue')?.setValue(mapArray);
    }

  }

  addToMap(key: string, value: string, which: any) {

    if (which === 'label') {
      this.objectMap.set(key, value);
      this.updateMapControl(which);
    } else if (which === 'header') {
      this.headerObjectMap.set(key, value);
      this.updateMapControl(which);
    }
    // Sync form control with updated Map
  }

  removeFromMap(key: string, which: any) {
    if (which === 'label') {
      this.objectMap.delete(key);
      this.updateMapControl(which);
    } else if (which === 'header') {
      this.headerObjectMap.delete(key);
      this.updateMapControl(which);
    }
    // Sync form control with updated Map
  }

  getMapFromControl(): Map<string, string> {
    const mapArray = this.TelemertyFormGroup.get('objectMapValue')?.value || [];
    return new Map(mapArray);
  }

  createOtlpConfigGroup(): FormGroup {
    return this.fb.group({
      id: null,
      name: ['otlp_exporter', Validators.required],
      host: ['otlp.yourprovider.net', Validators.required],
      port: [4317, Validators.required],
      use_http: [false],
      disable_metrics: [false],
      disable_traces: [false],
    });
  }

  createPrometheusConfigGroup(): FormGroup {
    return this.fb.group({
      id: null,
      name: [],
      port: []
    })
  }

  get otlpArray(): FormArray {
    return this.TelemertyFormGroup.get('otlp') as FormArray;
  }

  get prometheusArray(): FormArray {
    return this.TelemertyFormGroup.get('prometheus') as FormArray;
  }

  addOtlpConfig() {
    this.otlpArray.push(this.createOtlpConfigGroup());
  }

  addPromethusConfig() {
    this.prometheusArray.push(this.createPrometheusConfigGroup());
  }

  removePromethusConfig(index: number) {
    this.prometheusArray.removeAt(index);
  }

  removeOtlpConfig(index: number) {
    this.otlpArray.removeAt(index);
  }

}
