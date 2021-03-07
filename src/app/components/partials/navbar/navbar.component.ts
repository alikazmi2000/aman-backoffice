import {Component, OnDestroy, OnInit} from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {User} from '../../../models/user';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
import {AuthService} from '../../../services/auth.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit, OnDestroy {
  public sidebarOpened = false;
  user: User = new User();
  private unsubscribe: Subject<any>;

  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    } else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }
  constructor(config: NgbDropdownConfig, private router: Router, private authService: AuthService) {
    config.placement = 'bottom-right';
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.authService.validateToken().subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.user = res.data;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
