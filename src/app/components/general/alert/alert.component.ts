import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() type: string;
  @Input() message: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.type = '';
    this.message = '';
  }

  closeAlert() {
    this.message = '';
  }
}
