import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
import {CategoryService} from '../../../services/category.service';
import {Category} from '../../../models/category';
import {Breadcrumb} from '../../../models/breadcrumb';
import APP_SETTINGS from '../../../helpers/settings';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading = false;
  errorMessage: string | null;
  successMessage: string | null;
  id = null;
  edit = false;
  category: any;
  allCategories : any;
  private unsubscribe: Subject<any>;
  title: string;
  breadcrumb: Array<Breadcrumb>;
  countries = APP_SETTINGS.countries;
  states = APP_SETTINGS.states;
  parent: string;
  name: string;
  statusItems = [
    {title: 'Active', value: APP_SETTINGS.status.Active},
    {title: 'Inactive', value: APP_SETTINGS.status.InActive}
  ];

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.edit = !!this.id;

    this.getAllCategories();


    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Categories', route: '/categories/list', active: false},
      {title: 'Category Detail', active: true}
    ];
    this.initForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initForm() {
    const validation = {
      name: ['', Validators.compose([
        Validators.required,
      ])],
      parent: [''],
      status : ['', Validators.compose([
        Validators.required
      ])],
    };
    this.form = this.fb.group(validation);

    if (this.edit) { /* Do Nothing */
    } else {
      this.form.reset();
      const controls = this.form.controls;

      controls.status.setValue(this.statusItems[0].value);
    }
  }

  submit(): void {
    const controls = this.form.controls;
    console.log(controls);
    /** check form */
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;
    const data = {
      name: this.name,
      parent:  this.parent,
      status: controls.status.value
    };
    if(!data.parent){
     delete data.parent;
    }
    
    if (this.edit) {
      data['status'] = controls.status.value;
      this.actionEditCategory(data);
    } else {
      this.actionAddCategory(data);
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }

    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  private fillWithData() {
    const controls = this.form.controls;
    controls.name.setValue(this.category.name);
    this.name = this.category.name;
    controls.parent.setValue(this.category.parent);
    this.parent = this.category.parent;
    controls.status.setValue(this.category.status);
  }

  private actionGetCategory() {
    this.categoryService.categoryGet(this.id).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.category = res.data;
          this.fillWithData();
        } else {
          this.category = {};
        }
      },
      (err) => {
        this.errorMessage = 'Unable to find the category.';
      });
  }

  private getAllCategories() {
    this.categoryService.categoryGetAll().subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.allCategories = res.data;
        } else {
          this.allCategories = {};
        }
        if (this.edit) {
          this.actionGetCategory();
          this.title = 'Edit';
        } else {
          this.title = 'Add';
        }
      },
      (err) => {
        this.errorMessage = 'Unable to find the category.';
      });
  }

  private actionAddCategory(data) {
    this.categoryService.categoryAdd(data).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.errorMessage = '';
          this.successMessage = 'Category Added Successfully';
        } else {
          this.errorMessage = 'Unable to add category with the provided fields.';
        }
        this.loading = false;
        this.form.reset();
      },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to add category with the provided fields.';
        this.loading = false;
      });
  }

  private actionEditCategory(data) {
    this.categoryService.categoryEdit(this.id, data).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.errorMessage = '';
          this.successMessage = 'Category Updated Successfully';
        } else {
          this.errorMessage = 'Unable to update category with the provided fields. Please check your fields.';
        }
        this.loading = false;
      },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to update category with the provided fields.';
        this.loading = false;
      });
  }

  changeCategory(value){

    //console.log(this.form.controls);

    this.parent = value;

  }

  onSearchChange(value: string): void {  
    this.name = value;
  }
}
