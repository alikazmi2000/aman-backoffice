import {Document} from './document';

export class UserDocument {
  id?: string;
  user_id: string;
  document_id?: string;
  file_name?: string;
  file_name_base?: string;
  expiry?: string;
  document?: Document;
  status?: string;
}
