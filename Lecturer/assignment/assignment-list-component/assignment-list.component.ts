import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Observable } from 'rxjs/observable';
import { Component } from '@angular/core';

@Component({
  selector: 'ced-assignment-list',
  templateUrl: 'assignment-list.component.html',
  styleUrls: ['assignment-list.component.scss']
})
export class AssignmentListComponent extends ComponentBase {

  private assignments: Observable<Assignment[]>;

  constructor(store: Store<IAppState>) {
   super();

   this.assignments = store.select((state: IAppState) => state.assignments);

 }

}
