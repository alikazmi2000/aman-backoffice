import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import APP_SETTINGS from '../../../helpers/settings';
import STATUS from '../../../helpers/status';
import {Project} from '../../../models/project';
import {ProjectService} from '../../../services/project.service';
import {HttpCollectionResponse} from '../../../models/httpCollectionResponse';
import {ConfirmDialogService} from '../../general/confirmation-dialog/confirm-dialog.service';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse, parseAddress, setParams, setQueryObject} from '../../../helpers/helpers';
import {Breadcrumb} from '../../../models/breadcrumb';
import {Address} from '../../../models/address';
import {SlideInOutAnimation} from '../../../helpers/animations';
import * as $ from 'jquery';
import {Category} from '../../../models/category';
import {CategoryService} from '../../../services/category.service';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Region} from '../../../models/region';
import {RegionService} from '../../../services/region.service';
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
  dtTrigger: Subject<any> = new Subject();
  projects: Array<Project>;
  categories: Array<Category>;
  regions: Array<Region>;
  breadcrumb: Array<Breadcrumb>;
  queryObject: {};
  filters: any;
  filtersAPI: any;
  status = STATUS.project;
  animationState = 'out';

  constructor(
    private http: HttpClient,
    private router: Router,
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private regionService: RegionService,
    private confirmDialogService: ConfirmDialogService,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Projects', active: true}
    ];
    this.initFilters();
    this.initDataTable();
    this.actionGetCategories();
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

  initFilters() {
    this.queryObject = {};
    this.filters = {
      title: '',
      categoryId: '',
      regionId: '',
      deadline: { from: NgbDate, to: NgbDate },
      status: ''
    };
    this.filtersAPI = {
      title: 'title',
      categoryId: 'category_id',
      regionId: 'region_id',
      deadline: 'deadline',
      status: 'status'
    };
  }

  private getQueryString(dtParams = false) {
    if (dtParams) {
      this.queryObject = setParams(this.queryObject, dtParams, 'title');
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
            columns: [1, 2, 3, 4, 5, 6]
          }
        },
        {
          extend: 'csv',
          text: 'Export to CSV',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6]
          }
        }
      ],
      dom: 'lBfr<".table-responsive"t>ip',
      ajax: (dtParams: any, callback) => {
        const query = this.getQueryString(dtParams);
        this.projectService.projectsGet(query).subscribe((resp: HttpCollectionResponse) => {
          this.projects = resp.data.docs;
          callback({
            recordsTotal: resp.data.totalDocs,
            recordsFiltered: resp.data.totalDocs,
            data: resp.data.docs
          });
        });
      },
      columns: [
        {data: 'id', orderable: false},
        {data: 'title'},
        {data: 'user_property_id', orderable: false},
        {data: 'deadline'},
        {data: 'category_id', orderable: false},
        {data: 'budget'},
        {data: 'status'},
        {data: 'id', orderable: false}
      ]
    };
  }

  refreshProjects() {
    $('.dataTables_processing').show();
    const query = this.getQueryString();
    this.projectService.projectsGet(query).subscribe((resp: HttpCollectionResponse) => {
      $('.dataTables_processing').hide();
      this.projects = resp.data.docs;
      this.rerender();
    });
  }

  doAction(action: string, project: Project) {
    const id = project.id;
    switch (action) {
      case 'edit':
        this.router.navigate(['/projects/edit/' + id]);
        break;
      case 'delete':
        this.confirmDialogService.confirm(
          'Are you Sure?',
          'You want to delete this project?'
        ).then((confirmed) => {
          if (confirmed) {
            this.projectService.projectDelete(id).subscribe((res: HttpBasicResponse) => {
              if (isSuccessResponse(res)) {
                this.successMessage = res.meta.message ? res.meta.message : 'Project Deleted Successfully';
                this.refreshProjects();
              } else {
                this.errorMessage = res.meta.message ? res.meta.message : 'Unable to Delete the Project';
              }
            });
          }
        }).catch(() => { /* Catch Block is required */
        });
        break;
    }
  }

  parseAddress(address: Address) {
    return parseAddress(address, true);
  }

  toggleAdvanceSearch() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  customFilter() {
    // Update Listing Data
    this.refreshProjects();
  }

  private actionGetCategories() {
    this.categoryService.categoriesGetAll('').subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.categories = res.data;
        }
      },
      (err) => {
        // TODO: should handle error
      });
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

  setDate(fieldString, value) {
    switch (fieldString) {
      case 'from':
        this.filters.deadline.from = value;
        break;
      case 'to':
        this.filters.deadline.to = value;
        break;
    }
  }

  clearFilters() {
    this.filters.deadline.from = '';
    this.filters.deadline.to = '';
  }
}
