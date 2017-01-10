import { ComponentBase } from '../../../shared/Directives/componentBase';
import { Component } from '@angular/core';
import { IAppState } from '../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { Unit } from '../../../shared/Store/Models/unit';

@Component({
  selector: 'ced-unit-list',
  templateUrl: 'unitList.component.html'
})
export class UnitListComponent extends ComponentBase{

  private units: Unit[];

  constructor(store: Store<IAppState>) {
    super();
    store.select('units').subscribe((units: Unit[]) => {
      this.units = units;
    });
  }

}
