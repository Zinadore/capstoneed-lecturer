import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Iteration } from '../../../../shared/Store/Models/iteration';
import { IterationHelpers } from '../../../../shared/Helpers/iteration.helpers';
import { Project } from '../../../../shared/Store/Models/project';
import { ProjectService } from '../../../../shared/Services/project.service';
import { ProjectRanking } from '../../../../shared/Store/Models/project-ranking';

@Component({
  selector: 'ced-assignment-overview',
  templateUrl: 'assignment-overview.component.html',
  styleUrls: ['assignment-overview.component.scss']
})
export class AssignmentOverviewComponent  implements OnInit {
  private allProjects: Project[];

  public rankings: ProjectRanking[];

  public _projects: Project[];
  @Input('projects') set AssignmentOverviewComponent__Projects(value: Project[]) {
    if(!value || !value.length) return;

    this.allProjects = value;

    if(this._assignment)
      this._projects = value.filter(p => p.assignment_id == this._assignment.id);
  }
  public _assignment: Assignment;
  @Input('assignment') set AssignmentOverviewComponent__Assignment(value: Assignment) {
    if(!value) return;

    this.projectService.getProjectRankings$(value.id).subscribe(rankings => this.rankings = rankings);

    this._assignment = value;
    this._projects = this.allProjects.filter(p => p.assignment_id == this._assignment.id);
  }

  constructor(private projectService: ProjectService) {
    this._projects = [];
    this.allProjects = [];
  }


  ngOnInit() {
  }

  public getIterationProgress(iteration: Iteration): number {
    return IterationHelpers.getProgressPercent(iteration);
  }


}
