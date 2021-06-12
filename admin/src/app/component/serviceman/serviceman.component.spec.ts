import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicemanComponent } from './serviceman.component';

describe('ServicemanComponent', () => {
  let component: ServicemanComponent;
  let fixture: ComponentFixture<ServicemanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicemanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicemanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
