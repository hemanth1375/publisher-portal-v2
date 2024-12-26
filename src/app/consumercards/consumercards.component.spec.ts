import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumercardsComponent } from './consumercards.component';

describe('ConsumercardsComponent', () => {
  let component: ConsumercardsComponent;
  let fixture: ComponentFixture<ConsumercardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumercardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumercardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
