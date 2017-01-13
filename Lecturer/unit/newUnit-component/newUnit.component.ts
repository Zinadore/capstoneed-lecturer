import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ced-new-unit',
  templateUrl: 'newUnit.component.html'
})
export class NewUnitComponent {
  private testForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.testForm = this.fb.group({
      testInput: ['']
    });
  }
}
