import {Category} from './category';
import {User} from './user';
import {UserProperty} from './userProperty';
import {Answer} from './answer';
import {Attachment} from './attachment';
import {Bid} from './bid';
import {JobContract} from './jobContract';
import {Appointment} from './appointment';

export class Project {
  id?: string;
  title?: string;
  deadline?: string;
  budget?: string;
  notes?: string;
  requester_id?: string;
  requester?: User;
  manager_id?: string;
  manager?: User;
  provider_id?: string;
  provider?: User;
  category_id?: string;
  category?: Category;
  user_property_id?: string;
  selected_bid_id?: string;
  selected_bid?: Bid;
  user_property?: UserProperty;
  answers?: Array<Answer>;
  attachments?: Array<Attachment>;
  bids?: Array<Bid>;
  appointment?: Appointment;
  contract?: JobContract;
  progress?: string;
  status?: string;
}
