import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss']
})
export class DatetimeComponent implements OnInit {

  @Input() date: string;
  @Input() includeTime: boolean;

  constructor() { }

  ngOnInit() {
  }

  toBeautifyDate() {
    if (this.date) {
      const isValidDate = moment(this.date).isValid();
      if (isValidDate) {
        const format = this.includeTime ? 'MMM DD, YYYY hh:mm a' : 'MMM DD, YYYY';
        return moment(this.date).format(format);
      }
      return this.date;
    }
    return 'NA';
  }
}
