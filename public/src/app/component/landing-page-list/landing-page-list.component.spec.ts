import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageListComponent } from './landing-page-list.component';

describe('LandingPageListComponent', () => {
  let component: LandingPageListComponent;
  let fixture: ComponentFixture<LandingPageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
