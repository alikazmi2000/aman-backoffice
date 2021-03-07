import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {Region} from '../../../models/region';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
import {RegionService} from '../../../services/region.service';
import {Breadcrumb} from '../../../models/breadcrumb';

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
  region: Region = new Region();
  breadcrumb: Array<Breadcrumb>;

  private unsubscribe: Subject<any>;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private regionService: RegionService
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Regions', route: '/regions/list', active: false},
      {title: 'Region Detail', active: true}
    ];

    this.actionGetRegion();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  private actionGetRegion() {
    this.loading = true;
    this.regionService.regionGet(this.id).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.region = res.data;
          this.errorMessage = null;
        } else {
          this.region = {};
          this.errorMessage = 'Unable to find the region.';
        }
        this.loading = false;
      },
      (err) => {
        this.errorMessage = 'Unable to find the region.';
        this.loading = false;
      });
  }

  doAction(action: string, region: Region) {
    const id = region.id;
    // TODO: set Actions
  }
}
