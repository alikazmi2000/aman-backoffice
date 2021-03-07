import {Project} from './project';
import {Bid} from './bid';
import {User} from './user';

export class Transaction {
  id?: string;
  transaction_id?: string;
  job_d?: string;
  job?: Project;
  bid_id?: string;
  bid?: Bid;
  bid_milestone_id?: string;
  payer_id?: string;
  payer?: User;
  payee_id?: string;
  payee?: User;
  amount?: string;
  amount_for_provider?: string;
  admin_commission_amount?: string;
  comments?: string;
  created_at?: string;
  status?: string;
}
