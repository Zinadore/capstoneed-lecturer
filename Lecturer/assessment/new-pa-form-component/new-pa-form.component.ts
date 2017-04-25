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

  public questions: Question[];
  public formQuestions: Question[];
  public extraQuestions: Question[];

  constructor(store: Store<IAppState>, private assignmentService: AssignmentService, private assessmentService: PeerAssessmentService, private fb: FormBuilder) {
    super();

    this.assignmentService.getAll();
    this.assessmentService.getQuestions();
    this.formQuestions = [];
    this.extraQuestions= [];

    this.disposeOnDestroy(store.select((state: IAppState) => state.assignments).subscribe(value => {
        this.assignments = value;
      })
    );

    this.disposeOnDestroy(store.select((state: IAppState) => state.questions).subscribe(value => {
        this.questions = value;
        this.formQuestions = [];
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


  }

  public debug(): void {
    console.log(this.formQuestions);
  }

  public submitQuestions(): void {

  }

  public onFormQuestionsReceived(questions: Question[]) {
    this.formQuestions = questions;
  }

  public newQuestionReceived(newQuestion: Question): void {
    this.extraQuestions = [newQuestion, ...this.extraQuestions];
  }

}
