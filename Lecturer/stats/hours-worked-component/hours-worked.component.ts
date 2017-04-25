import { BASE_URL } from './../../../../shared/Constants/settings';
import { ComponentBase } from './../../../../shared/Directives/componentBase';
import { CustomHttp } from './../../../../shared/Services/customHttp';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ced-hours-worked',
  templateUrl: './hours-worked.component.html',
  styleUrls: ['./hours-worked.component.css']
})
export class HoursWorkedComponent extends ComponentBase implements OnInit {

  @Input() projectId: Number;

  constructor(private chttp: CustomHttp) {
    super();
  }

  ngOnInit() {
    if (!this.projectId)
      console.log('No project_id')

    this.chttp.get(`${BASE_URL}/stats?graph=hours_worked&project_id=${this.projectId}`)
              .map(res => res.json())
              .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('Random Quote Complete')
              );    
  }

}