import { Component, OnInit } from '@angular/core';
import { Unit } from '../../../shared/Store/Models/unit';
import { ComponentBase } from '../../../shared/Directives/componentBase';
import { IAppState } from '../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { UnitService } from '../../../shared/Services/unitService';

@Component({
  selector: 'ced-unit-display',
  templateUrl: 'unitDisplay.component.html'
})
export class UnitDisplayComponent extends ComponentBase implements OnInit{
  private numberOfUnits: number;

  constructor(store: Store<IAppState>) {
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
  }
}
