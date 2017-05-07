import { BASE_URL } from './../../../../shared/Constants/settings';
import { ComponentBase } from './../../../../shared/Directives/componentBase';
import { CustomHttp } from './../../../../shared/Services/customHttp';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ced-logs-heatmap',
  templateUrl: './logs-heatmap.component.html',
  styleUrls: ['./logs-heatmap.component.scss']
})
export class LogsHeatmapComponent extends ComponentBase implements OnInit {

  @Input() projectId: Number;
  options;

  constructor(private chttp: CustomHttp) {
    super();
  }

  ngOnInit() {
    if (!this.projectId)
      console.log('No project_id')

    this.chttp.get(`${BASE_URL}/stats?graph=logs_heatmap&project_id=${this.projectId}`)
              .map(res => res.json())
              .subscribe(
                data => {
                    let categories = [];
                    data.logs_heatmap.forEach( (e) => categories.push(e.name));
                    console.log(data.logs_heatmap)

                    this.options = {
                    chart: {
                        type: 'heatmap',
                        zoomType: 'x'
                    },                    
                    title : { text : 'Logs Date Submitted Heatmap' },
                    xAxis: {                    
                        type: 'datetime',  
                        labels: {
                            format: '{value:%e. %b}'
                        },                                                          
                    },
                    yAxis: {
                        categories: categories,
                        title: {
                            text: 'Students'
                        }
                    }, 
                    colorAxis: {
                        min: 0,
                        minColor: '#FFFFFF'
                    },                           
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x:%e. %b}: {point.value} logs submitted.'
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 25,
                        symbolHeight: 280
                    },            
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: true
                            }
                        },
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
                    series: data.logs_heatmap                   
                    }
                },
                err => console.log(err)
                );    
  }

}