import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Project } from '../../../../shared/Store/Models/project';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Observable } from 'rxjs';
import { Emoji } from '../../../../shared/Store/Models/emoji';
import { style, transition, trigger, animate, state } from '@angular/animations';
import { ProjectService } from '../../../../shared/Services/project.service';
import { Feeling } from '../../../../shared/Store/Models/feeling';
import { forEach } from '@angular/router/src/utils/collection';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { ProjectEvaluation } from '../../../../shared/Store/Models/project-evaluation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ced-project-evaluation',
  templateUrl: 'project-evaluation.component.html',
  styleUrls: ['project-evaluation.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in',style({ opacity: 1}) ),
      transition('void => *', [
        style({ opacity: 0}),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ opacity: 0}))
      ])
    ])
  ]
})
export class ProjectEvaluationComponent extends ComponentBase implements OnInit, AfterViewInit {

  public _project: Project;
  @Input('project') set ProjectEvaluationComponent__Project(value) {
    if(!value) return;

    this._project = value;
  }

  private _projectId: number;
  @Input('project_id') set ProjectEvaluationComponent__ProjectID(value) {
    if(!value) return;

    this._projectId = value;
  }

  private _iterationId: number;
  @Input('iteration_id') set ProjectEvaluationComponent__IterationID(value) {
    if(!value) return;

    this._iterationId = value;
  }

  private _teamAnswers: any;
  @Input('team_answers') set ProjectEvaluationComponent__TeamAnswers(value) {
    if(!value) return;

    this._teamAnswers = value;

    let result = 0;
    for(let ans of this._teamAnswers) {
      if(ans.percent_completed) {
        result += ans.percent_completed;
      }
    }

    this.average = result / this._teamAnswers.length;
  }

  public average: number;
  public projectProgress: number;
  public emojis: Emoji[];
  public selectedEmojis: Emoji[];
  @ViewChild('slider') sliderElement: ElementRef;

  constructor(private projectService: ProjectService, private store: Store<IAppState>, private toastService: ToastrService) {
    super();
    this.projectProgress = 0;
    this.average = 0;
    this.selectedEmojis = [];

    this.disposeOnDestroy(this.projectService.getFeelings().subscribe(
      feelings => {
        this.setUpEmojis(feelings);
      },
      err => console.log(err)
    ));
  }

  ngOnInit() {
    // this.setUpProject();
    this.disposeOnDestroy(this.store.select((state: IAppState) => state.projects)
      .map(projects => projects.find(p => p.id == this._projectId))
      .subscribe(project => this.ProjectEvaluationComponent__Project = project)
    );
  }

  ngAfterViewInit() {
    this.disposeOnDestroy(Observable.fromEvent(this.sliderElement.nativeElement, 'input')
      .map((event: any) => event.target.value)
      .subscribe(value => this.projectProgress += value - this.projectProgress)
    );

  }
  //
  // public increment(): void {
  //   this.projectProgress += 10;
  // }

  public selectEmoji(index: number, event): void {
    let em = this.emojis[index];
    this.emojis.splice(index, 1);
    this.selectedEmojis.push(em);
  }

  public deselectEmoji(index: number): void {
    let em = this.selectedEmojis[index];
    this.selectedEmojis.splice(index, 1);
    this.emojis.push(em);
  }

  public submitEvaluation(): void {
    let feelings = [];

    for (let f of this.selectedEmojis) {
      feelings.push({ feeling_id: f.feeling_id, percent: '100' });
    }

    let evaluation: ProjectEvaluation = {
      iteration_id: this._iterationId,
      project_id: this._projectId,
      percent_complete: this.projectProgress,
      feelings: feelings
    };

    console.log(evaluation);

    this.disposeOnDestroy(this.projectService.submitProjectEvaluation(evaluation)
      .subscribe(
        res => {
          this.toastService.success('Project Evaluation submitted!', 'Success');
        },
        err => console.log(err)
      )
    );
  }


  private setUpProject(): void {
    this.ProjectEvaluationComponent__Project =  {
      "id": 1,
        "assignment_id": 9,
        "project_name": "Project 540",
        "team_name": "The xmen537",
        "description": "Lorem ipsum dolor sit amet, pri in erant detracto antiopam, duis altera nostrud id eam. Feugait invenire ut vim, novum reprimique reformidans id vis, sit at quis hinc liberavisse. Eam ex sint elaboraret assueverit, sed an equidem reformidans, idque doming ut quo. Ex aperiri labores has, dolorem indoctum hendrerit has cu. At case posidonium pri.",
        "logo": null,
        "enrollment_key": "0ab282a528996bf709f95013bcd0da57",
        "unit_id": 1,
        "color": "#cfd2ac",
        "pending_project_evaluation": false,
        "points": {
        "total": 0,
          "average": 0
      },
      "students": [
        {
          "id": 2,
          "first_name": "Jonathan476",
          "last_name": "Burgerhuman985",
          "email": "jonathan56766burgerhuman48053@gmail.com",
          "type": "Student",
          "provider": "test",
          "avatar_url": "http://i.pravatar.cc/100",
          "nickname": "wolverine1614"
        },
        {
          "id": 3,
          "first_name": "Jonathan665",
          "last_name": "Burgerhuman614",
          "email": "jonathan66450burgerhuman84547@gmail.com",
          "type": "Student",
          "provider": "test",
          "avatar_url": "http://i.pravatar.cc/100",
          "nickname": "wolverine175"
        },
        {
          "id": 4,
          "first_name": "Jonathan577",
          "last_name": "Burgerhuman176",
          "email": "jonathan64589burgerhuman70332@gmail.com",
          "type": "Student",
          "provider": "test",
          "avatar_url": "http://i.pravatar.cc/100",
          "nickname": "wolverine841"
        }
      ]
    };
  }

  private setUpEmojis(feelings: Feeling[]): void {
    this.emojis = [];

    for(let f of feelings) {
      this.emojis.push({ feeling_id: f.id, em_class: f.css_class || 'ec ec-slightly-smiling-face', label: f.name })
    }
  }
}

