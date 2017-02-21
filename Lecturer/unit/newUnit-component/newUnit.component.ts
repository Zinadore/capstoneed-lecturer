import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ComponentBase } from '../../../../shared/Directives/componentBase';

@Component({
  selector: 'ced-new-unit',
  templateUrl: 'newUnit.component.html'
})
export class NewUnitComponent extends ComponentBase{
  private testForm: FormGroup;
  private _canGoNext: BehaviorSubject<Boolean>;

  public get canGoNext(): Observable<true> {
    return this._canGoNext.asObservable();
  }

  constructor(private fb: FormBuilder) {
    super();
    this._canGoNext = new BehaviorSubject(false);
  }

  ngOnInit() {
    this.testForm = this.fb.group({
      testInput: ['']
    });
    this.disposeOnDestroy(this.testForm.valueChanges.subscribe(_ => this._canGoNext.next(this.testForm.valid)));
    this.disposeOnDestroy(this.testForm.valueChanges.subscribe(_ => console.log(_)));
    this._canGoNext.next(this.testForm.valid);

  }



  public testCallback() {
    console.log("you clicked next!");
  }
}
