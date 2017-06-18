import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { ActivatedRoute } from '@angular/router';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { PeerAssessmentService } from '../../../../shared/Services/peer-assessment.service';
import { Iteration } from '../../../../shared/Store/Models/iteration';

@Component({
  selector: 'ced-scored-pa-details',
  templateUrl: 'scored-pa-details.component.html',
  styleUrls: ['scored-pa-details.component.scss']
})
export class ScoredPaDetailsComponent extends ComponentBase implements OnInit {

  public _iteration: Iteration;
  public _marks: any;
  constructor(route: ActivatedRoute, store: Store<IAppState>, assessmentService: PeerAssessmentService) {
    super();

    assessmentService.getAllScored();

    let id$ = route.params
      .filter(params => params['id'])
      .map(params => params['id']);

    let source = Observable.combineLatest(
      id$,
      store.select((state: IAppState) => state.scored_iterations),
      this.doStuff
    );

    this.disposeOnDestroy(source.subscribe(it => this._iteration = it));

    this.disposeOnDestroy(id$.switchMap(id => assessmentService.getMarksForID(id))
      .map(json => json.projects)
      .subscribe(
        projects => {
          this._marks = projects;
          console.log(projects);
        },
        err => console.log(err)
      )
    );

  }

  ngOnInit() {
  }

  private doStuff(id: number, scoredIterations: Iteration[]): Iteration {
    return scoredIterations.find(it => it.id == id);
  }
}
