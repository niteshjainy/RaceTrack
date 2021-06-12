import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageDetailsComponent } from './landing-page-details.component';

describe('LandingPageDetailsComponent', () => {
  let component: LandingPageDetailsComponent;
  let fixture: ComponentFixture<LandingPageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
