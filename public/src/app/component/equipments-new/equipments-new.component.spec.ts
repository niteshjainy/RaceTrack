import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPagePrivacyComponent } from './landing-page-privacy.component';

describe('LandingPagePrivacyComponent', () => {
  let component: LandingPagePrivacyComponent;
  let fixture: ComponentFixture<LandingPagePrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPagePrivacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPagePrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
