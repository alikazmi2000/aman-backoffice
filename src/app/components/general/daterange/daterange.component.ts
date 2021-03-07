import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import {toBeautifyDate, convertToISODate} from '../../../helpers/helpers';

@Component({
  selector: 'app-daterange',
  templateUrl: './daterange.component.html',
  styleUrls: ['./daterange.component.scss']
})
export class DaterangeComponent implements OnInit {

  @Output() fromDateChanged = new EventEmitter();
  @Output() toDateChanged = new EventEmitter();

  fromDate: NgbDate;
  toDate: NgbDate;
  hoveredDate: NgbDate;
  dateString = '';

  constructor(calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.fromDateChanged.emit(this.fromDate);
    this.toDateChanged.emit(this.toDate);
  }

  ngOnInit() {
    $(document).on('mouseup', function(e) {
      const container = $('.daterange-picker-wrapper');
      // if the target of the click isn't the container nor a descendant of the container
      // @ts-ignore
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      $('.daterange-picker-wrapper').hide();
      this.dateString = toBeautifyDate(convertToISODate(this.fromDate));
      this.dateString += '-' + toBeautifyDate(convertToISODate(this.toDate));
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.fromDateChanged.emit(this.fromDate);
    this.toDateChanged.emit(this.toDate);
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  togglePicker() {
    $('.daterange-picker-wrapper').toggle();
  }
}
