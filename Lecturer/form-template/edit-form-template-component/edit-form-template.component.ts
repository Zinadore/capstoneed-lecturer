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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ced-edit-form-template',
  templateUrl: 'edit-form-template.component.html',
  styleUrls: ['edit-form-template.component.scss']
})
export class EditFormTemplateComponent extends ComponentBase implements OnInit {

  public templateDetailsForm: FormGroup;
  public newQuestionSubject: Subject<Question>;
  public questions: Question[];
  public areQuestionsValid: boolean;
  private formQuestions: Question[];
  private formTemplate: FormTemplate;

  constructor(store: Store<IAppState>, private fb: FormBuilder, private assessmentService: PeerAssessmentService,
              private templateService: FormTemplateService, private router: Router, route: ActivatedRoute) {
    super();

    this.areQuestionsValid = false;
    this.newQuestionSubject = new Subject<Question>();
    this.formQuestions = [];

    this.assessmentService.getQuestions();
    this.templateService.getAll();

    this.disposeOnDestroy(store.select((state: IAppState) => state.questions).subscribe(value => this.questions = value));
    this.disposeOnDestroy(route.params.filter(params => params['id'])
      .map(params => params['id'])
      .switchMap(id => store.select((state: IAppState) => state.form_templates)
        .map(templates => templates.find(t => t.id == id))
      )
      .subscribe(template => {
        this.formTemplate = template;
      })
    )
  }

  ngOnInit() {
    this.templateDetailsForm = this.fb.group({
      formName: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])]
    });
    this.disposeOnDestroy(this.templateDetailsForm.valueChanges.throttleTime(500).subscribe(value => {
      console.log(value);
      this.checkQuestionsValidity();
    }));
  }

  public onQuestionsReceived(questions: Question[]): void {
    this.formQuestions = questions;
    this.checkQuestionsValidity();
    this.validateForm();
  }

  public onNewQuestionReceived(question: Question): void {
    this.newQuestionSubject.next(question);
  }

  public submitForm(): void {
    if(!this.templateDetailsForm.valid || !this.areQuestionsValid) return;

    let newForm: FormTemplate = {
      id: this.formTemplate.id,
      name: this.templateDetailsForm.controls['formName'].value,
      questions: this.formQuestions,
      lecturer_id: this.formTemplate.lecturer_id
    };

    this.disposeOnDestroy(this.templateService.update$(newForm)
      .subscribe(
        (res) => { this.router.navigate(['/form-templates']) },
        (err) => { console.log(err) }
      )
    );
  }

  private checkQuestionsValidity(): void {
    let textQuestions = this.formQuestions.filter((q: Question) => q.question_type.question_type === QUESTION_TYPE_TEXT);
    let nonTextQuestions = this.formQuestions.filter((q: Question) => q.question_type.question_type !== QUESTION_TYPE_TEXT);
    this.areQuestionsValid = (textQuestions.length <= 1) && (nonTextQuestions.length >=1);
  }

  private validateForm(): void {
    let control = this.templateDetailsForm.controls['formName'];
    control.updateValueAndValidity();
    control.markAsTouched();
    control.markAsDirty();
  }

}
