import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { isUndefined } from 'util';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Observable } from 'rxjs';
import { Unit } from '../../../../shared/Store/Models/unit';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { AssignmentService } from '../../../../shared/Services/assignment.service';
import { Project } from '../../../../shared/Store/Models/project';
import { ProjectService } from '../../../../shared/Services/project.service';

@Component({
  selector: 'ced-unit-overview',
  templateUrl: 'unitOverview.component.html',
  styleUrls: ['unitOverview.component.scss']
})
export class UnitOverviewComponent extends ComponentBase {
  private unitObservable: Observable<Unit>;
  private loadedUnit: Unit;
  private loadedAssignments: Assignment[] = [];
  private loadedProjects: Project[] = [];

  constructor(private route: ActivatedRoute, private store: Store<IAppState>, private assignmentService: AssignmentService, private projectsService: ProjectService) {
    super();
    this.unitObservable = this.route.params
      .filter(params => params['id'])
      .map(params => params['id'])
      .switchMap(id => this.store.select('units')
        .filter((units: Unit[]) => units.length > 0)
        .map((units: Unit[]) => units.find(u => u.id == id))
      );

    this.disposeOnDestroy(this.unitObservable.subscribe((u: Unit) => {
      this.loadedUnit = u;
      this.assignmentService.getAssignmentsForUnit(u.id);
      this.projectsService.getProjectsForUnit(u.id);

      this.disposeOnDestroy(this.store.select('assignments')
        .filter((as: Assignment[]) => as.length > 0)
        .map((as: Assignment[]) => as.filter((a: Assignment) => a.unit_id == this.loadedUnit.id))
        .subscribe((as: Assignment[]) => {
          this.loadedAssignments = as;
        })
      );

      this.disposeOnDestroy(this.store.select('projects')
        .filter((ps: Project[]) => ps.length > 0)
        .map((ps: Project[]) => ps.filter((p: Project) => p.unit_id == this.loadedUnit.id))
        .subscribe((ps: Project[]) => {
          this.loadedProjects = ps;
        })
      );
    }));


  }

  ngOnInit() {
  }

  filterProjects(assignment: Assignment): Project[] {
    return this.loadedProjects.filter(p => p.assignment_id == assignment.id);
  }
}
