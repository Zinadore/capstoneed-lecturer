import { BASE_URL } from './../../../../shared/Constants/settings';
import { ComponentBase } from './../../../../shared/Directives/componentBase';
import { CustomHttp } from './../../../../shared/Services/customHttp';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ced-hours-worked-assignment',
  templateUrl: './hours-worked-assignment.component.html',
  styleUrls: ['./hours-worked-assignment.component.css']
})
export class HoursWorkedAssignmentComponent extends ComponentBase implements OnInit {

  @Input() assignmentId: Number;
  options;

  constructor(private chttp: CustomHttp) {
    super();
  }

  ngOnInit() {
    if (!this.assignmentId)
      console.log('No assignmentId');

    this.chttp.get(`${BASE_URL}/stats?graph=hours_worked&assignment_id=${this.assignmentId}`)
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
                layout: 'vertical'
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
            series: data.hours_worked_graph
          }
        },
        err => console.log(err)
      );
  }

}
