import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Breadcrumb} from '../../../models/breadcrumb';
import {ContactService} from '../../../services/contact.service';

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
    private contactService: ContactService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Contacts List', route: '/contact', active: true}
    ];

    this.contactService.contactsDetail(this.id).subscribe((resp) => {
      this.detail = resp.data;
      console.log(this.detail);

    });


  }

}
