import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { ProjectService } from '../../../../shared/Services/project.service';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Project } from '../../../../shared/Store/Models/project';
import { ProjectEvaluation } from '../../../../shared/Store/Models/project-evaluation';

@Component({
  selector: 'ced-project-evaluation-list',
  templateUrl: 'project-evaluation-list.component.html',
  styleUrls: ['project-evaluation-list.component.scss']
})
export class ProjectEvaluationListComponent extends ComponentBase implements OnInit {
  public pendingEvaluations: ProjectEvaluation[];
  public projects: Project[];
  public selectedProject: Project;
  public selectedEvaluation: ProjectEvaluation;

  private allProjects: Project[];

  constructor(private projectService: ProjectService, store: Store<IAppState>) {
    super();

    this.disposeOnDestroy(store.select(state => state.project_evaluations).subscribe(evals => {
      this.pendingEvaluations = evals;
      this.selectedEvaluation = this.selectedProject = null;
      if(this.allProjects) {
        this.extractRelevantProjects();
      }
    }));

    this.disposeOnDestroy(store.select(state => state.projects).subscribe(projects => {
      this.allProjects = projects;
      if(this.pendingEvaluations) {
        this.extractRelevantProjects();
      }
    }));
  }

  ngOnInit() {
    this.projectService.getPendingEvalations();
  }

  public debug() {
    console.log(this.projects);
  }

  public selectProject(index: number) {
    this.selectedProject = this.projects[index];
    this.selectedEvaluation = this.pendingEvaluations.find(ev => ev.project_id == this.selectedProject.id);
  }

  private extractRelevantProjects() {
    let result = [];

    let ids = this.pendingEvaluations.map(ev => ev.project_id);

    for(let p of this.allProjects) {
      if(ids.indexOf(p.id) !== -1) {
        result.push(p)
      }
    }

    this.projects = result;
  }

}
