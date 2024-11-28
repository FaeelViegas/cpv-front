import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDatepickerComponent } from './app-datepicker.component';

describe('AppDatepickerComponent', () => {
  let component: AppDatepickerComponent;
  let fixture: ComponentFixture<AppDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDatepickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
