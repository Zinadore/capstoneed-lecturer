import { Observable } from 'rxjs/Rx';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Component, ViewChild } from '@angular/core';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { Unit } from '../../../../shared/Store/Models/unit';

@Component({
  selector: 'ced-unit-list',
  templateUrl: 'unit-list.component.html',
  styleUrls: ['unit-list.component.scss']  
})
export class UnitListComponent extends ComponentBase{

  private units: Unit[];
  private columns;
  private rows;
  private filteredUnits: Observable<Unit[]>;
  @ViewChild('myTable') table: any;

  constructor(store: Store<IAppState>) {
    super();
    this.filteredUnits = store.select('units');

    // this.disposeOnDestroy(this.filteredUnits.subscribe(console.log))

    // this.columns = [
    //   { prop: 'name', name: 'Name' },
    //   { prop: 'code', name: 'Code' },
    //   { prop: 'semester', name: 'Semester' },
    //   { prop: 'year', name: 'Year' }
    // ];    
  }

  toggleExpandRow(row) {
    // console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }  

  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }  

}
