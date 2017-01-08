import { Component, OnInit } from '@angular/core';
import { Unit } from '../../../shared/Store/Models/unit';
import { ComponentBase } from '../../../shared/Directives/componentBase';
import { IAppState } from '../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { UnitService } from '../../../shared/Services/unitService';

@Component({
  selector: 'ced-unit-display',
  template:`
    <template *ngIf="units?.length === 1" [ngTemplateOutlet]="unitDetails"></template>  
    <template *ngIf="units?.length > 1" [ngTemplateOutlet]="unitList"></template>  
    
    <template #unitDetails>
      <ced-unit-details [unit]="units[0]"></ced-unit-details>
    </template>
    <template #unitList>
      <ced-unit-list [units]="units"></ced-unit-list>
    </template>
  `
})
export class UnitDisplayComponent extends ComponentBase implements OnInit{
  private units: Unit[];

  constructor(store: Store<IAppState>, private unitService: UnitService) {
    super();
    this.disposeOnDestroy(store.select('units').subscribe((units: Unit[]) => {
      this.units = units;
    }));
  }

  ngOnInit() {
    this.unitService.loadUnits();
  }
}
