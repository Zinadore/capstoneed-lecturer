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
    this.formQuestions = [];

    for(let q of value) {
      this._questions.push(q);
    }
  }
  public _extraQuestions: Question[];
  @Input('extras') set DragableQuestionListsComponent__ExtraQuestions(value) {
    console.log(value);
    this._extraQuestions = [];
    for(let q of value) {
      this._extraQuestions.push(q);
    }
  }

  @Output('form-questions') questionsEventEmitter: EventEmitter<Question[]>;

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
