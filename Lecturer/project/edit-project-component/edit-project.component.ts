import { Iteration } from '../../../../shared/Store/Models/iteration';
import { Unit } from '../../../../shared/Store/Models';
import { isUndefined } from 'util';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { CedValidators } from '../../../../shared/Directives/ced.validators';
import { Subject, Observable } from 'rxjs';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Project } from '../../../../shared/Store/Models/project';
import { ProjectService } from '../../../../shared/Services/project.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'ced-edit-project',
  templateUrl: 'edit-project.component.html',
  styleUrls: ['edit-project.component.scss']
})
export class EditProjectComponent extends ComponentBase implements OnInit {

  private editGroupForm: FormGroup;
  private project: Project;
  private unit: Unit;
  private iterations: Iteration[];
  private assignment: Assignment;
  private project_id: number;

  constructor(private formBuilder: FormBuilder, 
              private store: Store<IAppState>,
              private route: ActivatedRoute,              
              private projectService: ProjectService) {
    super();

    // Get an observable from the id in the params
    let idObservable = this.route.params
      .filter(params => params['id'])
      .map(params => params['id']);

    // Get the project from the server according to the id from the
    // idObservable and put it in the store
    this.disposeOnDestroy(idObservable.subscribe((id: number) => {
        this.projectService.getProject(id);
      })
    );

    // Get an observable from the Project in the store
    let projectObservable = idObservable
      .switchMap(id => this.store.select((state: IAppState) => state.projects)
        .map((projects: Project[]) => projects.find((p:Project) => p.id == id))
      );

    // If the Project observable emits a project that is not undefined, 
    // cacke it to the local project object to use in the component
    this.disposeOnDestroy(projectObservable.filter((p: Project) => 
      !isUndefined(p)).subscribe(p => 
        this.project = p
      )
    );
    
    // Sanity check mainly, if the project emitted by the observable is undefined, 
    // then the the project from the server and put it in store
    this.disposeOnDestroy(projectObservable.filter((p: Project) => isUndefined(p) || p == null).subscribe((_) => this.projectService.getProject(this.project_id)));            
    
    let unitObservable = projectObservable
      .filter((p: Project) => !isUndefined(p))
      .switchMap((p: Project) => this.store.select((state: IAppState) => state.units)
        .map((units: Unit[]) => units.find((u: Unit) => u.id == p.unit_id))
      );

    this.disposeOnDestroy(unitObservable.filter((u: Unit) => !isUndefined(u)).subscribe(u => this.unit = u));
    
    let assignmentObservable = projectObservable
      .filter((p: Project) => !isUndefined(p))
      .switchMap((p: Project) => this.store.select((state: IAppState) => state.assignments)
        .map((assignments: Assignment[]) => assignments.find((a: Assignment) => a.id == this.project.assignment_id))
      );

    this.disposeOnDestroy(assignmentObservable.filter((a: Assignment) => 
      !isUndefined(a)).subscribe(a => {
        this.assignment = a
        this.iterations = a.iterations
      })
    )
  }

  ngOnInit() {
    this.editGroupForm = this.formBuilder.group({
        project_name: [''],
        team_name: [''],
        description: [''],
        enrollment_key: [''],
        logo: ['']                 
    });
    
    // this.unitSelectionForm = this.fb.group({
    //   unitSelect: [0, CedValidators.notSelectedValue("0")],
    //   assignmentSelect: [{ value: "0", disabled: true}, CedValidators.notSelectedValue("0")]
    // });

    // this.selectionStep_setup();

    // this.projectDetailsForm = this.fb.group({
    //   projectName: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])],
    //   projectDescription: [''],
    //   teamName: [''],
    //   projectKey: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])],
    //   autoGenerateKey: [false]
    // });

    // this.detailsStep_setup();

  }

  submit({ value, valid }: { value: Project, valid: boolean }) {
    console.log(value);
        console.log(valid);
  }

}
