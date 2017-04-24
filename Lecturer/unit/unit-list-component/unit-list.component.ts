import { isUndefined } from 'util';
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
  private temp;
  private filteredUnits: Observable<Unit[]>;
  @ViewChild('myTable') table: any;

  constructor(store: Store<IAppState>) {
    super();
    this.filteredUnits = store.select('units');

    this.disposeOnDestroy(this.filteredUnits.filter((u: Unit[]) => !isUndefined(u))
        .subscribe(u => {
          this.rows = this.temp = u;
        }))
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

  updateFilter(event) {
    const val = event.target.value;

    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 ||
             String(d.year).indexOf(val) !== -1 ||
             !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
