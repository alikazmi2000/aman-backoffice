import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {Project} from '../../../models/project';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
import {ProjectService} from '../../../services/project.service';
import {ConfirmDialogService} from '../../general/confirmation-dialog/confirm-dialog.service';
import {Breadcrumb} from '../../../models/breadcrumb';
import {JobContract} from '../../../models/jobContract';

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
  project: Project = new Project();
  contract: JobContract = new JobContract();
  breadcrumb: Array<Breadcrumb>;

  private unsubscribe: Subject<any>;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private projectService: ProjectService,
    private confirmDialogService: ConfirmDialogService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Projects', route: '/projects/list', active: false},
      {title: 'Project Detail', active: true}
    ];
    this.actionGetProject();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  private actionGetProject() {
    this.loading = true;
    this.projectService.projectGet(this.id).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.project = res.data;
          this.actionGetContract(this.project.id);
          this.errorMessage = null;
        } else {
          this.project = {};
          this.errorMessage = 'Unable to find the project.';
        }
        this.loading = false;
      },
      () => {
        this.errorMessage = 'Unable to find the project.';
        this.loading = false;
      });
  }

  doAction(action: string, project: Project) {
    const id = project.id;
    switch (action) {
      case 'edit':
        this.router.navigate(['/projects/edit/' + id]);
        break;
      case 'activate':
        this.confirmDialogService.confirm(
          'Are you Sure?',
          'You want to activate this project?'
        ).then((confirmed) => {
          if (confirmed) {
            const data = {
              status: 'active'
            };
            this.actionUpdateStatus(id, data);
          }
        }).catch(() => { /* Catch Block is required */ });
        break;
      case 'cancel':
        this.confirmDialogService.confirm(
          'Are you Sure?',
          'You want to cancel this project?'
        ).then((confirmed) => {
          if (confirmed) {
            const data = {
              status: 'cancelled'
            };
            this.actionUpdateStatus(id, data);
          }
        }).catch(() => { /* Catch Block is required */ });
        break;
    }
  }

  private actionUpdateStatus(id, data) {
    this.projectService.projectUpdateStatus(id, data).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.successMessage = 'Project Status Changed Successfully';
        this.actionGetProject();
      } else {
        this.errorMessage = 'Unable to change the Project status';
      }
    });
  }

  private actionGetContract(id) {
    this.projectService.projectGetContract(id).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.contract = res.data;
        }
      },
      (err) => {
        this.errorMessage = err;
      });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
