// import { ProjectService } from '../../../../../shared/Services/project.service';
// import { Project } from '../../../../../shared/Store/Models/project';
// import { Assignment } from '../../../../../shared/Store/Models/assignment';
// import { Observable } from 'rxjs/Rx';
// import { AssignmentService } from '../../../../../shared/Services/assignment.service';
// import { ActivatedRoute } from '@angular/router';
// import { AssignmentDetailsComponent } from '../assignment-details.component';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';

// class ActivatedRouteStub extends ActivatedRoute {
//     constructor() {
//         super();
//         this.params = Observable.of({id: "1"});
//     }
// }

// class AssignmentServiceStub extends AssignmentService {
//   public get(id: number): Observable<Assignment> {
//     return Observable.of({  id: 1,
//                             start_date: "2017-01-11",
//                             end_date: "2017-06-03",
//                             name: "Assignment 69.62043860271753",
//                             unit_id: 1,
//                             href: "/assignments/1" })
//   }
// }

// class ProjectServiceStub extends ProjectService {
//   public getAllActiveForAssignment(id: number): Observable<Project[]> {
//     return Observable.of([
//       {
//         id: 1,
//         assignment_id: 4,
//         unit_id: 5,
//         project_name: "Project 68",
//         team_name: "The xmen68",
//         description: "Lorem ipsum dolor sit amet, pri in erant detracto antiopam, duis altera nostrud id eam. Feugait invenire ut vim, novum reprimique reformidans id vis, sit at quis hinc liberavisse. Eam ex sint elaboraret assueverit, sed an equidem reformidans, idque doming ut quo. Ex aperiri labores has, dolorem indoctum hendrerit has cu. At case posidonium pri.",
//         logo: null,
//         enrollment_key: "c53748d8339ec99135bdc652510aaa09"
//       },
//       {
//         id: 2,
//         assignment_id: 4,
//         unit_id: 2,
//         project_name: "Project 69",
//         team_name: "The xmen69",
//         description: "Lorem ipsum dolor sit amet, pri in erant detracto antiopam, duis altera nostrud id eam. Feugait invenire ut vim, novum reprimique reformidans id vis, sit at quis hinc liberavisse. Eam ex sint elaboraret assueverit, sed an equidem reformidans, idque doming ut quo. Ex aperiri labores has, dolorem indoctum hendrerit has cu. At case posidonium pri.",
//         logo: null,
//         enrollment_key: "94f55ab707b1f53c8640cae29cffdf15"
//       }])
//   }
// }

// describe('AssignmentDetailsComponent', () => {
//   let component: AssignmentDetailsComponent;
//   let fixture: ComponentFixture<AssignmentDetailsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ AssignmentDetailsComponent ],
//       providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub }, 
//                   { provide: AssignmentService, useClass: AssignmentServiceStub },
//                   { provide: ProjectService, useClass: ProjectServiceStub }]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AssignmentDetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', async(() => {
//     expect(component).toBeTruthy();
//   }));
// });