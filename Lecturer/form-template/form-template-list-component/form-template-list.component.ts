import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComponentBase } from '../../../../shared/Directives/componentBase';
import { FormTemplate } from '../../../../shared/Store/Models/form-template';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../shared/Store/Reducers/index';
import { FormTemplateService } from '../../../../shared/Services/form-template.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'ced-form-template-list',
  templateUrl: 'form-template-list.component.html',
  styleUrls: ['form-template-list.component.scss']
})
export class FormTemplateListComponent extends ComponentBase implements OnInit {

  public formTemplates: FormTemplate[];
  public selectedFormTemplate: FormTemplate;
  public filteredFormTemplates: FormTemplate[];
  private textInputObservable: Observable<any>;
  @ViewChild('search_input') searchTextBox: ElementRef;

  constructor(store: Store<IAppState>, templateService: FormTemplateService, private router: Router) {
    super();

    this.selectedFormTemplate = {
      id: 0,
      questions: [],
      name: ''
    };

    templateService.getAll();

    this.disposeOnDestroy(store.select((state: IAppState) => state.form_templates).subscribe(value => {
      this.formTemplates  = value;
      this.filteredFormTemplates = [...value];
    }));


  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.textInputObservable = Observable.fromEvent(this.searchTextBox.nativeElement, 'keyup');
    this.disposeOnDestroy(this.textInputObservable
      .map(event => event.target.value)
      .map(term => term.toLowerCase())
      .debounceTime(350)
      .subscribe(searchTerm => {
          this.filteredFormTemplates = searchTerm ? this.formTemplates.filter(t => t.name.toLowerCase().indexOf(searchTerm) != -1) : this.formTemplates;
      })
    )
  }

  public selectTemplate(index: number): void {
    console.log(`Selecting: ${index}`);
    this.selectedFormTemplate = this.formTemplates[index];
  }

  public editTemplate(template_id: number, event): void {
    event.stopPropagation();
    this.router.navigate(['/form-templates', template_id, 'edit']);
  }

  debug() {
    console.log(this.filteredFormTemplates);
    console.log(this.formTemplates);
  }

}
