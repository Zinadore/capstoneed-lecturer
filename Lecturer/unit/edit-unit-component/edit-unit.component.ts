import { BASE_URL } from './../../../../shared/Constants/settings';
import { CedValidators } from './../../../../shared/Directives/ced.validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Unit } from '../../../../shared/Store/Models';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { UnitService } from '../../../../shared/Services/unit.service';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { isUndefined } from 'util';
import { CustomHttp } from '../../../../shared/Services/customHttp';

@Component({
  selector: 'app-edit-unit.component.ts',
  templateUrl: './edit-unit.component.html',
  styleUrls: ['./edit-unit.component.scss']
})
export class EditUnitComponent extends ComponentBase {

  private editGroupForm: FormGroup;
  private unitObservable: Observable<Unit>
  private unit: Unit
  private currentYear: number;

  constructor(private formBuilder: FormBuilder,
              private store: Store<IAppState>,
              private route: ActivatedRoute,              
              private unitService: UnitService,
              private chttp: CustomHttp) { 
    
    super()

    this.currentYear = new Date().getFullYear();
    // Get an observable from the id in the params
    // let unitObservable = this.route.params
    //   .filter( params => params['id'])
    //   .map( params => params['id'])
    //   .map(id => {
    //     this.chttp.get(`${BASE_URL}/units/${id}`)
    //                  .map(res => res.json())
    //                  .subscribe(u => {
    //                    console.log(u)
    //                     // if(this.editGroupForm) {
    //                     //   this.editGroupForm.patchValue({
    //                     //     name: u.name,
    //                     //     year: u.year,
    //                     //     semester: u.semester,
    //                     //     code: u.code,
    //                     //     departmentName: u.department.name,
    //                     //     departmentUniversity: u.department.university
    //                     //   })
    //                     // }    
    //                   }, err => console.log(err))  
    //     }
    //   );
    // let idObservable = this.route.params
    //   .filter(params => params['id'])
    //   .map(params => params['id']);
      
    // this.disposeOnDestroy(idObservable.subscribe((id: number) => {
    //     this.chttp.get(`${BASE_URL}/units/${id}`)
    //       .map(res => res.json())
    //       .map(res => res.unit)
    //       .subscribe(u => {
    //         // console.log(u)
    //         this.unit = u;
    //         if(this.editGroupForm) {
    //           this.editGroupForm.patchValue({
    //             name: u.name,
    //             year: u.year,
    //             semester: u.semester,
    //             code: u.code,
    //             departmentName: u.department.name,
    //             departmentUniversity: u.department.university
    //           })
    //         }    
    //       }, err => console.log(err));
    //   })
    // );      

    // Get the project from the server according to the id from the
    // idObservable and put it in the store
    // this.disposeOnDestroy(idObservable.subscribe( (id: number) => {
    //     this.unitService.getUnit(id)
    //   })
    // )

    // Get an observable from the Project in the store
    // this.unitObservable = idObservable
    //   .switchMap(id => this.store.select( (state: IAppState) => state.units)
    //     .map( (units: Unit[]) => units.find( (u: Unit) => u.id == id))
    //   )

    // this.disposeOnDestroy(this.unitObservable.filter((u: Unit) => !isUndefined(u)).subscribe(u => {
    //     this.unit = u;
    //     if(this.editGroupForm) {
    //       this.editGroupForm.patchValue({
            // name: u.name,
            // year: u.year,
            // semester: u.semester,
            // code: u.code,
            // departmentName: u.department.name,
            // departmentUniversity: u.department.university
    //       })
    //     }
    //   })
    // );

        // Get an observable from the id in the params
    let idObservable = this.route.params
      .filter(params => params['id'])
      .map(params => params['id']);

    // Get the project from the server according to the id from the
    // idObservable and put it in the store
    this.disposeOnDestroy(idObservable.subscribe((id: number) => {
        this.unitService.getUnit(id);
      })
    );

    // Get an observable from the Project in the store
    let unitObservable= idObservable
      .switchMap(id => this.store.select((state: IAppState) => state.units)
        .map((units: Unit[]) => units.find((p:Unit) => p.id == id))
      );

    // If the Project observable emits a project that is not undefined,
    // cacke it to the local project object to use in the component
    this.disposeOnDestroy(unitObservable.filter((p: Unit) => !isUndefined(p)).subscribe(p => {
        this.unit = p;
        let u = p;
        if(this.editGroupForm) {
          this.editGroupForm.patchValue({
            name: u.name,
            year: u.year,
            semester: u.semester,
            code: u.code,
            departmentName: u.department.name,
            departmentUniversity: u.department.university
          })
        }
      })
    );

    // Sanity check mainly, if the project emitted by the observable is undefined,
    // then the the project from the server and put it in store
    // this.disposeOnDestroy(projectObservable.filter((p: Unit) => isUndefined(p) || p == null).subscribe((_) => this.unitService.getUnit(this.unitId)));
  }

  ngOnInit() {
     this.editGroupForm = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        year: [0, Validators.compose([Validators.required])],
        semester: ['', Validators.compose([Validators.required])],
        code: ['', Validators.compose([Validators.required])],
        departmentName: ['', Validators.compose([Validators.required])],
        departmentUniversity: ['', Validators.compose([Validators.required])],
    }); 
  }

}