import { ComponentBase } from '../../../shared/Directives/componentBase';
import { OnInit, Component, Input } from '@angular/core';
import { IAppState } from '../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { Unit } from '../../../shared/Store/Models/unit';
import { Observable } from 'rxjs';
import { UnitService } from '../../../shared/Services/unitService';

@Component({
  selector: 'ced-unit-list',
  templateUrl: 'unitList.component.html'
})
export class UnitListComponent {

  @Input() units: Unit[];

  constructor() {
  }

}
