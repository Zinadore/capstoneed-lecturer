import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { Iteration } from '../../../../shared/Store/Models/iteration';
import { TimeHelpers } from '../../../../shared/Helpers/time.helpers';
import * as moment from 'moment';

@Component({
  selector: 'ced-iterations-bar',
  templateUrl: 'iterations-bar.component.html',
  styleUrls: ['iterations-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IterationsBarComponent implements OnInit {

  @HostBinding('style.height.px')
  @Input('height-px')
  IterationsBarComponent__Height_px: number;

  @HostBinding('style.height.em')
  @Input('height-em')
  IterationsBarComponent__Height_em: number;

  @Input('project-timespan')
  IterationsBarComponent__Project_timespan: number;

  private _iterations;
  @Input('iterations')
  set IterationsBarComponent__Iterations(value: Iteration[]) {
    // console.log(value);
    // Bail Early
    if(value.length == 0) return;

    this._iterations = [];

    // Iterate through the array
    for(let index = 0; index < value.length; index++) {
      // Grab the current and next iteration
      let cur: Iteration = value[index];
      let next: Iteration = value[index + 1];

      // Add some meta data for this iteration
      cur.timespan = TimeHelpers.getTimeSpanInDays(cur.start_date, cur.deadline);
      cur.isDeadSpace = false;
      this._iterations.push(cur);
      // If there is no next iteration, we are done. The following code will throw exceptions.
      if(!next) {
        break;
      }

      let days = TimeHelpers.getTimeSpanInDays(cur.deadline, next.start_date, 0, 0);

      // If the gap is large enough, we need to add some dead space to the bar
      // Greater that two means at least one actual day of space since the start and end date count
      // as well
      if(days > 2) {
        this.pushEmptySpace(days);
        this._iterations.push({
          name: "EMPTY",
          start_date: moment(cur.deadline).add(1, 'days').hours(0).minutes(0).seconds(0).toString(),
          deadline: moment(next.start_date).subtract(1, 'days').hours(0).minutes(0).seconds(0).toString(),
          assignment_id: 0,
          timespan: days - 2,
          isDeadSpace: true
        })
      }

    }

  }

  constructor(private cdr: ChangeDetectorRef) {
    this._iterations = [];
  }

  ngOnInit() {
    // if(!this.IterationsBarComponent__Height_em && !this.IterationsBarComponent__Height_px) {
    //   console.log('No height input');
    //   this.IterationsBarComponent__Height_px = 10;
    //   this.cdr.detectChanges();
    // }
  }

  ngAfterViewInit() {
    // this.IterationsBarComponent__Iterations = [
    //   {
    //     name: "Analysis",
    //     start_date: "2017-07-26T00:16:52.274Z",
    //     deadline: "2017-08-26T23:31:47.262Z",
    //     assignment_id: 0
    //   },
    //   {
    //     name: "Design",
    //     start_date: "2017-08-27T04:34:18.383Z",
    //     deadline: "2017-09-19T12:46:51.804Z",
    //     assignment_id: 0
    //   },
    //   {
    //     name: "Implementation",
    //     start_date: "2017-09-26T00:16:52.274Z",
    //     deadline: "2017-12-26T23:31:47.262Z",
    //     assignment_id: 0
    //   },
    //
    // ];
    //
    // this.IterationsBarComponent__Project_timespan = TimeHelpers.getTimeSpanInDays(moment("2017-07-26T00:16:52.274Z"), moment('2017-12-26T23:31:47.262Z'));
  }

  private pushEmptySpace(days: any): void {
    console.log(days)
  }

  public getBlockWidth(timespan): number {
    return (100 * timespan) / this.IterationsBarComponent__Project_timespan;
  }

  public tooltip_OnClicked(iteration: Iteration, tooltip: any): void {
    if(!tooltip.isOpen()){
      tooltip.open({$implicit: iteration, self: tooltip});
    }
    else {
      tooltip.close();
    }
  }
}
