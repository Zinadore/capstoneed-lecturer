import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CedValidators } from '../../../../shared/Directives/ced.validators';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { Unit } from '../../../../shared/Store/Models/unit';
import { UnitService } from '../../../../shared/Services/unit.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ced-new-assignment',
  templateUrl: 'new-assignment.component.html',
  styleUrls: ['new-assignment.component.scss']
})
export class NewAssignmentComponent extends ComponentBase implements OnInit {

  private unitSelectionForm: FormGroup;
  private assignmentDetailsForm: FormGroup;

  private units: Unit[];

  constructor(private fb: FormBuilder, store: Store<IAppState>, unitService: UnitService) {
    super();

    this.disposeOnDestroy(store.select((state: IAppState) => state.units)
      .do(_ => unitService.loadUnits())
      .subscribe((units: Unit[]) => this.units = units)
    )
  }

  ngOnInit(): void {
    this.unitSelectionForm = this.fb.group({
      unitSelect: [0, CedValidators.notSelectedValue("0")]
    });

    this.selectionStep_Setup();

    this.assignmentDetailsForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      startDate: [Date.now(), Validators.compose([Validators.required])],
      endDate: [Date.now(), Validators.compose([Validators.required])]
    });

  }

  private selectionStep_Setup(): void {

  }

  private selectionStep_CanGoNext(): Observable<boolean> {
    return this.unitSelectionForm.valueChanges.switchMap(_ => Observable.of(this.unitSelectionForm.valid));
  }

  public selectionStep_OnNext = (): void => {
    console.log(this.unitSelectionForm.value);
  };

  private detailsStep_Setup(): void {

  }

  private detailsStep_CanGoNext(): Observable<boolean> {
    return this.assignmentDetailsForm.valueChanges.switchMap(_ => Observable.of(this.assignmentDetailsForm.valid));
  }

  public detailsStep_OnNext = (): void => {
    console.log(this.assignmentDetailsForm.value);
  };

}

