import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Project } from '../../../../shared/Store/Models/project';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../../../../shared/Services/projects.service';
import { Unit } from '../../../../shared/Store/Models/unit';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { isUndefined } from 'util';
import { UnitService } from '../../../../shared/Services/unitService';
import { AssignmentService } from '../../../../shared/Services/assignmentService';

@Component({
  selector: 'ced-project-details',
  templateUrl: 'project-details.component.html',
  styleUrls: ['project-details.component.scss']
})
export class ProjectDetailsComponent extends ComponentBase implements OnInit {

  private project: Project;
  private unit: Unit;
  private assignment: Assignment;
  private projectObservable: Observable<Project>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, private projectService: ProjectService, private unitService: UnitService, private assignmentService: AssignmentService) {
    super();

    this.projectObservable = route.params
      .filter(params => params['id'])
      .map(params => params['id'])
      .switchMap(id => store.select('projects')
        .filter((projects: Project[]) => projects.length > 0)
        .map((projects: Project[]) => projects.find((p: Project) => p.id == id))
      );

    let unitObservable = this.projectObservable
      .switchMap((p: Project) => this.store.select('units')
        .filter((units: Unit[]) => units.length > 0)
        .map((units: Unit[]) => units.find((u: Unit) => u.id == p.unit_id))
      )
      .filter((u: Unit) => !isUndefined(u));

    let assignmentObservable = this.projectObservable
      .switchMap((p: Project) => this.store.select('assignments')
        .filter((assignments: Assignment[]) => assignments.length > 0)
        .map((assignments: Assignment[]) => assignments.find((a: Assignment) => a.id == p.assignment_id))
      )
      .filter((a: Assignment) => !isUndefined(a));

    this.disposeOnDestroy(route.params.filter(params => params['id']).map(params => params['id']).subscribe(id => {
      projectService.getProject(id);
    }));

    this.disposeOnDestroy(this.projectObservable.subscribe((p: Project) => {
      this.project = p;
      unitService.getUnit(p.unit_id);
      assignmentService.getAssignmentsForUnit(p.unit_id);
    }));

    this.disposeOnDestroy(unitObservable.subscribe((u: Unit) => {
      this.unit = u;
    }));

    this.disposeOnDestroy(assignmentObservable.subscribe((a: Assignment) => {
      this.assignment = a;
    }));
  }

  ngOnInit() { }

}
