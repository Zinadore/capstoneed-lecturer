import { Observable } from 'rxjs/Rx';
import { Unit } from '../../../../shared/Store/Models';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { AssignmentService } from '../../../../shared/Services/assignment.service';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { isUndefined } from 'util';

@Component({
  selector: 'app-edit-assignment.component.ts',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss']
})
export class EditAssignmentComponent extends ComponentBase {

  private assignmentObservable: Observable<Assignment>
  private assignment: Assignment
  private unit: Unit

  constructor(private store: Store<IAppState>,
              private route: ActivatedRoute,              
              private assignmentService: AssignmentService) { 
    
    super()

    // Get an observable from the id in the params
    let idObservable = this.route.params
      .filter( params => params['id'])
      .map( params => params['id'])

    // Get the project from the server according to the id from the
    // idObservable and put it in the store
    this.disposeOnDestroy(idObservable.subscribe( (id: number) => {
        this.assignmentService.get(id)
      })
    )

    // Get an observable from the Project in the store
    this.assignmentObservable = idObservable
      .switchMap(id => this.store.select( (state: IAppState) => state.assignments)
        .map( (assignments: Assignment[]) => assignments.find( (a:Assignment) => a.id == id))
      )

    // If the Project observable emits a project that is not undefined, 
    // cacke it to the local project object to use in the component
    this.disposeOnDestroy(this.assignmentObservable.filter( (a: Assignment) => 
      !isUndefined(a)).subscribe( a => 
        this.assignment = a
      )
    )

    let unitObservable = this.assignmentObservable
      .filter((a: Assignment) => !isUndefined(a))
      .switchMap((a: Assignment) => this.store.select((state: IAppState) => state.units)
        .map((units: Unit[]) => units.find((u: Unit) => u.id == a.unit_id))
      );

    this.disposeOnDestroy(unitObservable.filter((u: Unit) => !isUndefined(u)).subscribe(u => this.unit = u));
        
  }

  ngOnInit() {
  
  }

}