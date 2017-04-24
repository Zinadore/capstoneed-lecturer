import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../shared/Directives/componentBase';

@Component({
  selector: 'ced-register-success',
  templateUrl: 'register-success.component.html',
  styleUrls: ['register-success.component.scss']
})
export class RegisterSuccessComponent extends ComponentBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }


}
