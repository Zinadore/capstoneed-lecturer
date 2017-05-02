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
  options;

  constructor(private chttp: CustomHttp) {
    super();

 
  }

  ngOnInit() {
    if (!this.projectId)
      console.log('No project_id')

    this.chttp.get(`${BASE_URL}/stats?graph=hours_worked&project_id=${this.projectId}`)
              .map(res => res.json())
              .subscribe(
                data => {
                  console.log(data.hours_worked_graph);
                  this.options = {
                    chart: {
                      type: 'spline',
                      zoomType: 'x'
                    },                    
                    title : { text : 'Hours Worked / Time' },
                    xAxis: {                    
                        type: 'datetime'
                        //min: data.hours_worked_graph[0][0],
                        //max: data.hours_worked_graph[data.hours_worked_graph.length - 1][0],                   
                    },
                    yAxis: {
                        title: {
                            text: 'Hours Worked'
                        }
                    },      
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x:%e. %b}: {point.y} hours worked'
                    },
                    legend: {
                        layout: 'vertical',
                        // align: 'left',
                        // x: 80,
                        // verticalAlign: 'top',
                        // y: 55,
                        // floating: true,
                    },                
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: true
                            }
                        },
                        column: {
                            pointStart:  data.hours_worked_graph[0][0]// feb 12, 2015
                        }  ,
                        series: {
                            lineWidth: 1,
                            turboThreshold: 100000,
                            marker: {
                                enabled: true,
                                radius: 3
                            },
                            shadow: true
                        }                                              
                    },                                  
                    series: data.hours_worked_graph                   
                  }
                },
                err => console.log(err)
              );    
  }

}