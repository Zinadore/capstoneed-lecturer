import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Component, OnInit } from '@angular/core';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Observable } from 'rxjs/observable';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined, isUndefined } from 'util';
import { AssignmentService } from '../../../../shared/Services/assignment.service';
import { TimeHelpers } from '../../../../shared/Helpers/time.helpers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IterationHelpers } from '../../../../shared/Helpers/iteration.helpers';
import { Iteration } from '../../../../shared/Store/Models/iteration';
import { Project } from '../../../../shared/Store/Models/project';
import { GAME_SETTINGS_DEFAULTS } from "../../../../shared/Constants/settings";
import { GameSettings } from '../../../../shared/Store/Models/game-settings';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ced-assignment-details',
  templateUrl: 'assignment-details.component.html',
  styleUrls: ['assignment-details.component.scss']
})
export class AssignmentDetailsComponent extends ComponentBase implements OnInit{
  private assignment$: Observable<Assignment>;

  public gameSettings: GameSettings = GAME_SETTINGS_DEFAULTS;
  public assignment: Assignment;
  public projects: Project[];
  public settingsForm: FormGroup;
  public areSettingsCollapsed: boolean;
  public isFormCollapsed: boolean;

  constructor(store: Store<IAppState>, route: ActivatedRoute, private assignmentService: AssignmentService,
              private fb: FormBuilder, private toastService: ToastrService) {
    super();

    this.areSettingsCollapsed = true;
    this.isFormCollapsed = true;

    this.assignment$ = route.params
      .filter(params => params['id'])
      .map(params => params['id'])
      .do(id => this.assignmentService.get(id))
      .switchMap(id => store.select((state: IAppState) => state.assignments)
        .map((assignments: Assignment[]) => assignments.find(a => a.id == id))
        .filter((a: Assignment) => !isNullOrUndefined(a))
      );

    this.disposeOnDestroy(this.assignment$.subscribe(a => this.assignment = a));
    this.disposeOnDestroy(this.assignment$.switchMap(a =>
        store.select((state: IAppState) => state.projects)
        .map(projects => projects.filter(p => p.assignment_id == a.id))
      )
      .subscribe(projects => this.projects = projects)
    );

    this.disposeOnDestroy(this.assignment$.switchMap(a =>
      this.assignmentService.getGameSettings$(a.id))
      .subscribe(
        (settings) => this.gameSettings = settings,
        (err) => this.gameSettings = GAME_SETTINGS_DEFAULTS
      )
    );
  }

  public getAssignmentTimespan(assignment: Assignment): number {
    return TimeHelpers.getTimeSpanInDays(assignment.start_date, assignment.end_date);
  }

  public toggleSettings(): void {
    this.areSettingsCollapsed = !this.areSettingsCollapsed;
  }

  public togglePAForm(): void {
    this.isFormCollapsed = !this.isFormCollapsed;
  }

  public ngOnInit() {
    this.settingsForm = this.fb.group({
      assessmentSettings: this.fb.group({
        assessmentPoints: [0, Validators.required],
        firstTeamPoints: [0, Validators.required],
        firstDayPoints: [0, Validators.required]
      }),
      evaluationSettings: this.fb.group({
        evaluationPoints: [0, Validators.required],
        firstTeamPoints: [0, Validators.required],
        firstDayPoints: [0, Validators.required]
      }),
      logSettings: this.fb.group({
        logPoints: [0, Validators.required],
        maxLogsPerDay: [0, Validators.required],
        firstOfDayPoints: [0, Validators.required]
      })
    });
  }

  public getIterationProgress(iteration: Iteration): number {
    return IterationHelpers.getProgressPercent(iteration);
  }

  public onSettingsFormSubmit() {
    if(!this.settingsForm.dirty || !this.settingsForm.valid) return;

    this.disposeOnDestroy(this.assignmentService.updateGameSettings$(this.gameSettings, this.assignment.id)
      .subscribe(
        (newSettings) => {
          this.gameSettings = newSettings;
          this.toastService.success('Settings saved!', 'Success');
          this.areSettingsCollapsed = true;
        },
        (err) => {
          this.gameSettings = GAME_SETTINGS_DEFAULTS;
          this.toastService.error('I could not update the settings!', 'Ooops');
        }
      )
    );
  }

}
