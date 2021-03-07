import {Category} from './category';

export class Question {
  id?: string;
  category?: Category;
  category_id?: string;
  question?: string;
  question_type?: string;
  is_required?: string;
  min_value_slider?: number;
  max_value_slider?: number;
  status?: string;
}
