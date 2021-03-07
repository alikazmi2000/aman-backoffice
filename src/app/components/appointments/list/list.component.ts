import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import APP_SETTINGS from '../../../helpers/settings';
import {Appointment} from '../../../models/appointment';
import {AppointmentService} from '../../../services/appointment.service';
import {HttpCollectionResponse} from '../../../models/httpCollectionResponse';
import {setParams, setQueryObject} from '../../../helpers/helpers';
import {Breadcrumb} from '../../../models/breadcrumb';
import {SlideInOutAnimation} from '../../../helpers/animations';
import {Category} from '../../../models/category';
import {Region} from '../../../models/region';
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
  appointments: Array<Appointment>;
  categories: Array<Category>;
  regions: Array<Region>;
  breadcrumb: Array<Breadcrumb>;
  queryObject: {};
  filters: any;
  filtersAPI: any;
  animationState = 'out';

  constructor(
    private http: HttpClient,
    private router: Router,
    private appointmentService: AppointmentService
  ) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Appointments', active: true}
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

  initFilters() {
    this.queryObject = {};
    this.filters = {
      status: ''
    };
    this.filtersAPI = {
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
      dom: 'lr<".table-responsive"t>ip',
      ajax: (dtParams: any, callback) => {
        const query = this.getQueryString(dtParams);
        this.appointmentService.appointmentsGet(query).subscribe((resp: HttpCollectionResponse) => {
          this.appointments = resp.data.docs;
          callback({
            recordsTotal: resp.data.totalDocs,
            recordsFiltered: resp.data.totalDocs,
            data: []
          });
        });
      },
      columns: [
        {data: 'id', orderable: false},
        {data: 'id', orderable: false},
        {data: 'id', orderable: false},
        {data: 'id', orderable: false},
        {data: 'id', orderable: false},
        {data: 'id', orderable: false}
      ]
    };
  }
}
