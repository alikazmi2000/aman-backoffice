import {Component, Input, OnInit} from '@angular/core';
import APP_SETTINGS from '../../../helpers/settings';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent implements OnInit {

  @Input() status: string;

  private statusEnum = APP_SETTINGS.status;
  private title: string;
  private type: string;

  constructor() {
  }

  ngOnInit() {
    switch (this.status) {
      case this.statusEnum.Active:
        this.title = 'Active';
        this.type = 'success';
        break;
      case this.statusEnum.Completed:
        this.title = 'Completed';
        this.type = 'success';
        break;
      case this.statusEnum.Accepted:
        this.title = 'Accepted';
        this.type = 'success';
        break;
        case this.statusEnum.TRUE:
          console.log("sasdasdasdasd");
          this.title = 'Accepted';
          this.type = 'danger';
          break;
          case this.statusEnum.FALSE:
            this.title = 'Accepted';
            this.type = 'success';
            break;
      case this.statusEnum.Pending:
        this.title = 'Pending';
        this.type = 'primary';
        break;
      case this.statusEnum.Blocked:
        this.title = 'Blocked';
        this.type = 'danger';
        break;
      case this.statusEnum.Cancelled:
        this.title = 'Cancelled';
        this.type = 'danger';
        break;
      case this.statusEnum.Rejected:
        this.title = 'Rejected';
        this.type = 'danger';
        break;
      case this.statusEnum.InProgress:
        this.title = 'In Progress';
        this.type = 'primary';
        break;
      case this.statusEnum.Escrowed:
        this.title = 'Escrowed';
        this.type = 'primary';
        break;
      case this.statusEnum.Sent:
        this.title = 'Sent';
        this.type = 'success';
        break;
      case this.statusEnum.Won:
        this.title = 'Won';
        this.type = 'success';
        break;
      case this.statusEnum.Refunded:
        this.title = 'Refunded';
        this.type = 'danger';
        break;
      default:
        this.title = this.status;
        this.type = 'dark';
        break;
    }
  }

}
