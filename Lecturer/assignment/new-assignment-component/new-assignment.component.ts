import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CedValidators } from '../../../../shared/Directives/ced.validators';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { Unit } from '../../../../shared/Store/Models/unit';
import { UnitService } from '../../../../shared/Services/unit.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { AssignmentService } from '../../../../shared/Services/assignment.service';
import { TimeHelpers } from '../../../../shared/Helpers/time.helpers';
import { Iteration } from '../../../../shared/Store/Models/iteration';

@Component({
  selector: 'ced-new-assignment',
  templateUrl: 'new-assignment.component.html',
  styleUrls: ['new-assignment.component.scss']
})
export class NewAssignmentComponent extends ComponentBase implements OnInit {

  private unitSelectionForm: FormGroup;
  private assignmentDetailsForm: FormGroup;

  private tempAssignment: Assignment;
  private selectedUnit: Unit;
  private units: Unit[];
  private areIterationsValidSubject: BehaviorSubject<boolean>;

  constructor(private fb: FormBuilder, private assignmentservice: AssignmentService, store: Store<IAppState>, unitService: UnitService) {
    super();

    this.tempAssignment = {
      id: 0,
      start_date: '',
      end_date: '',
      name: '',
      iterations: []
    };

    this.areIterationsValidSubject = new BehaviorSubject<boolean>(false);

    unitService.loadUnits();

    this.disposeOnDestroy(store.select((state: IAppState) => state.units)
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
      startDate: ['', Validators.compose([Validators.required])],
      endDate: ['', Validators.compose([Validators.required])]
    });

  }

  public calculateProjectTimespan(): number {
    return TimeHelpers.getTimeSpanInDays(this.tempAssignment.start_date, this.tempAssignment.end_date);
  }

  private selectionStep_Setup(): void {
    let unitSelect = this.unitSelectionForm.get('unitSelect');
    this.disposeOnDestroy(unitSelect.valueChanges.subscribe(value => {
      if(unitSelect.valid) {
        this.selectedUnit = this.units.find(u => u.id == value);
      }
    }))

  }

  private selectionStep_CanGoNext(): Observable<boolean> {
    return this.unitSelectionForm.valueChanges.switchMap(_ => Observable.of(this.unitSelectionForm.valid));
  }

  public selectionStep_OnNext = (): void => {
    this.tempAssignment.unit_id = this.unitSelectionForm.get('unitSelect').value;

    if(this.selectedUnit && this.selectedUnit.id == this.tempAssignment.unit_id) {
      this.tempAssignment.unit = this.selectedUnit;
    } else {
      console.log('Something went terribly wrong with the unit selection');
    }

  };

  private detailsStep_Setup(): void {

  }

  private detailsStep_CanGoNext(): Observable<boolean> {
    return this.assignmentDetailsForm.valueChanges.switchMap(_ => Observable.of(this.assignmentDetailsForm.valid));
  }

  public detailsStep_OnNext = (): void => {
    this.tempAssignment.name = this.assignmentDetailsForm.get('name').value;
    this.tempAssignment.start_date = this.assignmentDetailsForm.get('startDate').value.formatted;
    this.tempAssignment.end_date = this.assignmentDetailsForm.get('endDate').value.formatted;
  };

  public overviewStep_CanGoNext(): Observable<boolean> {
    return Observable.of(true);
  }

  public overviewStep_OnNext = (): void => {
    this.assignmentservice.create(this.tempAssignment);
  };

  public iterationStep_OnReceivedIterations(iterations: Iteration[]): void {
   this.tempAssignment.iterations = iterations;
   this.areIterationsValidSubject.next(this.tempAssignment.iterations.length > 0);
  }

  public iterationStep_CanGoNext() {
    return this.areIterationsValidSubject.asObservable();
  }
}

