import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import APP_SETTINGS from '../../../helpers/settings';
import {Transaction} from '../../../models/transaction';
import {TransactionService} from '../../../services/transaction.service';
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
  transactions: Array<Transaction>;
  categories: Array<Category>;
  breadcrumb: Array<Breadcrumb>;
  queryObject: {};
  filters: any;
  filtersAPI: any;
  status = [
    { title: 'Active', value: 'active' },
    { title: 'Pending', value: 'pending' },
    { title: 'Completed', value: 'completed' },
    { title: 'Cancelled', value: 'cancelled' }
  ];
  animationState = 'out';

  constructor(
    private http: HttpClient,
    private router: Router,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private confirmDialogService: ConfirmDialogService,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Transactions', active: true}
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
      title: '',
      categoryId: '',
      date: { from: NgbDate, to: NgbDate },
      status: ''
    };
    this.filtersAPI = {
      title: 'title',
      categoryId: 'category_id',
      date: 'date',
      status: 'status'
    };
  }

  private getQueryString(dtParams = false) {
    if (dtParams) {
      this.queryObject = setParams(this.queryObject, dtParams, 'transaction_id');
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
        that.transactionService.transactionsGet(query).subscribe((resp: HttpCollectionResponse) => {
          that.transactions = resp.data.docs;
          callback({
            recordsTotal: resp.data.totalDocs,
            recordsFiltered: resp.data.totalDocs,
            data: []
          });
        });
      },
      columns: [
        {data: 'createdAt', orderable: false},
        {data: 'title'},
        {orderable: false},
        {data: 'date'},
        {orderable: false},
        {data: 'budget'},
        {data: 'status'},
      ]
    };
  }

  refreshTransactions() {
    $('.dataTables_processing').show();
    const query = this.getQueryString();
    this.transactionService.transactionsGet(query).subscribe((resp: HttpCollectionResponse) => {
      $('.dataTables_processing').hide();
      this.transactions = resp.data.docs;
      this.rerender();
    });
  }

  doAction(action: string, transaction: Transaction) {
    const id = transaction.id;
    switch (action) {
      case 'edit':
        // Do Nothing
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
    this.refreshTransactions();
  }

  setDate(fieldString, value) {
    switch (fieldString) {
      case 'from':
        this.filters.date.from = value;
        break;
      case 'to':
        this.filters.date.to = value;
        break;
    }
  }

  clearFilters() {
    this.filters.date.from = NgbDate;
    this.filters.date.to = NgbDate;
  }
}
