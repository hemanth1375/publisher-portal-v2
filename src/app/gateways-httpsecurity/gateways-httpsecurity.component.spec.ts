import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaysHttpsecurityComponent } from './gateways-httpsecurity.component';

describe('GatewaysHttpsecurityComponent', () => {
  let component: GatewaysHttpsecurityComponent;
  let fixture: ComponentFixture<GatewaysHttpsecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewaysHttpsecurityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GatewaysHttpsecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
