import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayTelemetryComponent } from './gateway-telemetry.component';

describe('GatewayTelemetryComponent', () => {
  let component: GatewayTelemetryComponent;
  let fixture: ComponentFixture<GatewayTelemetryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewayTelemetryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GatewayTelemetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
