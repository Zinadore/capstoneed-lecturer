import { Component, Input, OnInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Iteration } from '../../../../shared/Store/Models/iteration';
import { IMyOptions } from 'ngx-mydatepicker';
import * as moment from 'moment';

@Component({
  selector: 'ced-edit-iterations',
  templateUrl: 'edit-iterations.component.html',
  styleUrls: ['edit-iterations.component.scss']
})
export class EditIterationsComponent extends ComponentBase implements OnInit {

  private _assignment: Assignment;
  @Input() set EditIterationsComponent__Assignment(value: Assignment) {
    if(!value) return;

    this._assignment = value;

    for(let iteration of this._assignment.iterations) {
      this._iterations.push(Object.assign({}, iteration));
    }

  }

  private _iterations: Iteration[];

  private iterationsArray: FormArray;
  public iterationsForm: FormGroup;

  public datePickerOptions: IMyOptions;


  constructor(private fb: FormBuilder) {
    super();

    this._iterations = [];
  }

  ngOnInit() {
    this.EditIterationsComponent__Assignment = {
      id: 3,
      start_date: "2017-04-21T00:16:52.274Z",
      end_date: "2018-05-19T12:46:51.804Z",
      name: "Assignment 0",
      unit_id: 2,
      iterations: [
        {
          assignment_id: 3,
          name: '',
          start_date: '2017-08-26T00:16:52.274Z',
          deadline: ''
        }
      ]
    };

    this.iterationsArray = this.fb.array([]);

    this.iterationsForm = this.fb.group({
      iterations: this.iterationsArray
    });

    let aStartDate = moment(this._assignment.start_date);
    let aEndDate = moment(this._assignment.end_date);

    this.datePickerOptions = {
      dateFormat: 'yyyy-mm-dd',
      disableUntil: { year: aStartDate.year(), month: aStartDate.month() + 1, day: aStartDate.date() },
      disableSince: { year: aEndDate.year(), month: aEndDate.month() + 1, day: aEndDate.date() },
    };

    for(let iteration of this._iterations) {
      this.addGroupFromIteration(iteration);
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

    this.addGroupFromIteration(new_iteration);
  }

  private addGroupFromIteration(iteration: Iteration): void {
    this.iterationsArray.push(this.fb.group({
      name: [iteration.name, Validators.compose([Validators.required])],
      startDate: [iteration.start_date, Validators.compose([Validators.required])],
      deadline: [iteration.deadline, Validators.compose([Validators.required])]
    }))
  }

  public debug(): void {
    // console.log(this._assignment);
    console.log(this._iterations);
    console.log(this.iterationsArray);
    // console.log(this.datePickerOptions);
  }

  public removeIterationAt(index: number): void {
    this.iterationsArray.removeAt(index);
    this._iterations.splice(index, 1);
  }

}
