import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Unit } from '../../../../shared/Store/Models/unit';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Project } from '../../../../shared/Store/Models/project';
import { UnitService } from '../../../../shared/Services/unit.service';

@Component({
  selector: 'ced-unit-details',
  templateUrl: 'unit-details.component.html',
  styleUrls: ['unit-details.component.scss']
})
export class UnitDetailsComponent extends ComponentBase {
  private unit: Unit;
  private assignments: Assignment[];
  private projects: Project[];
  private unitService: UnitService;

  constructor(private route: ActivatedRoute, store: Store<IAppState>, unitService: UnitService) {
    super();

    this.assignments = [];
    this.projects = [];
    this.unitService = unitService;

    let unitObservable = this.route.params
      .filter(params => params['id'])
      .map(params => params['id'])
      // .switchMap(id => { 
      //   return Observable.of(this.unitService.getUnit$(id))
      // });
      .switchMap(id => store.select('units')
        .filter((units: Unit[]) => units.length > 0)
        .map((units: Unit[]) => units.find(u => u.id == id))
      );

    this.disposeOnDestroy(unitObservable.subscribe(unit => {
      this.unit = unit;
    }));

    this.disposeOnDestroy(unitObservable.switchMap((unit:Unit)=>
      store.select((state: IAppState) => state.assignments)
        .map((as: Assignment[]) => as.filter((a: Assignment) => a.unit_id == unit.id))
      )
      .subscribe((assignments: Assignment[]) => {
        this.assignments = assignments;
      })
    );

    this.disposeOnDestroy(unitObservable.switchMap((unit:Unit)=>
        store.select((state: IAppState) => state.projects)
          .map((ps: Project[]) => ps.filter((p: Project) => p.unit_id == unit.id))
        )
        .subscribe((projects: Project[]) => {
          this.projects = projects;
        })
    );
  }

  ngOnInit() {
  }

  filterProjects(assignment: Assignment): Project[] {
    return this.projects.filter(p => p.assignment_id == assignment.id)
  }

  archiveUnitPopup(unit: Unit) {
    if (unit.archived_at != null)
      alert('Unit is already archived!');

    if (confirm("Are you sure you want to archive unit: \"" + unit.name + "\"?") == true) {
      this.unitService.archive(unit);
    }
  }
}
