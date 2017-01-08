import { Component, Input } from '@angular/core';
import { Unit } from '../../../shared/Store/Models/unit';

@Component({
  selector: 'ced-unit-details',
  template: `{{ unit?.name }} details`
})
export class UnitDetailsComponent {
  @Input() unit: Unit;
}
