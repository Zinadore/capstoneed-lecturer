import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Component } from '@angular/core';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Observable } from 'rxjs/observable';
import { Project } from '../../../../shared/Store/Models/project';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { AssignmentService } from '../../../../shared/Services/assignment.service';
import { ProjectService } from '../../../../shared/Services/project.service';

@Component({
  selector: 'ced-assignment-details',
  templateUrl: 'assignment-details.component.html',
  styleUrls: ['assignment-details.component.scss']
})
export class AssignmentDetailsComponent extends ComponentBase {
  private assignment: Observable<Assignment>;
  private projects: Observable<Project[]>;

  constructor(store: Store<IAppState>, route: ActivatedRoute, private assignmentService: AssignmentService, private projectService: ProjectService) {
    super();


    this.assignment = route.params
      .filter(params => params['id'])
      .map(params => params['id'])
      .do(id => this.assignmentService.get(id))
      .switchMap(id => store.select((state: IAppState) => state.assignments)
        .map((assignments: Assignment[]) => assignments.find(a => a.id == id))
        .filter((a: Assignment) => !isNullOrUndefined(a))
      );

    this.projects = this.assignment
      .do((a: Assignment) => this.projectService.getAllActiveForAssignment(a.id))
      .switchMap(assignment => store.select((state: IAppState) => state.projects)
        .map((projects: Project[]) => projects.filter((p: Project) => p.assignment_id == assignment.id))
      )

  }
}
