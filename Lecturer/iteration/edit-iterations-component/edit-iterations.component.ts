import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Iteration } from '../../../../shared/Store/Models/iteration';
import { IMyOptions } from 'ngx-mydatepicker';
import * as moment from 'moment';
import { CedValidators } from '../../../../shared/Directives/ced.validators';

@Component({
  selector: 'ced-edit-iterations',
  templateUrl: 'edit-iterations.component.html',
  styleUrls: ['edit-iterations.component.scss']
})
export class EditIterationsComponent extends ComponentBase implements OnInit {

  /** How much time will bass before the component emits a valid set of Iterations */
  @Input() throttle: number = 1500;

  /**
   * The backing field of the assignment input
   */
  private _assignment: Assignment;
  @Input('assignment') set EditIterationsComponent__Assignment(value: Assignment) {
    if(!value) return;

    this._assignment = value;

    // Copy all the iterations to a new array, so no modification is done to the originals
    for(let iteration of this._assignment.iterations) {
      this._iterations.push(Object.assign({}, iteration));
    }

    this.setUp();
  }

  @Output('iterations') validIterations_EventEmitter: EventEmitter<Iteration[]>;

  /** The local copy of the iterations. All the operations are done on this */
  private _iterations: Iteration[];

  /** The FormArray that will manipulate all of the iterations */
  private iterationsArray: FormArray;

  /** The FormGroup wrapping the FormArray */
  public iterationsForm: FormGroup;

  /** Options for the datepickers, will handle disabling specific dates*/
  public datePickerOptions: IMyOptions = {

  };


  constructor(private fb: FormBuilder) {
    super();

    this._iterations = [];
    this.validIterations_EventEmitter = new EventEmitter<Iteration[]>();
  }

  ngOnInit() {
    this.iterationsArray = this.fb.array([]);

    this.iterationsForm = this.fb.group({
      iterations: this.iterationsArray
     });

    this.disposeOnDestroy(this.iterationsForm.valueChanges.throttleTime(this.throttle).filter(value => this.iterationsForm.valid).subscribe(value => {
      let result = [];
      // console.log(value);
      // Perhaps we could use this._iterations here ?
      for(let iteration of value.iterations) {
        result.push({
          assignment_id: this._assignment.id,
          deadline: iteration.deadline.formatted,
          start_date: iteration.startDate.formatted,
          name: iteration.name
        })
      }

      this.validIterations_EventEmitter.emit(result);

    }));
  }

  public setUp(): void {

    console.log(this._assignment);

    let aStartDate = moment(this._assignment.start_date);
    let aEndDate = moment(this._assignment.end_date);

    this.datePickerOptions = {
      dateFormat: 'yyyy-mm-dd',
      disableUntil: { year: aStartDate.year(), month: aStartDate.month() + 1, day: aStartDate.date() },
      disableSince: { year: aEndDate.year(), month: aEndDate.month() + 1, day: aEndDate.date() },
    };

    for(let iteration of this._iterations) {
      this.addGroupFromIteration(iteration, this.iterationsArray.length);
    }
  }

  public addIterationGroup(): void {
    let new_iteration: Iteration = {
      assignment_id: this._assignment.id,
      name: '',
      start_date: '',
      deadline: ''
    };

    this._iterations.push(new_iteration);

    this.addGroupFromIteration(new_iteration, this.iterationsArray.length);
  }

  /**
   * Create a form group of the given iteration, and will hook up the validators for start date
   * and deadline. Finally it will inform the neighbours to update their own validators.
   * @param iteration - The Iteration behind the FormGroup
   * @param index - The index where the FormGroup will be added
   */

