import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Project } from '../../../../shared/Store/Models/project';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../../../../shared/Services/project.service';
import { Unit } from '../../../../shared/Store/Models/unit';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { isUndefined } from 'util';
import { UnitService } from '../../../../shared/Services/unit.service';
import { AssignmentService } from '../../../../shared/Services/assignment.service';

@Component({
  selector: 'ced-student',
  templateUrl: 'student.component.html',
  styleUrls: ['student.component.scss']
})
export class StudentComponent extends ComponentBase implements OnInit {

  private project: Project;
  private unit: Unit;
  private assignment: Assignment;
  private removeStudentMode: Boolean;
  // private projectObservable: Observable<Project>;
  private project_id: number;

  constructor(private store: Store<IAppState>, 
              private route: ActivatedRoute, 
              private projectService: ProjectService, 
              private unitService: UnitService, 
              private assignmentService: AssignmentService) {

    super();
    let removeStudentMode = false;
    // Observable that emits the project id from route params
    let idObservable = this.route.params
      .filter(params => params['id'])
      .map(params => params['id'])

    // When the component load request fresh data
    //TODO: Perhaps add some cache invalidation logic ?
    this.disposeOnDestroy(idObservable.subscribe((id: number) => {
        this.projectService.get(id)
      })
    )

    // Observable that emits the project matching the id from params. Can be null
    let projectObservable = idObservable
      .switchMap(id => this.store.select((state: IAppState) => state.projects)
        .map((projects: Project[]) => projects.find((p:Project) => p.id == id))
      )

    //TODO: Another candidate for invalidation logic
    this.disposeOnDestroy(projectObservable.filter((p: Project) => !isUndefined(p) || p === null).subscribe((p: Project) => {
        this.unitService.getUnit(p.unit_id);
        this.assignmentService.get(p.assignment_id);
      })
    )

    // Observable that emits the assignment matching the project. Can be null
    let assignmentObservable = projectObservable
      .filter((p: Project) => !isUndefined(p))
      .switchMap((p: Project) => this.store.select((state: IAppState) => state.assignments)
        .map((assignments: Assignment[]) => assignments.find((a: Assignment) => a.id == p.assignment_id))
      )

    // Observable that emits the unit matching the project. Can be null
    let unitObservable = projectObservable
      .filter((p: Project) => !isUndefined(p))
      .switchMap((p: Project) => this.store.select((state: IAppState) => state.units)
        .map((units: Unit[]) => units.find((u: Unit) => u.id == p.unit_id))
      )
    this.disposeOnDestroy(idObservable.subscribe(id => this.project_id = id));

    // Store any valid entities for data binding
    this.disposeOnDestroy(projectObservable.filter((p: Project) => !isUndefined(p)).subscribe(p => this.project = p));
    this.disposeOnDestroy(assignmentObservable.filter((a: Assignment) => !isUndefined(a)).subscribe(a => this.assignment = a));
    this.disposeOnDestroy(unitObservable.filter((u: Unit) => !isUndefined(u)).subscribe(u => this.unit = u));

    // If the store gave us an invalid entity, request it from the corresponding service
    this.disposeOnDestroy(projectObservable.filter((p: Project) => isUndefined(p) || p == null).subscribe((_) => this.projectService.get(this.project_id)));
    this.disposeOnDestroy(unitObservable.filter((u: Unit) => isUndefined(u) || u == null).subscribe((_) => this.unitService.getUnit(this.project.unit_id)));
    this.disposeOnDestroy(assignmentObservable.filter((a: Assignment) => isUndefined(a) || a == null).subscribe((_) => this.assignmentService.get(this.project.assignment_id)));

  }

  ngOnInit() { }

}
