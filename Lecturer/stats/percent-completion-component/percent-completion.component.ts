import { BASE_URL } from './../../../../shared/Constants/settings';
import { ComponentBase } from './../../../../shared/Directives/componentBase';
import { CustomHttp } from './../../../../shared/Services/customHttp';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ced-percent-completion',
  templateUrl: './percent-completion.component.html',
  styleUrls: ['./percent-completion.component.scss']
})
export class PercentCompletionComponent extends ComponentBase implements OnInit {

  @Input() projectId: Number;
  options;

  constructor(private chttp: CustomHttp) {
    super();
  }

  ngOnInit() {
    if (!this.projectId)
      console.log('No project_id')

    this.chttp.get(`${BASE_URL}/stats?graph=percent_completion&project_id=${this.projectId}`)
              .map(res => res.json())
              .subscribe(
                data => {
                  this.options = {
                    chart: {
                      type: 'spline',
                      zoomType: 'x'
                    },                    
                    title : { text : 'Project Completion Estimation' },
                    xAxis: {                    
                      type: 'category'
                    },
                    yAxis: {
                      min: 0,
                      max: 100,
                      title: {
                          text: '% Project Completed'
                      }
                    },      
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x:%e. %b}: {point.y} % Estimated'
                    },
                    legend: {
                        layout: 'vertical',
                    },                                          
                    series: data.percent_completion_graph                   
                  }
                },
                err => console.log(err)
              );    
  }

}