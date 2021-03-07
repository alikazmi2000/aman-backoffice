import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../models/user';
import {parseAddress} from '../../../helpers/helpers';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input() user: User = new User();
  @Input() full = false;
  @Input() message: string;
  @Input() image = true;

  constructor() { }

  ngOnInit() {
  }

  parseAddress(address: any) {
    return parseAddress(address);
  }
}
