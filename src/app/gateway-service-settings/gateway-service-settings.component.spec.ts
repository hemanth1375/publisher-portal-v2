import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayServiceSettingsComponent } from './gateway-service-settings.component';

describe('GatewayServiceSettingsComponent', () => {
  let component: GatewayServiceSettingsComponent;
  let fixture: ComponentFixture<GatewayServiceSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewayServiceSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GatewayServiceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
