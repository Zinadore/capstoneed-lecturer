import { isUndefined } from 'util';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Observable } from 'rxjs/observable';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'ced-assignment-list',
  templateUrl: 'assignment-list.component.html',
  styleUrls: ['assignment-list.component.scss']
})
export class AssignmentListComponent extends ComponentBase {
  
  private columns
  private rows
  private temp
  private assignments: Observable<Assignment[]>
  @ViewChild('myTable') table: any

  constructor(store: Store<IAppState>) {
    super()

    this.assignments = store.select('assignments')
    
    this.disposeOnDestroy(this.assignments.filter((a: Assignment[]) => !isUndefined(a))
        .subscribe(a => {
          this.rows = a
          this.temp = a
        }))    

  }

  updateFilter(event) {
    const val = event.target.value
    
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) != -1 || !val
    })

    // update the rows
    this.rows = temp
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0
  }      

}
