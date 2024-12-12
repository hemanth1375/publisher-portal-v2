import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApicardsComponent } from './apicards/apicards.component';
import { GatewaycardsComponent } from './gatewaycards/gatewaycards.component';
import { CreateapiComponent } from './createapi/createapi.component';
import { ViewapiComponent } from './viewapi/viewapi.component';
import { ApiOverviewComponent } from './api-overview/api-overview.component';
import { ParameterForwardingComponent } from './parameter-forwarding/parameter-forwarding.component';
import { AuthComponent } from './auth/auth.component';
import { DeploymentComponent } from './deployment/deployment.component';
import { CreategatewayComponent } from './creategateway/creategateway.component';
import { ViewgatewayComponent } from './viewgateway/viewgateway.component';
import { GatewayDashboardComponent } from './gateway-dashboard/gateway-dashboard.component';
import { BackendComponent } from './backend/backend.component';
import { ThrottlingComponent } from './throttling/throttling.component';
import { PoliciesComponent } from './policies/policies.component';
import { ResponseManipulationComponent } from './response-manipulation/response-manipulation.component';
import { ConnectivityComponent } from './connectivity/connectivity.component';
import { OpenapiComponent } from './openapi/openapi.component';
import { GatewayServiceSettingsComponent } from './gateway-service-settings/gateway-service-settings.component';
import { GatewayTelemetryComponent } from './gateway-telemetry/gateway-telemetry.component';

const routes: Routes = [
  {path:"apis",component:ApicardsComponent,children:[
    {path:"createapi",component:CreateapiComponent},
    {path:"viewapi/:id",component:ViewapiComponent,children:[
      {path:"overview",component:ApiOverviewComponent},
      {path:"parameter",component:ParameterForwardingComponent},
      {path:"auth",component:AuthComponent},
      {path:"backends",component:BackendComponent},
      {path:"throttling",component:ThrottlingComponent},
      {path:"deployments",component:DeploymentComponent},
      {path:"policies",component:PoliciesComponent},
      {path:"response",component:ResponseManipulationComponent},
      {path:"connectivity",component:ConnectivityComponent},
      {path:"openapi",component:OpenapiComponent}
    ]}
  ]},
  {path:"gateways",component:GatewaycardsComponent,children:[
    {path:"creategateway",component:CreategatewayComponent},
    {path:"viewgateway/:id", component:ViewgatewayComponent,children:[
      {path:"dashboard",component:GatewayDashboardComponent},
      {path:"service",component:GatewayServiceSettingsComponent},
      {path:"telemetry",component:GatewayTelemetryComponent}
    ]}
  ]},
  { path: '', redirectTo: '/apis', pathMatch: 'full' }
  // {path:"gateways",component:GatewaycardsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
