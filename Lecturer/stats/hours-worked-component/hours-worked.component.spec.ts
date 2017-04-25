/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HoursWorkedComponent } from './hours-worked.component';

describe('HoursWorkedComponent', () => {
  let component: HoursWorkedComponent;
  let fixture: ComponentFixture<HoursWorkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoursWorkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursWorkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});