import { Component, Input, OnInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Project } from '../../../../shared/Store/Models/project';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ProjectService } from '../../../../shared/Services/project.service';
import { ProjectRanking } from '../../../../shared/Store/Models/project-ranking';
import { Observable, Subject } from 'rxjs';
import { Assignment } from '../../../../shared/Store/Models/assignment';

@Component({
  selector: 'ced-project-rankings',
  templateUrl: 'project-rankings.component.html',
  styleUrls: ['project-rankings.component.scss']
})
export class ProjectRankingsComponent extends ComponentBase implements OnInit {

  public min: number;
  public target: number;

  public _rankings: ProjectRanking[];
  @Input('rankings') set ProjectRankingsComponent__Rankings(value: ProjectRanking[]) {
    if(!value || !value.length) {
      return;
    }
    this._rankings = value.sort((a: ProjectRanking, b: ProjectRanking) => b.total - a.total);

    this.target = this._rankings[0].total;
    this.min = this._rankings[this._rankings.length - 1].total;
  };

  get ProjectRankingsComponent__Rankings() {
    return this._rankings;
  }

  constructor() {
    super();
    this._rankings = [];
  }

  ngOnInit() {

  }

}
