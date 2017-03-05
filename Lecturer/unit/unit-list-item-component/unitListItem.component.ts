import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Unit } from '../../../../shared/Store/Models/unit';

@Component({
  selector: 'ced-unit-list-item',
  templateUrl: 'unitListItem.component.html',
  styleUrls: ['./unitListItem.component.scss'],
  host: {
    'class': 'row row-component'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitListItemComponent {
  @Input() unit: Unit;

  constructor()  {

  }
}
