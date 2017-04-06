import { Observable } from 'rxjs/Rx';
import { Unit } from '../../../../shared/Store/Models';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { UnitService } from '../../../../shared/Services/unit.service';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { isUndefined } from 'util';

@Component({
  selector: 'app-edit-unit.component.ts',
  templateUrl: './edit-unit.component.html',
  styleUrls: ['./edit-unit.component.scss']
})
export class EditUnitComponent extends ComponentBase {

  private unitObservable: Observable<Unit>
  private unit: Unit

  constructor(private store: Store<IAppState>,
              private route: ActivatedRoute,              
              private unitService: UnitService) { 
    
    super()

    // Get an observable from the id in the params
    let idObservable = this.route.params
      .filter( params => params['id'])
      .map( params => params['id'])

    // Get the project from the server according to the id from the
    // idObservable and put it in the store
    this.disposeOnDestroy(idObservable.subscribe( (id: number) => {
        this.unitService.getUnit(id)
      })
    )

    // Get an observable from the Project in the store
    this.unitObservable = idObservable
      .switchMap(id => this.store.select( (state: IAppState) => state.units)
        .map( (units: Unit[]) => units.find( (u: Unit) => u.id == id))
      )
  }

  ngOnInit() {
  
  }

}