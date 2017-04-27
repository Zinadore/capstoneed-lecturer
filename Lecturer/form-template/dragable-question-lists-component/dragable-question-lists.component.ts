import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { DragulaService } from 'ng2-dragula';
import { Question } from '../../../../shared/Store/Models/question';

@Component({
  selector: 'ced-dragable-question-lists',
  templateUrl: 'dragable-question-lists.component.html',
  styleUrls: ['dragable-question-lists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragableQuestionListsComponent extends ComponentBase implements OnInit {

  public _questions: Question[];
  @Input('questions') set DragableQuestionListsComponent__Questions(value) {
    this._questions = [];
    for(let q of value) {
      this._questions.push(q);
    }
  }

  @Input('extra-questions') set DragableQuestionListsComponent__ExtraQuestions(value) {
    if(!value) return;
    this.formQuestions.push(value);
    this.questionsEventEmitter.emit(this.formQuestions);
  }

  @Input('form-questions') set DragableQuestionListsComponent__FormQuestions(value) {
    if(!value) return;
    this.formQuestions = [];
    for(let q of value) {
      this.formQuestions.push(q);
    }
    this.questionsEventEmitter.emit(this.formQuestions);
  }

  @Output('new-form-questions') questionsEventEmitter: EventEmitter<Question[]>;

  public formQuestions: Question[];

  constructor(private dragulaService: DragulaService) {
    super();

    this._questions = [];
    this.formQuestions = [];
    this.questionsEventEmitter = new EventEmitter<Question[]>();

    this.dragulaService.setOptions('questions-bag', {
      revertOnSpill: true,
      removeOnSpill: false,
      copy: false
    });
  }

  ngOnInit() {
    this.disposeOnDestroy(this.dragulaService.dropModel.subscribe(_ => {
      this.questionsEventEmitter.emit(this.formQuestions);
    }))
  }

  public debug(): void {
    console.log(this.formQuestions);
    console.log(this._questions);
  }

}
