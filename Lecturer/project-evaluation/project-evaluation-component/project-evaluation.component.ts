import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { Project } from '../../../../shared/Store/Models/project';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Observable } from 'rxjs';

@Component({
  selector: 'ced-project-evaluation',
  templateUrl: 'project-evaluation.component.html',
  styleUrls: ['project-evaluation.component.scss']
})
export class ProjectEvaluationComponent extends ComponentBase implements OnInit, AfterViewInit {

  public _project: Project;
  @Input('project') set ProjectEvaluationComponent__Project(value) {
    if(!value) return;

    this._project = value;
  }

  public _assignment: Assignment;
  @Input('assignment') set ProjectEvaluationComponent__Assignment(value) {
    if(!value) return;

    this._assignment = value;
  }

  public projectProgress: number;
  @ViewChild('slider') sliderElement: ElementRef;

  constructor() {
    super();
    this.projectProgress = 0;
  }

  ngOnInit() {
    this.setUpProject();
    this.setUpAssignment();
  }

  ngAfterViewInit() {
    this.disposeOnDestroy(Observable.fromEvent(this.sliderElement.nativeElement, 'input')
      .map((event: any) => event.target.value)
      .do(console.log)
      .subscribe(value => this.projectProgress += value - this.projectProgress)
    );

  }

  public increment(): void {
    this.projectProgress += 10;
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

  private setUpAssignment(): void{
    this.ProjectEvaluationComponent__Assignment = {
      "id": 9,
        "start_date": "2017-04-26",
        "end_date": "2017-10-04",
        "name": "Assignment 0",
        "unit_id": 9,
        "unit": {
        "id": 9,
          "name": "Unit 45",
          "code": "HI8FWs9wEj4ASQ==",
          "semester": "Spring",
          "year": 2016,
          "archived_at": null,
          "department_id": 9
      }
    }
  }
}

