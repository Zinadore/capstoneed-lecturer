import { Unit } from '../../../../shared/Store/Models';
import { isUndefined } from 'util';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { CedValidators } from '../../../../shared/Directives/ced.validators';
import { Assignment } from '../../../../shared/Store/Models/assignment';
import { Project } from '../../../../shared/Store/Models/project';
import { ProjectService } from '../../../../shared/Services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ced-edit-project',
  templateUrl: 'edit-project.component.html',
  styleUrls: ['edit-project.component.scss']
})
export class EditProjectComponent extends ComponentBase implements OnInit {

  private editGroupForm: FormGroup;
  private project: Project;
  private unit: Unit;
  private assignment: Assignment;
  private project_id: number;
  private image;

  constructor(private formBuilder: FormBuilder,
              private store: Store<IAppState>,
              private route: ActivatedRoute,
              private toastService: ToastrService,
              private projectService: ProjectService) {
    super();

    // Get an observable from the id in the params
    let idObservable = this.route.params
      .filter(params => params['id'])
      .map(params => params['id']);

    // Get the project from the server according to the id from the
    // idObservable and put it in the store
    this.disposeOnDestroy(idObservable.subscribe((id: number) => {
        this.projectService.get(id);
      })
    );

    // Get an observable from the Project in the store
    let projectObservable = idObservable
      .switchMap(id => this.store.select((state: IAppState) => state.projects)
        .map((projects: Project[]) => projects.find((p:Project) => p.id == id))
      );

    // If the Project observable emits a project that is not undefined,
    // cacke it to the local project object to use in the component
    this.disposeOnDestroy(projectObservable.filter((p: Project) => !isUndefined(p)).subscribe(p => {
        this.project = p;
        if(this.editGroupForm) {
          this.editGroupForm.patchValue({
            project_name: p.project_name,
            team_name: p.team_name,
            description: p.description,
            enrollment_key: p.enrollment_key,
          })
        }
      })
    );

    // Sanity check mainly, if the project emitted by the observable is undefined,
    // then the the project from the server and put it in store
    this.disposeOnDestroy(projectObservable.filter((p: Project) => isUndefined(p) || p == null).subscribe((_) => this.projectService.get(this.project_id)));

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

    this.disposeOnDestroy(assignmentObservable.filter((a: Assignment) => !isUndefined(a)).subscribe(a => {
        this.assignment = a;
      })
    )
  }

  ngOnInit() {
    this.editGroupForm = this.formBuilder.group({
        project_name: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])],
        team_name: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])],
        description: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])],
        enrollment_key: ['', Validators.compose([Validators.required, CedValidators.notNullOrWhitespace])],
        logo: ['']
    });
  }

  public onSubmit(): void  {
    let newProject = {
      id: this.project.id,
      project_name: this.editGroupForm.controls['project_name'].value,
      team_name: this.editGroupForm.controls['team_name'].value,
      description: this.editGroupForm.controls['description'].value,
      enrollment_key: this.editGroupForm.controls['enrollment_key'].value,
    };
    this.disposeOnDestroy(this.projectService.updateProject$(newProject)
      .subscribe(
        (project) => this.toastService.success('Project updated!', 'Success'),
        (err) => this.toastService.error('Project could not be updated!', 'Oops')
      )
    );
  }

  public onNewImage(event): void {
    let file:File = event.target.files[0];
    let myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
      console.log(this.image)
    };
    myReader.readAsDataURL(file);
  }

}
