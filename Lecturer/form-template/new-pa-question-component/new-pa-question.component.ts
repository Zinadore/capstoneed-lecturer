import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { PeerAssessmentService } from '../../../../shared/Services/peer-assessment.service';
import { QuestionType } from '../../../../shared/Store/Models/question-type';
import { CedValidators } from '../../../../shared/Directives/ced.validators';
import { Question } from '../../../../shared/Store/Models/question';

@Component({
  selector: 'ced-new-pa-question',
  templateUrl: 'new-pa-question.component.html',
  styleUrls: ['new-pa-question.component.scss']
})
export class NewPaQuestionComponent extends ComponentBase implements OnInit {

  public newQuestionForm: FormGroup;
  public types: QuestionType[];

  @Output('newQuestion') newQuestionEventEmitter: EventEmitter<Question>;

  constructor(private store: Store<IAppState>, private assessmentService: PeerAssessmentService, private fb: FormBuilder) {
    super();
    this.assessmentService.getQuestionTypes();
    this.newQuestionEventEmitter = new EventEmitter<Question>();
    this.disposeOnDestroy(this.store.select((state: IAppState) => state.question_types).subscribe(value => {
        this.types = value;
      })
    )
  }

  ngOnInit() {
    this.newQuestionForm = this.fb.group({
      questionText: ['', Validators.required],
      typeSelect: ['0', CedValidators.notSelectedValue("0")]
    })
  }

  public addQuestion(): void {

    if(!this.newQuestionForm.valid) return;

    let typeId = Number.parseInt(this.newQuestionForm.get('typeSelect').value);

    let newQuestion: Question = {
      text: this.newQuestionForm.get('questionText').value,
      type_id: typeId,
      question_type: this.types.find(t => t.id == typeId)
    };

    this.newQuestionForm.reset();

    this.newQuestionEventEmitter.emit(newQuestion);
  }

}
