import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicemansComponent } from './servicemans.component';

describe('ServicemansComponent', () => {
  let component: ServicemansComponent;
  let fixture: ComponentFixture<ServicemansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicemansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicemansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
