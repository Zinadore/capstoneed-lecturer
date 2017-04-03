import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { isUndefined } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../../../shared/Store/Models/project';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Observable } from 'rxjs';

@Component({
    selector: 'ced-project-list',
    templateUrl: 'project-list.component.html',
    styleUrls: ['project-list.component.scss']
})
export class ProjectListComponent extends ComponentBase {

  private columns
  private rows
  private temp
  private filteredProjects: Observable<Project[]>
  @ViewChild('myTable') table: any

  constructor(store: Store<IAppState>) {
    super()
    this.filteredProjects = store.select('projects')

    this.disposeOnDestroy(this.filteredProjects.filter((p: Project[]) => !isUndefined(p))
        .subscribe(p => {
          this.rows = p
          this.temp = p
        }))    
  }

  ngOnInit() { }

  toggleExpandRow(row) {
    // console.log('Toggled Expand Row!', row);
    //this.table.rowDetail.toggleExpandRow(row);
  }  

  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }  

  updateFilter(event) {
    const val = event.target.value;
    
    const temp = this.temp.filter(function(d) {
      return d.project_name.toLowerCase().indexOf(val) != -1 || 
             d.team_name.toLowerCase().indexOf(val) != -1 ||
             !val;
    })

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }  

}
