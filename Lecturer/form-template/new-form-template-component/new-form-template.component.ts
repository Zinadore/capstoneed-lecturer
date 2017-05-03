import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CedValidators } from '../../../../shared/Directives/ced.validators';
import { Question } from '../../../../shared/Store/Models/question';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { PeerAssessmentService } from '../../../../shared/Services/peer-assessment.service';
import { QUESTION_TYPE_TEXT } from '../../../../shared/Store/Models/question-type';
import { FormTemplate } from '../../../../shared/Store/Models/form-template';
import { FormTemplateService } from '../../../../shared/Services/form-template.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ced-new-form-template',
  templateUrl: 'new-form-template.component.html',
  styleUrls: ['new-form-template.component.scss']
})
export class NewFormTemplateComponent extends ComponentBase implements OnInit {

  public templateForm: FormGroup;
  public newQuestionSubject: Subject<Question>;
  public questions: Question[];
  public areQuestionsValid: boolean;
  private formQuestions: Question[];

  constructor(store: Store<IAppState>, private fb: FormBuilder, private assessmentService: PeerAssessmentService, private templateService: FormTemplateService, private router: Router) {
    super();

    this.areQuestionsValid = false;
    this.newQuestionSubject = new Subject<Question>();
    this.formQuestions = [];

    this.assessmentService.getQuestions();
    this.disposeOnDestroy(store.select((state: IAppState) => state.questions).subscribe(value => this.questions = value));
  }

  ngOnInit() {
    this.templateForm = this.fb.group({
      formName: [null, Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])]
    })
  }

  public onQuestionsReceived(questions: Question[]): void {
    console.log('received');
    this.formQuestions = questions;
    this.checkQuestionsValidity();
    this.validateForm();
  }

  public onNewQuestionReceived(question: Question): void {
    this.newQuestionSubject.next(question);
  }

  public submitForm(): void {
    if(!this.templateForm.valid || !this.areQuestionsValid) return;

    let newForm: FormTemplate = {
      name: this.templateForm.controls['formName'].value,
      questions: this.formQuestions
    };

    this.disposeOnDestroy(this.templateService.create$(newForm)
      .subscribe(
        (res) => { this.router.navigate(['form-templates']) },
        (err) => console.log(err)
      )
    );
  }

  private checkQuestionsValidity(): void {
    let textQuestions = this.formQuestions.filter((q: Question) => q.question_type.question_type === QUESTION_TYPE_TEXT);
    let nonTextQuestions = this.formQuestions.filter((q: Question) => q.question_type.question_type !== QUESTION_TYPE_TEXT);
    this.areQuestionsValid = (textQuestions.length <= 1) && (nonTextQuestions.length >=1);
  }

  private validateForm(): void {
    let control = this.templateForm.controls['formName'];
    control.updateValueAndValidity();
    control.markAsTouched();
    control.markAsDirty();
  }

}
