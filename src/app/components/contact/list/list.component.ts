import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import APP_SETTINGS from '../../../helpers/settings';
import {ContactService} from '../../../services/contact.service';
import {HttpCollectionResponse} from '../../../models/httpCollectionResponse';
import {ConfirmDialogService} from '../../general/confirmation-dialog/confirm-dialog.service';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse, setParams, setQueryObject} from '../../../helpers/helpers';
import {Breadcrumb} from '../../../models/breadcrumb';
import {SlideInOutAnimation} from '../../../helpers/animations';
import * as $ from 'jquery';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [SlideInOutAnimation]
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

  successMessage: string;
  errorMessage: string;

  // @ts-ignore
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<string> = new Subject();
  contacts: any;
  breadcrumb: Array<Breadcrumb>;
  queryObject: {};
  filters: any;
  filtersAPI: any;
  status = [
    { title: 'Active', value: 'active' },
    { title: 'In Active', value: 'inactive' },
  ];
  animationState = 'out';

  constructor(
    private http: HttpClient,
    private router: Router,
    private contactService: ContactService,
    private confirmDialogService: ConfirmDialogService,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Contact', active: true}
    ];
    this.initFilters();
    this.initDataTable();
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

  initFilters() {
    this.queryObject = {};
    this.filters = {
      name: '',
      status: ''
    };
    this.filtersAPI = {
      title: 'name',
      status: 'status'
    };
  }

  private getQueryString(dtParams = false) {
    if (dtParams) {
      this.queryObject = setParams(this.queryObject, dtParams, 'name');
    }

    this.queryObject = setQueryObject(this.queryObject, this.filters, this.filtersAPI);
    return Object.keys(this.queryObject).map(key => key + '=' + this.queryObject[key]).join('&');
  }

  initDataTable() {
    const that = this;
    this.dtOptions = {
      ...APP_SETTINGS.dataTableOptions,
      ajax: (dtParams: any, callback) => {
        const query = this.getQueryString(dtParams);
        that.contactService.contactsGet(query).subscribe((resp: HttpCollectionResponse) => {
          that.contacts = resp.data.docs;
          callback({
            recordsTotal: resp.data.totalDocs,
            recordsFiltered: resp.data.totalDocs,
            data: []
          });
        });
      },
      columns: [
        {data: 'id', orderable: false},
        {data: 'name'},
      ]
    };
  }

  refreshCategories() {
    $('.dataTables_processing').show();
    const query = this.getQueryString();
    this.contactService.contactsGet(query).subscribe((resp: HttpCollectionResponse) => {
      $('.dataTables_processing').hide();
      this.contacts = resp.data.docs;
      this.rerender();
    });
  }

  doAction(action: string, order: any) {
    const id = order._id;
    switch (action) {
      case 'view':
        this.router.navigate(['/contact/detail/' + id]);
        break;
      case 'edit':
        this.router.navigate(['/contact/edit/' + id]);
        break;
      // case 'delete':
      //   this.confirmDialogService.confirm(
      //     'Are you Sure?',
      //     'You want to delete this category?'
      //   ).then((confirmed) => {
      //     if (confirmed) {
      //       this.productService.categoryDelete(id).subscribe((res: HttpBasicResponse) => {
      //         if (isSuccessResponse(res)) {
      //           this.successMessage = res.meta.message ? res.meta.message : 'Category Deleted Successfully';
      //           this.refreshCategories();
      //         } else {
      //           this.errorMessage = res.meta.message ? res.meta.message : 'Unable to Delete the Category';
      //         }
      //       });
      //     }
      //   }).catch(() => { /* Catch Block is required */ });
      //   break;
    }
  }

  toggleAdvanceSearch() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  customFilter() {
    // Update Listing Data
    this.refreshCategories();
  }
}
