import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Unit } from '../../../../shared/Store/Models/unit';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { CedValidators } from '../../../../shared/Directives/ced.validators';

@Component({
    selector: 'ced-new-project',
    templateUrl: 'new-project.component.html'
})
export class NewProjectComponent extends ComponentBase implements OnInit {

  private unitSelectionForm: FormGroup;
  private units: Unit[];

  constructor(private fb: FormBuilder, private store: Store<IAppState>) {
    super();

    this.disposeOnDestroy(this.store.select((state: IAppState) => state.units).subscribe(units => {
      this.units = units;
    }))
  }

  ngOnInit() {
    this.unitSelectionForm = this.fb.group({
      unitSelect: [0, CedValidators.notSelectedValue("0")]
    });

    this.unitSelectionForm.valueChanges.subscribe(values => {
      console.log(this.unitSelectionForm.valid);
      console.log(values);
    })
  }

}
