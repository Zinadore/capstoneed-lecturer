import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { isUndefined } from 'util';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Observable } from 'rxjs';
import { Unit } from '../../../../shared/Store/Models/unit';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { AssignmentService } from '../../../../shared/Services/assignmentService';

@Component({
  selector: 'ced-unit-details',
  templateUrl: 'unitDetails.component.html',
  styleUrls: ['unitDetails.component.scss']
})
export class UnitDetailsComponent extends ComponentBase {
  private unitObservable: Observable<Unit[]>;
  private loadedUnit: Unit;
  private loadedAssignments: Assignment[] = [];

  constructor(private route: ActivatedRoute, private store: Store<IAppState>, private assignmentService: AssignmentService) {
    super();
    this.unitObservable = this.store.select('units')
      .filter(units => units !== null);

    this.disposeOnDestroy(this.route.params
      .filter(params => params['id'])
      .map(params => params['id'])
      .combineLatest(this.unitObservable, (id: number, units: Unit[]) => units.filter(unit => unit.id == id))
      .subscribe((value: Unit[]) => {
        this.loadedUnit = value[0];
        this.assignmentService.getAssignmentsForUnit(this.loadedUnit.id);
      }));

    this.disposeOnDestroy(this.route.params
      .filter(params => !params['id'])
      .switchMap(_ => this.unitObservable)
      .subscribe((units: Unit[]) => {
        this.loadedUnit = units[0];
        this.assignmentService.getAssignmentsForUnit(this.loadedUnit.id);
      }));

    this.disposeOnDestroy(this.store.select('assignments')
      .filter((a: Assignment[]) => a !== [] && !isUndefined(this.loadedUnit))
      .subscribe((a: Assignment[]) => {
        this.loadedAssignments = a.filter((as: Assignment) => as.unit.id == this.loadedUnit.id);
      })
    )
  }

  ngOnInit() {
  }
}
