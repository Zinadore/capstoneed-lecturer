import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Unit } from '../../../../shared/Store/Models/unit';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { CedValidators } from '../../../../shared/Directives/ced.validators';
import { Subject, Observable } from 'rxjs';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Project } from '../../../../shared/Store/Models/project';
import { ProjectService } from '../../../../shared/Services/project.service';

@Component({
  selector: 'ced-new-project',
  templateUrl: 'new-project.component.html',
  styleUrls: ['new-project.component.scss']
})
export class NewProjectComponent extends ComponentBase implements OnInit {

  private unitSelectionForm: FormGroup;
  private units: Unit[];
  private selectedUnit: Unit;
  private assignments: Assignment[];
  private selectedAssignment: Assignment;
  private unitIdObservable: Subject<number>;
  private isUnitValid: boolean;
  private tempProject: Project;

  private projectDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<IAppState>, private projectService: ProjectService) {
    super();

    this.isUnitValid = false;
    this.unitIdObservable = new Subject<number>();

    this.disposeOnDestroy(this.store.select((state: IAppState) => state.units).subscribe(units => {
      this.units = units;
    }));

    this.disposeOnDestroy(this.unitIdObservable.switchMap(id => this.store.select((state: IAppState) => state.assignments)
        .map((assignments: Assignment[]) => assignments.filter((a: Assignment) => a.unit_id == id))
      )
      .subscribe((assignments: Assignment[]) => {
        this.assignments = assignments;
        this.unitSelectionForm.get('assignmentSelect').setValue("0");
      })
    );

  }

  ngOnInit() {
    this.unitSelectionForm = this.fb.group({
      unitSelect: [0, CedValidators.notSelectedValue("0")],
      assignmentSelect: [{ value: "0", disabled: true}, CedValidators.notSelectedValue("0")]
    });

    this.selectionStep_setup();

    this.projectDetailsForm = this.fb.group({
      projectName: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])],
      projectDescription: [''],
      teamName: [''],
      projectKey: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])],
      autoGenerateKey: [false]
    });

    this.detailsStep_setup();

  }

  private selectionStep_canGoNext(): Observable<boolean>{
    return this.unitSelectionForm.valueChanges
      .switchMap(_ => Observable.of(this.unitSelectionForm.valid && this.unitSelectionForm.get('assignmentSelect').enabled && this.unitSelectionForm.get('assignmentSelect').valid));
  }

  private selectionStep_onNext = (): void => {
    let unit_id = Number(this.unitSelectionForm.get('unitSelect').value);
    let assignment_id = Number(this.unitSelectionForm.get('assignmentSelect').value);

    this.disposeOnDestroy(this.store.select((state: IAppState) => state.units)
      .map((units: Unit[]) => units.find((u: Unit) => u.id == unit_id))
      .take(1)
      .subscribe((u:Unit) => this.selectedUnit = u));

    this.disposeOnDestroy(this.store.select((state: IAppState) => state.assignments)
      .map((assignments: Assignment[]) => assignments.find((a: Assignment) => a.id == assignment_id))
      .take(1)
      .subscribe((a:Assignment) => this.selectedAssignment = a));
  };

  private selectionStep_setup(): void {
    let unitControl = this.unitSelectionForm.get('unitSelect');
    let assignmentControl = this.unitSelectionForm.get('assignmentSelect');

    this.disposeOnDestroy(unitControl.valueChanges.subscribe(values => {
        this.isUnitValid = unitControl.valid;
        if(this.isUnitValid) {
          this.unitIdObservable.next(Number(unitControl.value));
        }
      })
    );

    this.disposeOnDestroy(unitControl.valueChanges.subscribe(value => {
      if(unitControl.valid) {
        assignmentControl.enable();
      } else {
        assignmentControl.disable();
      }
    }))
  }

  private detailsStep_setup(): void {
    let keyCheckbox = this.projectDetailsForm.get('autoGenerateKey');
    let keyInput = this.projectDetailsForm.get('projectKey');

    this.disposeOnDestroy(keyCheckbox.valueChanges.subscribe(value=> {
      if(value) {
        keyInput.setValue('');
        keyInput.disable();
      } else {
        keyInput.enable({ onlySelf: false, emitEvent: true });
      }
    }));

  }

  private detailsStep_canGoNext(): Observable<boolean> {
    return this.projectDetailsForm.valueChanges.switchMap(_ => Observable.of(this.projectDetailsForm.valid));
  }

  private detailsStep_onNext = (): void => {
    this.tempProject = {
      unit_id: this.selectedUnit.id,
      assignment_id: this.selectedAssignment.id,
      description: this.projectDetailsForm.get("projectDescription").value.trim(),
      project_name: this.projectDetailsForm.get("projectName").value.trim(),
    };

    let team_name = this.projectDetailsForm.get('teamName').value;
    if(team_name !== '')
      this.tempProject.team_name = team_name;

    if(!this.projectDetailsForm.get('autoGenerateKey').value) {
      this.tempProject.enrollment_key = this.projectDetailsForm.get('projectKey').value.trim();
    }
  };

  private overviewStep_canGoNext(): Observable<boolean> {
    return Observable.of(true);
  }

  private wizard_onFinish = (): void => {
    console.log(this.tempProject);
    this.projectService.createProject(this.tempProject);
  }
}
