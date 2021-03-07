import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import APP_SETTINGS from '../../../helpers/settings';
import {Region} from '../../../models/region';
import {RegionService} from '../../../services/region.service';
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
  regions: Region[];
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
    private regionService: RegionService,
    private confirmDialogService: ConfirmDialogService,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Regions', active: true}
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
      zipCode: '',
      status: ''
    };
    this.filtersAPI = {
      name: 'name',
      zipCode: 'zip_code',
      status: 'status'
    };
  }

  private getQueryString(dtParams = false) {
    if (dtParams) {
      this.queryObject = setParams(this.queryObject, dtParams, 'name,zip_code');
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
        that.regionService.regionsGet(query).subscribe((resp: HttpCollectionResponse) => {
          that.regions = resp.data.docs;
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
        {data: 'zip_code'}
      ]
    };
  }

  refreshRegions() {
    $('.dataTables_processing').show();
    const query = this.getQueryString();
    this.regionService.regionsGet(query).subscribe((resp: HttpCollectionResponse) => {
      $('.dataTables_processing').hide();
      this.regions = resp.data.docs;
      this.rerender();
    });
  }

  doAction(action: string, region: Region) {
    const id = region.id;
    switch (action) {
      case 'view':
        this.router.navigate(['/regions/detail/' + id]);
        break;
      case 'edit':
        this.router.navigate(['/regions/edit/' + id]);
        break;
      case 'delete':
        this.confirmDialogService.confirm(
          'Are you Sure?',
          'You want to delete this region?'
        ).then((confirmed) => {
          if (confirmed) {
            this.regionService.regionDelete(id).subscribe((res: HttpBasicResponse) => {
              if (isSuccessResponse(res)) {
                this.successMessage = res.meta.message ? res.meta.message : 'Region Deleted Successfully';
                this.refreshRegions();
              } else {
                this.errorMessage = res.meta.message ? res.meta.message : 'Unable to Delete the Region';
              }
            });
          }
        }).catch(() => { /* Catch Block is required */ });
        break;
    }
  }

  toggleAdvanceSearch() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  customFilter() {
    // Update Listing Data
    this.refreshRegions();
  }
}
