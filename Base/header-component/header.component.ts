import { Component, OnInit, Output, EventEmitter, HostBinding, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ced-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private _sidebarBreakpoint: number;
  private _gotPastBreakpoint: boolean;
  private _sub: Subscription;
  @Output('brandClick') _brandClicked: EventEmitter<boolean>;
  @HostBinding('class.toggled') _isBrandClicked: boolean;

  constructor() {
    this._sidebarBreakpoint = 768;
    this._brandClicked = new EventEmitter<boolean>();
    this._isBrandClicked = false;
    this._gotPastBreakpoint= false;
  }

  ngOnInit() {
    // this._sub = Observable.fromEvent(window, 'resize')
    //   .map(event => (event.target.innerWidth - this._sidebarBreakpoint))
    //   .filter(diff => (diff == 1) || (diff == -1))
    //   .do(diff => console.log(diff))
    //   .subscribe(diff => {
    //     if (diff > 0 && !this._gotPastBreakpoint) {
    //       console.log('should open due to breakpoint');
    //       this._gotPastBreakpoint = true;
    //     } else if (diff < 0 && !this._gotPastBreakpoint) {
    //       console.log('should close due to breakpoint');
    //       this._gotPastBreakpoint = true;
    //     }
    //   });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  private onBrandClick():void {
    this._isBrandClicked = !this._isBrandClicked;
    this._brandClicked.emit(this._isBrandClicked);
    this._gotPastBreakpoint = false;
  }

  private onWindowResize(event) {
    // let w = event.target.innetWidth;
    // let diff = w - this._sidebarBreakpoint;
    // if (diff > 0 && diff < 50 && this._isBrandClicked && !this._gotPastBreakpoint) {
    //   this._isBrandClicked = false;
    //   this._brandClicked.emit(this._isBrandClicked);
    //   if(!this._gotPastBreakpoint) {
    //     this._gotPastBreakpoint = true;
    //   }
    // } else if (diff < 0 && diff > -50 && !this._isBrandClicked  && !this._gotPastBreakpoint) {
    //   this._isBrandClicked = true;
    //   this._brandClicked.emit(this._isBrandClicked);
    //   if(!this._gotPastBreakpoint) {
    //     this._gotPastBreakpoint = true;
    //   }
    // }
  }
}
