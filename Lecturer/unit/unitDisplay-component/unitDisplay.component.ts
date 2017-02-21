import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Unit } from '../../../../shared/Store/Models/unit';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormWizardStepComponent } from '../../../../shared/Directives/formWizardStep - component/formWizardStep.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'ced-unit-display',
  templateUrl: 'unitDisplay.component.html'
})
export class UnitDisplayComponent extends ComponentBase implements OnInit {
  private numberOfUnits: number;

  private testForm: FormGroup;

  constructor(store: Store<IAppState>, private fb: FormBuilder, private step: FormWizardStepComponent) {
    super();

    this.disposeOnDestroy(
      store.select('units')
        .map((units: Unit[]) => {
          if (units)
            return units.length;
          return 0;
        })
        .subscribe((value: number) => this.numberOfUnits = value)
    )
  }

  ngOnInit() {
    this.testForm = this.fb.group({
      testInput: ['']
    })

  }

  ngAfterContentInit() {
    this.step.registerCanGoNext(Observable.of(true));

    this.step.registerOnFinish(() => console.log('Yiihaaa'));
  }


}
