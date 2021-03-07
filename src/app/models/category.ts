import {JobType} from './jobType';

export class Category {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  hourly_rate?: number;
  admin_commission_percentage?: number;
  job_type_id?: string;
  job_type?: JobType;
  status?: string;
}
