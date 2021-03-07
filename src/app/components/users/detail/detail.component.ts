import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {User} from '../../../models/user';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
import {UserService} from '../../../services/user.service';
import {ConfirmDialogService} from '../../general/confirmation-dialog/confirm-dialog.service';
import {Breadcrumb} from '../../../models/breadcrumb';
import {HttpCollectionResponse} from '../../../models/httpCollectionResponse';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../models/project';
import {Address} from '../../../models/address';
import {parseAddress} from '../../../helpers/helpers';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  id: string;
  loading = false;
  successMessage: string | null;
  errorMessage: string | null;
  user: User = new User();
  projects: Array<Project>;
  breadcrumb: Array<Breadcrumb>;

  private unsubscribe: Subject<any>;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private projectService: ProjectService,
    private confirmDialogService: ConfirmDialogService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Users', route: '/users/list', active: false},
      {title: 'User Detail', active: true}
    ];
    this.actionGetUser();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  private actionGetUser() {
    this.loading = true;
    this.userService.userGet(this.id).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.user = res.data;
          this.listProjects();
          this.errorMessage = null;
        } else {
          this.user = {};
          this.errorMessage = 'Unable to find the user.';
        }
        this.loading = false;
      },
      () => {
        this.errorMessage = 'Unable to find the user.';
        this.loading = false;
      });
  }

  doAction(action: string, user: User) {
    const id = user.id;
    switch (action) {
      case 'edit':
        this.router.navigate(['/users/edit/' + id]);
        break;
      case 'block':
        this.confirmDialogService.confirm(
          'Are you Sure?',
          'You want to block this user?'
        ).then((confirmed) => {
          if (confirmed) {
            const data = {
              id: id,
              status: 'blocked',
              role: user.role
            };
            this.actionUpdateStatus(data);
          }
        }).catch(() => { /* Catch Block is required */ });
        break;
      case 'activate':
        this.confirmDialogService.confirm(
          'Are you Sure?',
          'You want to activate this user?'
        ).then((confirmed) => {
          if (confirmed) {
            const data = {
              id: id,
              status: 'active',
              role: user.role
            };
            this.actionUpdateStatus(data);
          }
        }).catch(() => { /* Catch Block is required */ });
        break;
    }
  }

  actionUpdateStatus(data) {
    this.userService.userUpdateStatus(data).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.successMessage = 'User Status Changed Successfully';
        this.actionGetUser();
      } else {
        this.errorMessage = 'Unable to change the User status';
      }
    });
  }

  listProjects() {
    let params = `limit=500&`;
    switch (this.user.role) {
      case 'customer':
        params += `search[requester_id]=${this.user.id}`;
        break;
      case 'tech':
        params += `search[manager_id]=${this.user.id}`;
        break;
      case 'provider':
        params += `search[provider_id]=${this.user.id}`;
        break;
    }
    this.projectService.projectsGet(params).subscribe((resp: HttpCollectionResponse) => {
      this.projects = resp.data.docs;
    });
  }

  parseAddress(address: Address) {
    return parseAddress(address);
  }
}
