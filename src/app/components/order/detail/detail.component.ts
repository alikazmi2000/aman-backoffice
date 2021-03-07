import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Breadcrumb} from '../../../models/breadcrumb';
import {OrderService} from '../../../services/order.service';
import APP_SETTINGS from '../../../helpers/settings';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  breadcrumb: Array<Breadcrumb>;
  detail:any;
  id = null;
  status : string;
  loading = false;
  statusItems = [
    {title: 'Pending', value: APP_SETTINGS.status.Pending},
    {title: 'Pending payment', value: APP_SETTINGS.status.PendingPayment},
    {title: 'Processing', value: APP_SETTINGS.status.Processing},
    {title: 'On hold', value: APP_SETTINGS.status.OnHold},
    {title: 'Completed', value: APP_SETTINGS.status.Completed},
    {title: 'Cancelled', value: APP_SETTINGS.status.Cancelled},
    {title: 'Refunded', value: APP_SETTINGS.status.Refunded},
    {title: 'Failed', value: APP_SETTINGS.status.Failed}
  ];
  errorMessage: string | null;
  successMessage: string | null;
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Orders', active: true}
    ];

    this.orderService.ordersDetail(this.id).subscribe((resp) => {
      this.detail = resp.data;
      console.log(this.detail);

    });


  }

  onStatusChanged(value){
    this.status = value;
    console.log(value);

  }


  submit(): void {
   
    this.loading = true;

    let data = {
      status : this.status
    }

    this.orderService.ordersStatus(this.id, data).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.errorMessage = '';
        this.successMessage = 'Order Updated Successfully';
      } else {
        this.errorMessage = 'Unable to update Order with the provided fields. Please check your fields.';
      }
      this.loading = false;
    },
    (err) => {
      this.successMessage = '';
      this.errorMessage = err ? err : 'Unable to update Order with the provided fields.';
      this.loading = false;
    });
    
  }




}
