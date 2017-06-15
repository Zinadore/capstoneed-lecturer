import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { UnitService } from '../../../../shared/Services/unit.service';
import { Unit } from '../../../../shared/Store/Models/unit';
import { ToastConfig, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'ced-new-unit',
  templateUrl: 'newUnit.component.html',
  styleUrls: ['newUnit.component.scss']
})
export class NewUnitComponent extends ComponentBase{
  private unit;
  private unitForm: FormGroup;
  private unitService: UnitService;
  private toastrService: ToastrService;
  private currentYear: number;
  private _canGoNext: BehaviorSubject<Boolean>;

  public canGoNext(): Observable<true> {
    return this._canGoNext.asObservable();
  }

  constructor(private fb: FormBuilder, unitService: UnitService, toastrService: ToastrService, private router: Router) {
    super();
    this._canGoNext = new BehaviorSubject(false);
    this.currentYear = new Date().getFullYear();
    this.unitService = unitService;
    this.toastrService = toastrService;
    this.unit = {
      name: '',
      semester: '',
      code: '',
      year: 0,
      department_attributes: {
        name: '',
        university: ''
      }
    };

    this.unitForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      semester: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      year: [this.currentYear, Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      departmentName: ['', Validators.compose([Validators.required])],
      departmentUniversity: ['', Validators.compose([Validators.required])]
    });

    this.disposeOnDestroy(this.unitForm.valueChanges.subscribe(_ => this._canGoNext.next(this.unitForm.valid)));
    this.disposeOnDestroy(this.unitForm.valueChanges.subscribe(_ => console.log(_)));
    this._canGoNext.next(this.unitForm.valid);
  }

  ngOnInit() {
  }

  private canSubmit(): Observable<boolean> {
    return this.unitForm.valueChanges.switchMap(_ => Observable.of(this.unitForm.valid));
  }

  private submitForm = (): void => {
    console.log(this.unitForm);
    console.log(this.unit);
    this.unit.name = this.unitForm.get('name').value;
    this.unit.year = this.unitForm.get('year').value;
    this.unit.semester = this.unitForm.get('semester').value;
    this.unit.code = this.unitForm.get('code').value;
    this.unit.department_attributes.name = this.unitForm.get('departmentName').value;
    this.unit.department_attributes.university = this.unitForm.get('departmentUniversity').value;
    console.log("Will create unit: ");
    console.log(this.unit);

    this.unitService.create$(this.unit).subscribe( unit => {
      this.router.navigate(['/units']);
    });
  }

}
