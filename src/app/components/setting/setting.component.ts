import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {Breadcrumb} from '../../models/breadcrumb';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {OtherService} from '../../services/other.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpBasicResponse} from '../../models/httpBasicResponse';
import {isSuccessResponse} from '../../helpers/helpers';
import {Setting} from '../../models/setting';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading = false;
  errorMessage: string | null;
  successMessage: string | null;
  settings: Setting = new Setting();
  private unsubscribe: Subject<any>;
  breadcrumb: Array<Breadcrumb>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private otherService: OtherService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.otherService.setting().subscribe((res: HttpBasicResponse) => {
      if (isSuccessResponse(res)) {
        this.settings = res.data;
        this.fillWithData();
      }
    });

    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Settings', active: true}
    ];

    this.initForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initForm() {
    this.form = this.fb.group({
      currency: ['', Validators.compose([
        Validators.required,
      ])],
      currencySymbol: ['', Validators.compose([
        Validators.required,
      ])],
      propertiesLimit: ['', Validators.compose([
        Validators.required,
      ])],
      cardsLimit: ['', Validators.compose([
        Validators.required,
      ])],
      bankAccountsLimit: ['', Validators.compose([
        Validators.required,
      ])],
      becomeAProviderUrl: ['', Validators.compose([
        Validators.required,
      ])],
      becomeAManagerUrl: ['', Validators.compose([
        Validators.required,
      ])],
      defaultDesignerEmail: ['', Validators.compose([
        Validators.required,
      ])],
      defaultBuyerEmail: ['', Validators.compose([
        Validators.required,
      ])],
      termsAndConditionUrl: ['', Validators.compose([
        Validators.required,
      ])],
      privacyPolicyUrl: ['', Validators.compose([
        Validators.required,
      ])],
      stripeTestPayment: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }

  private fillWithData() {
    const controls = this.form.controls;
    controls.currency.setValue(this.settings.currency);
    controls.currencySymbol.setValue(this.settings.currency_symbol);
    controls.propertiesLimit.setValue(this.settings.properties_limit);
    controls.cardsLimit.setValue(this.settings.cards_limit);
    controls.bankAccountsLimit.setValue(this.settings.bank_accounts_limit);
    controls.becomeAProviderUrl.setValue(this.settings.become_a_provider_url);
    controls.becomeAManagerUrl.setValue(this.settings.become_a_manager_url);
    controls.defaultDesignerEmail.setValue(this.settings.default_designer_email);
    controls.defaultBuyerEmail.setValue(this.settings.default_buyer_email);
    controls.termsAndConditionUrl.setValue(this.settings.terms_and_condition_url);
    controls.privacyPolicyUrl.setValue(this.settings.privacy_policy_url);
    controls.stripeTestPayment.setValue(this.settings.stripe_test_payment);
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
      currency: controls.currency.value,
      currency_symbol: controls.currencySymbol.value,
      properties_limit: controls.propertiesLimit.value,
      cards_limit: controls.cardsLimit.value,
      bank_accounts_limit: controls.bankAccountsLimit.value,
      become_a_provider_url: controls.becomeAProviderUrl.value,
      become_a_manager_url: controls.becomeAManagerUrl.value,
      default_designer_email : controls.defaultDesignerEmail.value,
      default_buyer_email: controls.defaultBuyerEmail.value,
      terms_and_condition_url: controls.termsAndConditionUrl.value,
      privacy_policy_url: controls.privacyPolicyUrl.value,
      stripe_test_payment: controls.stripeTestPayment.value
    };

    this.actionUpdateSetting(data);
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }

    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  private actionUpdateSetting(data: any) {
    this.otherService.updateSetting(data).subscribe((resSetting: HttpBasicResponse) => {
        this.successMessage = '';
        this.errorMessage = '';
        if (isSuccessResponse(resSetting)) {
          this.successMessage = 'Setting Updated Successfully';
        } else {
          this.errorMessage = 'Unable to update the setting';
        }
        this.loading = false;
      },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to update the setting.';
        this.loading = false;
      });
  }
}
