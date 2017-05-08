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
                            // marginTop: 40,
                            // marginBottom: 80,
                            plotBorderWidth: 1,                       
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
                        //   stops: [
                        //     [0, '#3060cf'],
                        //     [0.5, '#fffbbc'],
                        //     //[0.9, '#c4463a'],
                        //     [1, '#c4463a']
                        //   ],
                          maxColor: '#4889f5',
                          startOnTick: true,
                          endOnTick: true,
                          labels: {
                            format: '{value} logs'
                          }
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
                            // spline: {
                            //     marker: {
                            //         enabled: true
                            //     }
                            // },
                            series: {
                                //lineWidth: 1,
                                //borderWidth: 1,
                                // marker: {
                                //     enabled: true,
                                //     radius: 3
                                // },
                                shadow: true,
                                //colsize: 1000,
                                colsize: 24 * 36e5
                                //rowsize: 10000000,
                            }                                              
                        },                                  
                        series: data.logs_heatmap                   
                    }
                },
                err => console.log(err)
                );    
  }

}