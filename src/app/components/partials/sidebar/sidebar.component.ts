import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/user';
import {Subject} from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: User = new User();
  private unsubscribe: Subject<any>;

  constructor(private authService: AuthService) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.authService.validateToken().subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.user = res.data;
      }
    });

    this.setSubNavsUsingJQuery();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private setSubNavsUsingJQuery() {
    $('.sidebar-dropdown > a').on('click', function() {
      $('.sidebar-submenu').slideUp(200);
      if ($(this).parent().hasClass('active')) {
        $('.sidebar-dropdown').removeClass('active');
        $(this).parent().removeClass('active');
      } else {
        $('.sidebar-dropdown').removeClass('active');
        $(this).next('.sidebar-submenu').slideDown(200);
        $(this).parent().addClass('active');
      }
    });
  }
}
