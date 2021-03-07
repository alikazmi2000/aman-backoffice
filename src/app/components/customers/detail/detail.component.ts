import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Breadcrumb} from '../../../models/breadcrumb';
import {CustomerService} from '../../../services/customer.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  breadcrumb: Array<Breadcrumb>;
  detail:any;
  id = null;
  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Orders', active: true}
    ];

    this.customerService.customerDetail(this.id).subscribe((resp) => {
      this.detail = resp.data;
      console.log(this.detail);

    });


  }

}
