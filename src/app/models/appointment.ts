import {Project} from './project';

export class Appointment {
  id?: string;
  job_id?: string;
  job?: Project;
  appointment_time?: string;
  status?: string;
  created_at?: string;
}
