import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { AssignmentService } from '../../../../shared/Services/assignment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CedValidators } from '../../../../shared/Directives/ced.validators';
import { PeerAssessmentService } from '../../../../shared/Services/peer-assessment.service';
import { Question } from '../../../../shared/Store/Models/question';
import { isNullOrUndefined } from 'util';
import { DragulaService } from 'ng2-dragula';
import { UniversalValidators } from 'ng2-validators';
import { TimeHelpers } from '../../../../shared/Helpers/time.helpers';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'ced-new-pa-form',
  templateUrl: 'new-pa-form.component.html',
  styleUrls: ['new-pa-form.component.scss'],
  providers: [DragulaService]
})
export class NewPeerAssessmentFormComponent extends ComponentBase implements OnInit {

  public assignments: Assignment[];
  public selectedAssignment: Assignment;
  public selectForm: FormGroup;
  public offsetsForm: FormGroup;

  public questions: Question[];
  public formQuestions: Question[];
  public extraQuestions: Question[];
  public canShowQuestions: boolean;

  constructor(store: Store<IAppState>, private assignmentService: AssignmentService, private assessmentService: PeerAssessmentService, private fb: FormBuilder, private toastService: ToastrService, private router: Router) {
    super();

    this.assignmentService.getAll();
    this.assessmentService.getQuestions();
    this.formQuestions = [];
    this.extraQuestions= [];
    this.canShowQuestions = false;

    this.disposeOnDestroy(store.select((state: IAppState) => state.assignments).subscribe(value => {
        this.assignments = value;
      })
    );

    this.disposeOnDestroy(store.select((state: IAppState) => state.questions).subscribe(value => {
        this.questions = value;
      })
    )
  }

  ngOnInit() {
    this.selectForm = this.fb.group({
      assignmentSelect: ['0', Validators.compose([Validators.required, CedValidators.notSelectedValue("0")])]
    });

    this.disposeOnDestroy(this.selectForm.valueChanges
      .filter(value => this.selectForm.valid)
      .map(value => value.assignmentSelect)
      .map(value => Number.parseInt(value))
      .map(id => this.assignments.find(a => a.id == id))
      .filter(assignment => !isNullOrUndefined(assignment))
      .subscribe(value => {
        this.selectedAssignment = value;
      })
    );

    let start = this.fb.control(0, Validators.compose([
      Validators.required,
      UniversalValidators.isNumber
      ])
    );

    this.offsetsForm = this.fb.group({
      startOffset: start,
      endOffset: [1, Validators.compose([Validators.required, UniversalValidators.isNumber, CedValidators.hasGreaterNumericValueThan(start)])]
    });


  }

  public debug(): void {
    console.log(this.formQuestions);
  }

  public offsetsDone(): void {
    for(let i in this.offsetsForm.controls) {
      let c = this.offsetsForm.controls[i];
      c.updateValueAndValidity();
      c.markAsDirty();
    }

    this.canShowQuestions = this.offsetsForm.valid;
  }

  public submitQuestions(): void {
    let data = {
      end_offset: TimeHelpers.daysToMilliseconds(this.offsetsForm.controls['endOffset'].value),
      questions: this.formQuestions,
      start_offset: TimeHelpers.daysToMilliseconds(this.offsetsForm.controls['startOffset'].value),
      assignment_id: this.selectedAssignment.id
    };


    this.disposeOnDestroy(this.assessmentService.createForm$(data)
      .subscribe(
        (res) => {
          this.toastService.success('I created your form!', 'Success');
          this.router.navigate(['/assignments']);
        },
        (err) => {
          this.toastService.error('I could not create your form!', 'Something went wrong');
        }
      )
    );
  }

  public onFormQuestionsReceived(questions: Question[]) {
    this.formQuestions = questions;
  }

  public newQuestionReceived(newQuestion: Question): void {
    this.extraQuestions = [newQuestion, ...this.extraQuestions];
  }

}
