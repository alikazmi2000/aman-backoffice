import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {Transaction} from '../../../models/transaction';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
import {TransactionService} from '../../../services/transaction.service';
import {ConfirmDialogService} from '../../general/confirmation-dialog/confirm-dialog.service';
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
  transaction: Transaction = new Transaction();
  breadcrumb: Array<Breadcrumb>;

  private unsubscribe: Subject<any>;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private transactionService: TransactionService
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Transactions', route: '/transactions/list', active: false},
      {title: 'Transaction Detail', active: true}
    ];
    this.actionGetTransaction();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  private actionGetTransaction() {
    this.loading = true;
    this.transactionService.transactionGet(this.id).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.transaction = res.data;
          this.errorMessage = null;
        } else {
          this.transaction = {};
          this.errorMessage = 'Unable to find the transaction.';
        }
        this.loading = false;
      },
      () => {
        this.errorMessage = 'Unable to find the transaction.';
        this.loading = false;
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
}
