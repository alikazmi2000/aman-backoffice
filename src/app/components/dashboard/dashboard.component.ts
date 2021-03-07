import {Component, OnInit} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {HttpBasicResponse} from '../../models/httpBasicResponse';
import {isSuccessResponse} from '../../helpers/helpers';
import {OtherService} from '../../services/other.service';
import {DashboardCount} from '../../models/dashboardCount';
import {ProjectService} from '../../services/project.service';
import {UserService} from '../../services/user.service';
import {HttpCollectionResponse} from '../../models/httpCollectionResponse';
import {Project} from '../../models/project';
import {User} from '../../models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['../../app.component.scss', './dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  private counts: DashboardCount;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [], label: 'Customers', backgroundColor: '#95d2f2'},
    {data: [], label: 'Providers', backgroundColor: '#95d2e6'},
    {data: [], label: 'Projects', backgroundColor: '#e1f1fb'}
  ];
  public previousMonthStart: any;
  public previousMonthEnd: any;
  public customersPreviousMonthDif: any;
  public providersPreviousMonthDif: any;
  public jobsPreviousMonthDif: any;
  public projects: Array<Project>;
  public pendingRequests: Array<User>;

  constructor(
    public otherService: OtherService,
    public projectService: ProjectService,
    public userService: UserService
  ) {
  }

  ngOnInit() {
    //this.actionGetCounts();
    //this.actionGetProjects();
    //this.actionGetPendingRequests();
  }

  private actionGetCounts() {
    this.otherService.dashboard({}).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.counts = res.data.counts;
          this.setBarGraph();
        }
      },
      (err) => {
        // TODO: should handle error
      });
  }

  private actionGetProjects() {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDay());
    const params = `search[status]=active&search[deadline][from]=${today.toISOString()}\
    &search[deadline][to]=${nextMonth.toISOString()}&order=1`;
    this.projectService.projectsGet(params).subscribe((res: HttpCollectionResponse) => {
        if (isSuccessResponse(res)) {
          this.projects = res.data.docs;
        }
      },
      (err) => {
        // TODO: should handle error
      });
  }

  private actionGetPendingRequests() {
    this.userService.usersGet('search[status]=pending&search[role]=provider').subscribe((res: HttpCollectionResponse) => {
        if (isSuccessResponse(res)) {
          this.pendingRequests = res.data.docs;
        }
      },
      (err) => {
        // TODO: should handle error
      });
  }

  private setBarGraph() {
    const customers = [];
    const providers = [];
    const jobs = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    if (this.counts.customersByMonth && this.counts.jobsByMonth) {
      let item: any = {};

      for (item of this.counts.customersByMonth) {
        for (let i = 0; i < 12; i++) {
          if ((i + 1) === item._id.month) {
            customers[i] = item.count;
          } else {
            customers[i] = customers[i] ? customers[i] : 0;
          }
        }
      }

      for (item of this.counts.providersByMonth) {
        for (let i = 1; i <= 12; i++) {
          if ((i + 1) === item._id.month) {
            providers[i] = item.count;
          } else {
            providers[i] = providers[i] ? providers[i] : 0;
          }
        }
      }

      for (item of this.counts.jobsByMonth) {
        for (let i = 1; i <= 12; i++) {
          if ((i + 1) === item._id.month) {
            jobs[i] = item.count;
          } else {
            jobs[i] = jobs[i] ? jobs[i] : 0;
          }
        }
      }
    }

    this.barChartData[0].data = customers;
    this.barChartData[1].data = providers;
    this.barChartData[2].data = jobs;
    let previousMonthCount = month - 1;
    previousMonthCount = previousMonthCount === -1 ? 11 : previousMonthCount;
    previousMonthCount = previousMonthCount === 12 ? 0 : previousMonthCount;
    this.previousMonthStart = this.barChartLabels[previousMonthCount];
    this.previousMonthEnd = this.barChartLabels[month];
    let diff;

    const lastMonthCustomers = this.barChartData[0].data[month];
    const veryLastMonthCustomers = this.barChartData[0].data[previousMonthCount];
    if (lastMonthCustomers && veryLastMonthCustomers) {
      diff = lastMonthCustomers - veryLastMonthCustomers;
      if (diff < 0) {
        this.customersPreviousMonthDif = diff / veryLastMonthCustomers * 100;
      } else {
        this.customersPreviousMonthDif = diff / lastMonthCustomers * 100;
      }
      this.customersPreviousMonthDif = this.customersPreviousMonthDif.toFixed(2);
    } else {
      this.customersPreviousMonthDif = 0;
    }

    const lastMonthProviders = this.barChartData[1].data[month];
    const veryLastMonthProviders = this.barChartData[1].data[previousMonthCount];
    if (lastMonthProviders && veryLastMonthProviders) {
      diff = lastMonthProviders - veryLastMonthProviders;
      if (diff < 0) {
        this.providersPreviousMonthDif = diff / veryLastMonthProviders * 100;
      } else {
        this.providersPreviousMonthDif = diff / lastMonthProviders * 100;
      }
      this.providersPreviousMonthDif = this.providersPreviousMonthDif.toFixed(2);
    } else {
      this.providersPreviousMonthDif = 0;
    }

    const lastMonthJobs = this.barChartData[2].data[month];
    const veryLastMonthJobs = this.barChartData[2].data[previousMonthCount];
    if (lastMonthJobs && veryLastMonthJobs) {
      diff = lastMonthJobs - veryLastMonthJobs;
      if (diff < 0) {
        this.jobsPreviousMonthDif = diff / veryLastMonthJobs * 100;
      } else {
        this.jobsPreviousMonthDif = diff / lastMonthJobs * 100;
      }
      this.jobsPreviousMonthDif = this.jobsPreviousMonthDif.toFixed(2);
    } else {
      this.jobsPreviousMonthDif = 0;
    }
  }
}
