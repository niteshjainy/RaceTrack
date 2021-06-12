import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceTrackListComponent } from './race-track-list.component';

describe('RaceTrackListComponent', () => {
  let component: RaceTrackListComponent;
  let fixture: ComponentFixture<RaceTrackListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceTrackListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceTrackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
