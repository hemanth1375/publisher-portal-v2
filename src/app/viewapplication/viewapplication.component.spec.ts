import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewapplicationComponent } from './viewapplication.component';

describe('ViewapplicationComponent', () => {
  let component: ViewapplicationComponent;
  let fixture: ComponentFixture<ViewapplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewapplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
