import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateconsumersComponent } from './createconsumers.component';

describe('CreateconsumersComponent', () => {
  let component: CreateconsumersComponent;
  let fixture: ComponentFixture<CreateconsumersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateconsumersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateconsumersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
