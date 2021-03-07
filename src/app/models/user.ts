import {Address} from './address';
import {UserProperty} from './userProperty';
import {UserCard} from './userCard';
import {UserBankAccount} from './userBankAccount';
import {Region} from './region';
import {Category} from './category';
import {UserDocument} from './userDocument';

export class User {
  id?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  phone_obj?: {
    country_code?: string;
    phone_number?: string;
  };
  email?: string;
  role?: string;
  profile_picture?: string;
  address?: Address;
  status?: string;
  properties?: Array<UserProperty>;
  documents?: Array<UserDocument>;
  categories?: Array<Category>;
  cards?: Array<UserCard>;
  accounts?: Array<UserBankAccount>;
  service_areas?: Array<Region>;
  company_name?: string;
  created_at?: string;
  rating?: number;
  no_of_rating?: string;
}
