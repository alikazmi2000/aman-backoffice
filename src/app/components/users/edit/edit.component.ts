import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpBasicResponse } from '../../../models/httpBasicResponse';
import { isSuccessResponse } from '../../../helpers/helpers';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import APP_SETTINGS from '../../../helpers/settings';
import { Breadcrumb } from '../../../models/breadcrumb';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { Region } from '../../../models/region';
import { RegionService } from '../../../services/region.service';
import { Document } from '../../../models/document';
import { DocumentService } from '../../../services/document.service';
import { OtherService } from '../../../services/other.service';
import { Upload } from '../../../models/upload';

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
  user: User = new User();
  userRole: any;
  roles = APP_SETTINGS.rolesData;
  countryCodes = APP_SETTINGS.countryCodes;
  breadcrumb: Array<Breadcrumb>;
  title: string;
  private unsubscribe: Subject<any>;
  categories: Array<Category>;
  serviceAreas: Array<Region>;
  documents: Array<Document>;
  categoriesDropdown = [];
  categoriesSelectedDropdown = [];
  selectedFile: File;
  selectedProfilePictureFile: File;
  profileUploaded: Upload = new Upload();
  documentsUploaded = [];
  dropdownSettings = {
    text: 'Select Categories',
    ...APP_SETTINGS.dropdownSettings
  };
  statusItems = [
    { title: 'Active', value: APP_SETTINGS.status.Active },
    { title: 'Blocked', value: APP_SETTINGS.status.Blocked },
    { title: 'Inactive', value: APP_SETTINGS.status.InActive },
    { title: 'Pending', value: APP_SETTINGS.status.Pending }
  ];

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private categoryService: CategoryService,
    private regionService: RegionService,
    private documentService: DocumentService,
    private otherService: OtherService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.edit = !!this.id;

    // Getting All Categories and Regions
    this.actionGetCategories();
    this.actionGetRegions();

    if (this.edit) {
      this.actionGetUser();
      this.title = 'Edit';
    } else {
      this.actionGetDocuments();
      this.title = 'Add';
    }

    this.breadcrumb = [
      { title: 'Dashboard', route: '/dashboard', active: false },
      { title: 'Users', route: '/users/list', active: false },
      { title: `${this.title} User`, active: true }
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
      firstName: ['', Validators.compose([
        Validators.required,
      ])],
      lastName: ['', Validators.compose([
        Validators.required,
      ])],
      countryCode: ['', Validators.compose([
        Validators.required,
      ])],
      phoneNumber: ['', Validators.compose([
        Validators.required,
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])],
      userType: ['', Validators.compose([
        Validators.required
      ])],
      serviceArea: ['', Validators.compose([])],
      companyName: ['', Validators.compose([])],
      expiry: [[], Validators.compose([])]
    };
    if (this.edit) {
      delete validation.password;
      validation['password'] = ['', Validators.compose([])];
      validation['status'] = ['', Validators.compose([
        Validators.required
      ])];
    }
    this.form = this.fb.group(validation);

    if (this.edit) { /* Do Nothing */
    } else {
      this.form.reset();
      this.form.controls.countryCode.setValue(this.countryCodes[0].value); // TODO: find a better way
    }
  }

  submit(): void {
    const controls = this.form.controls;
    /** check form */
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;
    let data;

    const categories = [];
    if (this.userRole !== APP_SETTINGS.roles.Requester) {
      for (const item of this.categoriesSelectedDropdown) {
        categories.push(item.id);
      }
    }


    if (this.edit) {
      data = {
        first_name: controls.firstName.value,
        last_name: controls.lastName.value,
        phone_number: controls.countryCode.value + '-' + controls.phoneNumber.value,
        email: controls.email.value,
        role: controls.userType.value,
        status: controls.status.value,
      };
      if (controls.password.value) {
        data.password = controls.password.value;
      }
      if (this.userRole === APP_SETTINGS.roles.Provider) {
        data = {
          ...data,
          categories
        };
      }
      if (this.userRole !== APP_SETTINGS.roles.Requester) {
        let service_areas = undefined;
        if (this.user.service_areas)
          service_areas = (this.user.service_areas.length > 0) ? this.user.service_areas.map(area => area.id) : undefined;
        data = {
          ...data,
          documents: this.documentsUploaded,
          service_area_id: service_areas,
          company_name: controls.companyName.value
        };
      }
      this.actionEditUser(data);
    } else {
      data = {
        first_name: controls.firstName.value,
        last_name: controls.lastName.value,
        phone_number: controls.countryCode.value + '-' + controls.phoneNumber.value,
        email: controls.email.value,
        password: controls.password.value,
        role: controls.userType.value
      };
      if (this.userRole === APP_SETTINGS.roles.Provider) {
        data = {
          ...data,
          categories
        };
      }
      if (this.userRole !== APP_SETTINGS.roles.Requester) {
        data = {
          ...data,
          documents: this.documentsUploaded,
          company_name: controls.companyName.value
        };
      }
      this.actionAddUser(data);
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
    controls.firstName.setValue(this.user.first_name);
    controls.lastName.setValue(this.user.last_name);
    controls.password.setValue('');
    controls.countryCode.setValue(this.user.phone_obj.country_code);
    controls.phoneNumber.setValue(this.user.phone_obj.phone_number);
    controls.email.setValue(this.user.email);
    controls.userType.setValue(this.user.role);
    controls.status.setValue(this.user.status);
    controls.companyName.setValue(this.user.company_name);

    if (
      typeof this.user.service_areas !== 'undefined' &&
      this.user.service_areas.length &&
      typeof this.user.service_areas !== 'undefined' &&
      typeof this.user.service_areas[0] !== 'undefined'
    ) {
      controls.serviceArea.setValue(this.user.service_areas[0].id);
    }

    this.actionGetDocuments(documents => {
      this.documents = documents;
      if (this.documents.length) {
        for (const [key, item] of Object.entries(this.documents)) {
          this.documentsUploaded[key] = {
            document_id: item.id,
            document: '',
            expiry: ''
          };
        }
      }
      if (typeof this.user.documents !== 'undefined' && this.user.documents.length) {
        for (const [key, item] of Object.entries(this.user.documents)) {
          this.documents[key].image = item.file_name ? item.file_name : '';
          let expiry;
          if (item.expiry) {
            const date = new Date(item.expiry);
            expiry = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
          } else {
            expiry = '';
          }
          this.documents[key].expiry = expiry;

          // Filling Documents
          if (this.documentsUploaded[key]['document_id'].toString() === item.document_id.toString()) {
            this.documentsUploaded[key]['document'] = item.file_name_base;
            this.documentsUploaded[key]['expiry'] = expiry;
          }
        }
      }
    });

    if (typeof this.user.categories !== 'undefined' && this.user.categories.length) {
      for (const item of this.user.categories) {
        this.categoriesSelectedDropdown.push({ id: item.id, itemName: item.title });
      }
    }

    this.userRole = this.user.role;
  }

  private actionGetUser() {
    this.userService.userGet(this.id).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.user = res.data;
        this.fillWithData();
      } else {
        this.user = {};
      }
    },
      (err) => {
        this.errorMessage = 'Unable to find the user.';
      });
  }

  private actionAddUser(data) {
    // Putting Profile Picture in the request
    if (this.profileUploaded.file) {
      data['profile_picture'] = this.profileUploaded.file;
    }
    this.userService.userAdd(data).subscribe((res: HttpBasicResponse) => {
      this.successMessage = '';
      this.errorMessage = '';
      if (isSuccessResponse(res)) {
        this.successMessage = 'User Added Successfully';
        this.router.navigate(['/users/edit', res.data.id]);
        this.form.reset();
        this.categoriesSelectedDropdown = [];
        this.actionGetDocuments();
      }
      this.loading = false;
    },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to add user with the provided fields.';
        this.loading = false;
      });
  }

  private actionEditUser(data) {
    // Putting Profile Picture in the request
    if (this.profileUploaded.file) {
      data['profile_picture'] = this.profileUploaded.file;
    }
    this.userService.userEdit(this.id, data).subscribe((res: HttpBasicResponse) => {
      this.successMessage = '';
      this.errorMessage = '';
      if (isSuccessResponse(res)) {
        this.successMessage = 'User Updated Successfully';
        this.form.controls.password.setValue('');
      } else {
        this.errorMessage = 'Unable to update user with the provided fields. Please check your fields.';
      }
      this.loading = false;
    },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to update the user with the provided fields.';
        this.loading = false;
      });
  }

  private actionGetCategories() {
    this.categoryService.categoriesGetAll('').subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.categories = res.data;
        for (const item of res.data) {
          this.categoriesDropdown.push({ id: item.id, itemName: item.title });
        }
      }
    },
      (err) => {
        // TODO: should handle error
      });
  }

  private actionGetRegions() {
    this.regionService.regionsGetAll().subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.serviceAreas = res.data;
      }
    },
      (err) => {
        // TODO: should handle error
      });
  }

  private actionGetDocuments(callback = null) {
    this.documentService.documentsGetAll().subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        if (callback !== null) {
          callback(res.data);
        } else {
          this.documents = res.data;
          if (this.documents.length) {
            for (const [key, item] of Object.entries(this.documents)) {
              this.documentsUploaded[key] = {
                document_id: item.id,
                document: '',
                expiry: ''
              };
            }
          }
        }
      }
    },
      (err) => {
        console.log(err);
      });
  }

  onFileChanged(event) {
    if (typeof event.target.files !== 'undefined' && typeof event.target.files[0] !== 'undefined') {
      this.selectedFile = event.target.files[0];
      const index = event.target.dataset.index;
      this.uploadFile(this.selectedFile, index);
    }
  }

  onExpiryChanged(event) {
    const index = event.target.dataset.index;
    let value = event.target.value;
    value = new Date(value).toISOString();
    this.documentsUploaded[index].expiry = value;
  }

  uploadFile(file, index = -1) {
    const uploadData = new FormData();
    uploadData.append('file', file, file.name);
    uploadData.append('upload_type', 'user');
    this.otherService.upload(uploadData).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        if (index === -1) {
          this.profileUploaded = res.data;
        } else {
          this.documentsUploaded[index] = {
            document_id: this.documents[index].id,
            document: res.data.file
          };
          this.documents[index].image = res.data.url;
        }
      }
    });
  }

  onProfilePictureFileChanged(event) {
    this.selectedProfilePictureFile = event.target.files[0];
    this.uploadFile(this.selectedProfilePictureFile);
  }
}
