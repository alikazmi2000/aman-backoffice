import {Address} from './address';

export class UserProperty {
  id?: string;
  user_id?: string;
  name?: string;
  number_of_rooms?: string;
  built_year?: string;
  house_size?: string;
  lot_size?: string;
  address?: Address;
  created_at?: string;
  status?: string;
}
