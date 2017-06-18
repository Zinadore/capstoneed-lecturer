import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { PeerAssessmentService } from '../../../../shared/Services/peer-assessment.service';
import { Iteration } from '../../../../shared/Store/Models/iteration';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'ced-scored-pa-list',
  templateUrl: 'scored-pa-list.component.html',
  styleUrls: ['scored-pa-list.component.scss']
})
export class ScoredPaListComponent extends ComponentBase implements OnInit, AfterViewInit {
  public scored_iterations: Iteration[];
  public assignments: Assignment[];
  public rows;
  public selected: Iteration[];
  public filteredRows;

  @ViewChild('searchBox') searchBox: ElementRef;

  constructor(private assesssmentService: PeerAssessmentService, store: Store<IAppState>, private router: Router) {
    super();
    this.selected = [];

    this.disposeOnDestroy(store.select((state: IAppState) => state.assignments)
      .subscribe(assignments => {
        this.assignments = assignments;
        if(this.scored_iterations) {
          this.findLatestIterations(this.scored_iterations);
        }
        this.setAssignments();
      })
    );

    this.disposeOnDestroy(store.select((state: IAppState) => state.scored_iterations)
      .subscribe(its => {
        this.scored_iterations = its;
        this.findLatestIterations(its);
        if(this.assignments) {
          this.setAssignments();
        }
      })
    );
  }

  ngOnInit() {
    this.assesssmentService.getAllScored();
  }

  ngAfterViewInit() {
    let obs = Observable.fromEvent(this.searchBox.nativeElement, 'input')
      .debounceTime(250)
      .map((event: any) => event.target.value);

    this.disposeOnDestroy(obs.subscribe(searchTerm => {
      const temp = this.rows.filter(function(row) {
        return row.name.toLowerCase().indexOf(searchTerm) !== -1 ||
               row.assignment.name.toLowerCase().indexOf(searchTerm) !== -1 ||
               row.assignment.unit.name.toLowerCase().indexOf(searchTerm) !== -1 ||
               !searchTerm;
      });

      // update the rows
      this.filteredRows = temp;
    }));
  }

  public debug() {
    console.log(this.rows)
  }

  public onRowClicked({ selected }) {
    let it: Iteration = selected[0];
    this.router.navigate(['/peer-assessments', it.id])
  }

  private findLatestIterations(iterations: Iteration[]) {
    let map = {};
    for(let it of iterations) {
      let latest: Iteration = map[it.assignment_id];

      if(!latest) {
        map[it.assignment_id] = it;
        continue;
      }

      if(new Date(latest.deadline) < new Date(it.deadline)) {
        map[it.assignment_id] = it;
      }
    }
    this.rows = [];
    for(let key in map) {
      this.rows.push(map[key]);
    }
    this.filteredRows = this.rows;
  }

  private setAssignments(): void {
    if(!this.rows) return;

    for(let as of this.rows) {
      as.assignment = this.assignments.find(a => a.id == as.assignment_id);
    }
  }
}