  private addGroupFromIteration(iteration: Iteration, index): void {

    let startDate = this.fb.control(iteration.start_date);

    let deadline = this.fb.control(iteration.deadline);

    let group = this.fb.group({
      name: [iteration.name, Validators.compose([Validators.required])],
      startDate: startDate,
      deadline: deadline
    });

    this.iterationsArray.insert(index, group);

    this.addStartDateValidators(group, index);
    this.addDeadlineValidators(group, index);

    //Notify previous group
    this.addStartDateValidators(<FormGroup>this.iterationsArray.at(index - 1), index - 1);
    this.addDeadlineValidators(<FormGroup>this.iterationsArray.at(index - 1), index - 1);

    //Notify next group
    this.addStartDateValidators(<FormGroup>this.iterationsArray.at(index + 1), index + 1);
    this.addDeadlineValidators(<FormGroup>this.iterationsArray.at(index + 1), index + 1);
  }

  /**
   * Adds Validators to the startDate form control
   * we need to do it this way so we can always hook it up to the previous
   * and next form control
   *
   *
   * @param {FormGroup} formGroup - The form group containing the startDate to add validators to
   * @param {number} index - The index of the form group in the array
   */
  private addStartDateValidators(formGroup: FormGroup, index: number): void {
    if (!formGroup) return;

    formGroup.controls['startDate'].clearValidators();

    let resultValidators = [
      Validators.required,
      CedValidators.dateIsNotBeforeString(this._assignment.start_date),
      CedValidators.dateIsNotAfterString(this._assignment.end_date)
      ];

    let previous: FormGroup = <FormGroup>this.iterationsArray.at(index - 1);

    if(previous) {
      resultValidators.push(CedValidators.dateIsNotBefore(previous.controls['deadline']));
    }

    formGroup.controls['startDate'].setValidators(resultValidators);
    formGroup.controls['startDate'].updateValueAndValidity();
  }

  /**
   * Adds Validators to the deadline form control
   * we need to do it this way so we can always hook it up to the previous
   * and next form control
   *
   *
   * @param {FormGroup} formGroup - The form group containing the deadline to add validators to
   * @param {number} index - The index of the form group in the array
   */
  private addDeadlineValidators(formGroup: FormGroup, index: number): void {
    if (!formGroup) return;

    formGroup.controls['deadline'].clearValidators();
    let resultValidators = [
      Validators.required,
      CedValidators.dateIsNotBeforeString(this._assignment.start_date),
      CedValidators.dateIsNotAfterString(this._assignment.end_date),
      CedValidators.dateIsNotBefore(formGroup.controls['startDate'])
    ];

    let next: FormGroup = <FormGroup>this.iterationsArray.at(index + 1);

    if(next) {
      resultValidators.push(CedValidators.dateIsNotAfter(next.controls['startDate']));
    }

    formGroup.controls['deadline'].setValidators(resultValidators);
    formGroup.controls['deadline'].updateValueAndValidity();
  }

  /**
   * Sets up a new Iteration and begins the creation of the corresponding FormGroup
   * @param index - The index where the FormGroup should be added
   */
  public addIterationGroupAt(index: number): void {
    let previous = this._iterations[index];

    let new_iteration: Iteration = {
      assignment_id: this._assignment.id,
      name: '',
      start_date: previous.deadline,
      deadline: ''
    };

    let next = this._iterations[index + 1];

    if(next) {
      new_iteration.deadline = next.start_date;
    }

    this._iterations.splice(index + 1, 0, new_iteration);

    this.addGroupFromIteration(new_iteration, index + 1);

  }

  public checkForError(control: AbstractControl, nameOfChild: string, error: string): boolean {
    let formGroup = <FormGroup>control;
    let formControl = formGroup.controls[nameOfChild];
    return formControl.hasError(error) && formControl.dirty;
  }

  public removeIterationAt(index: number): void {
    this.iterationsArray.removeAt(index);
    this._iterations.splice(index, 1);

    let previous = <FormGroup>this.iterationsArray.at(index - 1);
    let next = <FormGroup>this.iterationsArray.at(index + 1);

    this.addStartDateValidators(previous, index - 1);
    this.addDeadlineValidators(previous, index - 1);

    this.addStartDateValidators(next, index + 1);
    this.addDeadlineValidators(next, index + 1);
  }

  public getJustifyContent(): string {
    return this._iterations.length > 2 ? 'space-around': 'flex-start';
  }

}
