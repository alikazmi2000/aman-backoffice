import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {DataTableDirective} from 'angular-datatables';
import APP_SETTINGS from '../../../helpers/settings';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {HttpCollectionResponse} from '../../../models/httpCollectionResponse';
import {ConfirmDialogService} from '../../general/confirmation-dialog/confirm-dialog.service';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse, setQueryObject, setParams} from '../../../helpers/helpers';
import {Breadcrumb} from '../../../models/breadcrumb';
import {SlideInOutAnimation} from '../../../helpers/animations';
import * as $ from 'jquery';
import 'rxjs-compat/add/operator/filter';
import {Subject} from 'rxjs';
import {Region} from '../../../models/region';
import {RegionService} from '../../../services/region.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [SlideInOutAnimation]
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ts-ignore
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<string> = new Subject();

  successMessage: string;
  errorMessage: string;
  users: User[];
  regions: Array<Region>;
  breadcrumb: Array<Breadcrumb>;
  queryObject: {};
  filters: any;
  filtersAPI: any;
  roles = APP_SETTINGS.rolesData;
  countryCodes = APP_SETTINGS.countryCodes;
  status = [
    {title: 'Active', value: APP_SETTINGS.status.Active},
    {title: 'Blocked', value: APP_SETTINGS.status.Blocked},
    {title: 'Inactive', value: APP_SETTINGS.status.InActive},
    {title: 'Pending', value: APP_SETTINGS.status.Pending}
  ];
  animationState = 'out';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private regionService: RegionService,
    private confirmDialogService: ConfirmDialogService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Users', active: true}
    ];
    this.initFilters();
    this.setFiltersFromQueryString();
    this.initDataTable();
    this.actionGetRegions();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  private initFilters() {
    this.queryObject = {};
    this.filters = {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '',
      phoneNumber: '',
      regionId: '',
      role: '',
      status: '',
    };
    this.filtersAPI = {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      countryCode: 'country_code',
      phoneNumber: 'phone_number',
      regionId: 'region_id',
      role: 'role',
      status: 'status'
    };
  }

  private setFiltersFromQueryString() {
    this.route.queryParams.subscribe(params => {
      if (typeof params.role !== 'undefined') {
        this.filters.role = params.role;
      } else {
        this.filters.role = '';
      }
      this.refreshUsers();
    });
  }

  private getQueryString(dtParams = false) {
    if (dtParams) {
      this.queryObject = setParams(this.queryObject, dtParams, 'first_name,last_name,email');
    }
    this.queryObject = setQueryObject(this.queryObject, this.filters, this.filtersAPI);
    return Object.keys(this.queryObject).map(key => key + '=' + this.queryObject[key]).join('&');
  }

  initDataTable() {
    this.dtOptions = {
      ...APP_SETTINGS.dataTableOptions,
      // @ts-ignore
      buttons: [
        {
          extend: 'excel',
          text: 'Export to Excel',
          exportOptions: {
            columns: [1, 2, 3, 4, 5]
          }
        },
        {
          extend: 'csv',
          text: 'Export to CSV',
          exportOptions: {
            columns: [1, 2, 3, 4, 5]
          }
        }
      ],
      dom: 'lBfr<".table-responsive"t>ip',
      ajax: (dtParams: any, callback) => {
        const query = this.getQueryString(dtParams);
        this.userService.usersGet(query).subscribe((resp: HttpCollectionResponse) => {
          this.users = resp.data.docs;
          callback({
            recordsTotal: resp.data.totalDocs,
            recordsFiltered: resp.data.totalDocs,
            data: resp.data.docs
          });
        });
      },
      columns: [
        {data: 'id'},
        {data: 'first_name'},
        {data: 'email'},
        {data: 'phone_number'},
        {data: 'role'},
        {data: 'status'},
        {data: 'id', orderable: false}
      ]
    };
  }

  refreshUsers() {
    $('.dataTables_processing').show();
    const query = this.getQueryString();
    this.userService.usersGet(query).subscribe((resp: HttpCollectionResponse) => {
      this.users = resp.data.docs;
      $('.dataTables_processing').hide();
      this.rerender();
    });
  }

  doAction(action: string, user: User) {
    const id = user.id;
    switch (action) {
      case 'view':
        this.router.navigate(['/users/detail/' + id]);
        break;
      case 'edit':
        this.router.navigate(['/users/edit/' + id]);
        break;
      case 'delete':
        this.confirmDialogService.confirm(
          'Are you Sure?',
          'You want to delete this user?'
        ).then((confirmed) => {
          if (confirmed) {
            this.userService.userDelete(id).subscribe((res: HttpBasicResponse) => {
              if (isSuccessResponse(res)) {
                this.successMessage = res.meta.message ? res.meta.message : 'User Deleted Successfully';
                this.refreshUsers();
              } else {
                this.errorMessage = res.meta.message ? res.meta.message : 'Unable to Delete the User';
              }
            });
          }
        }).catch(() => { /* Catch Block is required */
        });
        break;
    }
  }

  toggleAdvanceSearch() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  customFilter() {
    // Update Listing Data
    this.refreshUsers();
  }

  private actionGetRegions() {
    this.regionService.regionsGetAll().subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.regions = res.data;
        }
      },
      (err) => {
        // TODO: should handle error
      });
  }
}
