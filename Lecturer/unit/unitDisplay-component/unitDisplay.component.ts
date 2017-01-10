import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Unit } from '../../../../shared/Store/Models/unit';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'ced-unit-display',
  templateUrl: 'unitDisplay.component.html'
})
export class UnitDisplayComponent extends ComponentBase implements OnInit{
  private numberOfUnits: number;

  public testForm: FormGroup;

  constructor(store: Store<IAppState>, private fb: FormBuilder) {
    super();

    this.disposeOnDestroy(
      store.select('units')
        .map((units: Unit[]) => {
          if (units)
            return units.length;
          return 0;
        })
        .subscribe((value: number) => this.numberOfUnits = value)
    )
  }

  ngOnInit() {
    this.testForm = this.fb.group({
      testInput: ['']
    })
  }
}
