import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayApiMonetizationComponent } from './gateway-api-monetization.component';

describe('GatewayApiMonetizationComponent', () => {
  let component: GatewayApiMonetizationComponent;
  let fixture: ComponentFixture<GatewayApiMonetizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewayApiMonetizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GatewayApiMonetizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
