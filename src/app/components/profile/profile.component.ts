import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {User} from '../../models/user';
import {HttpBasicResponse} from '../../models/httpBasicResponse';
import {isSuccessResponse} from '../../helpers/helpers';
import {AuthService} from '../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../../services/user.service';
import {Breadcrumb} from '../../models/breadcrumb';
import {OtherService} from '../../services/other.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  form: FormGroup;
  selectedFile: File;
  loading = false;
  errorMessage: string | null;
  successMessage: string | null;
  formChangePassword: FormGroup;
  loadingChangePassword = false;
  errorMessageChangePassword: string | null;
  successMessageChangePassword: string | null;
  user: User = new User();
  private unsubscribe: Subject<any>;
  breadcrumb: Array<Breadcrumb>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private otherService: OtherService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private fbChangePassword: FormBuilder,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.authService.validateToken().subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.user = res.data;
        this.fillWithData();
      }
    });

    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Profile', active: true}
    ];

    this.initForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
    this.loadingChangePassword = false;
  }

  initForm() {
    this.form = this.fb.group({
      firstName: ['', Validators.compose([
        Validators.required,
      ])],
      lastName: ['', Validators.compose([
        Validators.required,
      ])],
    });

    this.formChangePassword = this.fbChangePassword.group({
      oldPassword: ['', Validators.compose([
        Validators.required,
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])],
    });
  }

  private fillWithData() {
    const controls = this.form.controls;
    controls.firstName.setValue(this.user.first_name);
    controls.lastName.setValue(this.user.last_name);
  }

  submit() {
    const controls = this.form.controls;
    /** check form */
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const data = {
      first_name: controls.firstName.value,
      last_name: controls.lastName.value
    };

    this.actionUpdateProfile(data);
  }

  submitChangePassword() {
    const controls = this.formChangePassword.controls;
    /** check form */
    if (this.formChangePassword.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loadingChangePassword = true;
    this.successMessageChangePassword = '';
    this.errorMessageChangePassword = '';

    const data = {
      old_password: controls.oldPassword.value,
      password: controls.password.value
    };

    this.actionChangePassword(data);
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }

    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  isControlHasErrorChangePassword(controlName: string, validationType: string): boolean {
    const control = this.formChangePassword.controls[controlName];
    if (!control) {
      return false;
    }

    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  private actionUpdateProfile(data: any) {
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    uploadData.append('upload_type', 'user');
    this.otherService.upload(uploadData).subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        // Putting Profile Picture in the request then updating user
        data['profile_picture'] = res.data.file;
        this.userService.userUpdateProfile(data).subscribe((resProfile: HttpBasicResponse) => {
          if (isSuccessResponse(resProfile)) {
            this.errorMessage = '';
            this.successMessage = 'Profile Updated Successfully';
          } else {
            this.errorMessage = 'Unable to update user\'s profile with the provided fields.';
          }
          this.loading = false;
        });
      } else {
        this.errorMessage = 'Unable to upload file.';
      }

      this.loading = false;
    },
    (err) => {
      this.successMessage = '';
      this.errorMessage = err ? err : 'Unable to update the profile.';
      this.loadingChangePassword = false;
    });
  }

  private actionChangePassword(data: any) {
    this.userService.userChangePassword(data).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.errorMessageChangePassword = '';
          this.successMessageChangePassword = 'Password Updated Successfully';
          this.formChangePassword.reset();
        } else {
          this.errorMessageChangePassword = 'Unable to update your password with the provided fields.';
        }
        this.loadingChangePassword = false;
      },
      (err) => {
        this.successMessageChangePassword = '';
        this.errorMessageChangePassword = err ? err : 'Unable to change the password.';
        this.loadingChangePassword = false;
      });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }
}
