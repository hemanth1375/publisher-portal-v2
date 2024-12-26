import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationoverviewComponent } from './applicationoverview.component';

describe('ApplicationoverviewComponent', () => {
  let component: ApplicationoverviewComponent;
  let fixture: ComponentFixture<ApplicationoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationoverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
