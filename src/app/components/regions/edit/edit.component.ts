import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpBasicResponse } from '../../../models/httpBasicResponse';
import { HttpCollectionResponse } from '../../../models/httpCollectionResponse';
import { UserService } from '../../../services/user.service';
import { isSuccessResponse } from '../../../helpers/helpers';
import { RegionService } from '../../../services/region.service';
import { Region } from '../../../models/region';
import { User } from '../../../models/user'
import { Breadcrumb } from '../../../models/breadcrumb';
import APP_SETTINGS from '../../../helpers/settings';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading = false;
  selectedDropDownError = {
    tech: false,
    provider: false
  };
  techList = [];
  providerList = [];
  techSelectedDropdown = [];
  providerSelectedDropdown = [];
  dropdownSettings = {
    tech: {
      text: 'Select Techs',
      enableCheckAll: false,
      ...APP_SETTINGS.dropdownSettings,
      singleSelection: true

    },
    provider: {
      text: 'Select Providers',
      enableCheckAll: false,
      ...APP_SETTINGS.dropdownSettings,
    }
  };
  errorMessage: string | null;
  successMessage: string | null;
  id = null;
  edit = false;
  optionalSelectDropdown = {
    provider: false,
    tech: false
  };
  region: Region = new Region();
  private unsubscribe: Subject<any>;
  title: string;
  breadcrumb: Array<Breadcrumb>;
  countries = APP_SETTINGS.countries;
  states = APP_SETTINGS.states;
  statusItems = [
    { title: 'Active', value: APP_SETTINGS.status.Active },
    { title: 'Inactive', value: APP_SETTINGS.status.InActive }
  ];

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private route: ActivatedRoute,
    private regionService: RegionService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    // this.dropdownSettings.tech.singleSelection = true;
    // this.dropdownSettings.provider.singleSelection = true;

    this.edit = !!this.id;
    this.actionGetTechs();
    this.actionGetProviders();

    if (this.edit) {
      this.actionGetRegion();
      this.title = 'Edit';
    } else {
      this.title = 'Add';
    }

    this.breadcrumb = [
      { title: 'Dashboard', route: '/dashboard', active: false },
      { title: 'Regions', route: '/regions/list', active: false },
      { title: 'Region Detail', active: true }
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
      city: ['', Validators.compose([
        Validators.required,
      ])],
      state: ['', Validators.compose([
        Validators.required,
      ])],
      country: ['', Validators.compose([
        Validators.required
      ])],
      zipCode: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern('^[0-9]*$')
      ])]
    };

    if (this.edit) {
      validation['status'] = ['', Validators.compose([
        Validators.required
      ])];
    }
    this.form = this.fb.group(validation);

    if (this.edit) { /* Do Nothing */
    } else {
      this.form.reset();
    }
  }

  validateDropdown() {
    this.selectedDropDownError.tech = (this.techSelectedDropdown.length === 0 && this.edit && this.optionalSelectDropdown.tech)
    this.selectedDropDownError.provider = (this.providerSelectedDropdown.length === 0 && this.edit && this.optionalSelectDropdown.provider)
    return this.selectedDropDownError.tech || this.selectedDropDownError.provider
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

    if (this.validateDropdown())
      return;

    const tech_list = this.techSelectedDropdown.map(tech => tech.id)
    const provider_list = this.providerSelectedDropdown.map(provider => provider.id)

    this.loading = true;
    const data = {
      name: controls.name.value,
      city: controls.city.value,
      state: controls.state.value,
      country: controls.country.value,
      zip_code: controls.zipCode.value,
      provider_list: (provider_list === null) ? [] : provider_list,
      tech_list: (tech_list === null) ? [] : tech_list
    };
    if (this.edit) {
      data['status'] = controls.status.value;
      this.actionEditRegion(data);
    } else {
      this.actionAddRegion(data);
    }
    if (tech_list.length > 0 && this.successMessage != '') {
      this.optionalSelectDropdown.tech = true;
    }
    if (provider_list.length > 0 && this.successMessage != '') {
      this.optionalSelectDropdown.provider = true;
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
    controls.name.setValue(this.region.name);
    controls.city.setValue(this.region.city);
    controls.state.setValue(this.region.state);
    controls.country.setValue(this.region.country);
    controls.zipCode.setValue(this.region.zip_code);
    controls.status.setValue(this.region.status);
  }
  private actionGetTechs() {
    const query = "fields=first_name,last_name,email&search[role]=tech&search[status]=active"
    this.userService.usersGet(query).subscribe((resp: HttpCollectionResponse) => {
      for (const item of resp.data.docs) {
        const object = {
          id: item.id,
          itemName: item.first_name + ' ' + item.last_name
        }
        this.techList.push(object);
      }
    });
  }
  private actionGetProviders() {
    const query = "fields=first_name,last_name,email&search[role]=provider&search[status]=active"
    this.userService.usersGet(query).subscribe((resp: HttpCollectionResponse) => {
      for (const item of resp.data.docs) {
        const object = {
          id: item.id,
          itemName: item.first_name + ' ' + item.last_name
        }
        this.providerList.push(object);
      }
    });
  }
  private actionGetRegion() {
    this.regionService.regionGet(this.id).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.region = res.data;
        this.techSelectedDropdown = (res.data.techSelectedDropdown) ? res.data.techSelectedDropdown : []
        this.providerSelectedDropdown = (res.data.providerSelectedDropdown) ? res.data.providerSelectedDropdown : []
        this.optionalSelectDropdown.tech = (this.techSelectedDropdown.length === 0) ? false : true
        this.optionalSelectDropdown.provider = (this.providerSelectedDropdown.length === 0) ? false : true

        this.fillWithData();
      } else {
        this.region = {};
      }
    },
      (err) => {
        this.errorMessage = 'Unable to find the region.';
      });
  }
  public updateSelectedDropdown(event) {
    this.techSelectedDropdown[0] = event;
  }
  private actionAddRegion(data) {
    this.regionService.regionAdd(data).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.errorMessage = '';
        this.successMessage = 'Region Added Successfully';
      } else {
        this.errorMessage = 'Unable to add region with the provided fields.';
      }
      this.loading = false;
      this.form.reset();
    },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to add region with the provided fields.';
        this.loading = false;
      });
  }

  private actionEditRegion(data) {
    this.regionService.regionEdit(this.id, data).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.errorMessage = '';
        this.successMessage = 'Region Updated Successfully';
      } else {
        this.errorMessage = 'Unable to update region with the provided fields. Please check your fields.';
      }
      this.loading = false;
    },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to update region with the provided fields.';
        this.loading = false;
      });
  }
}
