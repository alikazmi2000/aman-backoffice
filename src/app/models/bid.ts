import {Milestone} from './milestone';
import {User} from './user';

export class Bid {
  id?: string;
  job_id?: string;
  provider_id?: string;
  provider?: User;
  amount?: number;
  milestones?: Array<Milestone>;
  created_at?: string;
  status?: string;
}
