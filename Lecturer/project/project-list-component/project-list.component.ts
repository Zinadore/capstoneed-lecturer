import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../shared/Store/Models/project';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Observable } from 'rxjs';

@Component({
    selector: 'ced-project-list',
    templateUrl: 'project-list.component.html'
})
export class ProjectListComponent implements OnInit {

  private projectsObservable: Observable<Project[]>;

  constructor(store: Store<IAppState>) {
    this.projectsObservable = store.select('projects')
  }

  ngOnInit() { }

}
