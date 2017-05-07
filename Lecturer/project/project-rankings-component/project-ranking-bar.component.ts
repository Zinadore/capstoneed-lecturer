import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'ced-project-ranking-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rank-progress">
      <div class="rank-progress-bar" #bar [style.background-color]="color"
           [ngbTooltip]="_points + ' Points'"
           placement="top"
           [style.width.%]="percentage"
           [style.animation-duration.ms]="_min + _points * 2"
           [ngStyle]="{'to': percentage}">
        <ng-content></ng-content>
        <img [src]="logo_url" class="project-logo" [style.background-color]="color">
      </div>  
    </div>
    
  `,
  styles:[
    `:host {
      display: block;
      width: 100%;
      margin-bottom: 0.5em;
    }
    .rank-progress {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .rank-progress-bar {
      width: 0;
      display: flex;
      position: relative;
      animation-name: widthOut;
      animation-timing-function: linear;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
      height: 2em;
    }
    
    .project-logo {
      border-radius: 50%;
      border: 4px solid white;
      position: absolute;
      width: 2.5em;
      height: 2.5em;
      right: -1em;
      top: calc(50% - 1.25em);
      box-shadow: 0px 1px 3px 1px black;
    }
    
    
    @keyframes widthOut {
      from { width: 0 }
    }
    `
  ],

})
export class ProjectRankingBarComponent implements OnInit {

  private _points: number = 0;
  @Input('points') set points(value) {
    this._points = value;
    this.percentage = this.calculatePercentage();
  }

  @Input('color') color: string = '#0275d8';

  @Input('logo') logo_url: string = '/img/angular.png';

  private _max: number = 0;
  @Input('max') set max(value) {
    this._max = value;
    this.percentage = this.calculatePercentage();
  }

  private _min: number = 0;
  @Input('min') set min(value) {
    this._min = value;
  }

  @Input('own-team') ownTeam: boolean = false;

  private percentage: number = 0;

  @ViewChild('bar') theBar: ElementRef;

  constructor(private render: Renderer2) {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // this.render.setStyle(this.theBar.nativeElement, 'width', `${this.percentage}%`);
  }

  private calculatePercentage(): number {
    if(this._points > this._max) return 100;

    return (100 * this._points) / this._max;
  }
}
