import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageMainComponent } from './landing-page-main.component';

describe('LandingPageMainComponent', () => {
  let component: LandingPageMainComponent;
  let fixture: ComponentFixture<LandingPageMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
