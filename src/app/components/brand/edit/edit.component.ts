import {ChangeDetectorRef, Component, OnDestroy, OnInit, Input, NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {HttpBasicResponse} from '../../../models/httpBasicResponse';
import {isSuccessResponse} from '../../../helpers/helpers';
import {Breadcrumb} from '../../../models/breadcrumb';
import APP_SETTINGS from '../../../helpers/settings';
import { BrandService } from 'src/app/services/brand.service';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  @Input()
  responses: Array<any>;

  private hasBaseDropZoneOver: boolean = false;
  private uploader: FileUploader;

  form: FormGroup;
  loading = false;
  errorMessage: string | null;
  successMessage: string | null;
  id = null;
  edit = false;
  brand: any;
  allCategories : any;
  private unsubscribe: Subject<any>;
  selectedPictureFile: File;
  title: string;
  src:{
    "src": "",
    "name": "",
    "alt": ""
  };
  old_image : boolean = true;
  breadcrumb: Array<Breadcrumb>;
  statusItems = [
    {title: 'Active', value: APP_SETTINGS.status.Active},
    {title: 'Inactive', value: APP_SETTINGS.status.InActive}
  ];

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private brandService: BrandService,
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient
  ) {
    this.unsubscribe = new Subject();
    this.responses = [];
    this.title = '';
  }

  ngOnInit() {


    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      allowedMimeType: ['image/png','image/jpg','image/jpeg'],
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };


    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = 'brands';
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `brands,${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      form.append('folder', 'angular_sample');
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

     // Insert or update an entry in the responses array
     const upsertResponse = fileItem => {

      // Run the update in a custom zone since for some reason change detection isn't performed
      // as part of the XHR request to upload the files.
      // Running in a custom zone forces change detection
      this.zone.run(() => {
        // Update an existing entry if it's upload hasn't completed yet

        // Find the id of an existing item
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
       
        if (existingId > -1) {
          // Update existing item with new data
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
          this.old_image = false;
        } else {
          // Create new response
          this.responses[0] = fileItem;
          this.old_image = false;
          //this.responses.push(fileItem);
        }
      });
    };

     // Update model on completion of uploading a file
     this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
     upsertResponse(
       {
         file: item.file,
         status,
         data: JSON.parse(response)
       }
     );

   // Update model on upload progress event
   this.uploader.onProgressItem = (fileItem: any, progress: any) =>
     upsertResponse(
       {
         file: fileItem.file,
         progress,
         data: {}
       }
     );





    this.id = this.route.snapshot.paramMap.get('id');
    this.edit = !!this.id;


    if (this.edit) {
      this.actionGetBrand();
      this.title = 'Edit';
    } else {
      this.title = 'Add';
    }

    this.breadcrumb = [
      {title: 'Dashboard', route: '/dashboard', active: false},
      {title: 'Brands', route: '/brand/list', active: false},
      {title: 'Brand Detail', active: true}
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
      status : ['', Validators.compose([
        Validators.required
      ])],
    };

    // if (this.edit) {
    //   validation['status'] = ['', Validators.compose([
    //     Validators.required
    //   ])];
    // }
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
    /** check form */
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;
    const data = {
      name: controls.name.value,
      status: controls.status.value,
      brand_image: {
        "src": "",
        "name": "",
        "alt": ""
    }
      
    };

    if (this.edit) {

      data['brand_image'] = this.src;

    }

    if(this.responses[0]){
      data.brand_image.src = this.responses[0].data.url;
      data.brand_image.name = this.responses[0].data.original_filename;
      data.brand_image.alt = this.responses[0].data.original_filename;
    }
    // }else{
    //   delete data.brand_image;
    // }
    if (this.edit) {
      data['status'] = controls.status.value;
      this.actionEditBrand(data);
    } else {
      this.actionAddBrand(data);
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
     controls.name.setValue(this.brand.name);
     controls.status.setValue(this.brand.status);
     console.log(this.brand.brand_image);
      this.src = this.brand.brand_image;
      console.log(this.src);
     
    // controls.hourlyRate.setValue(this.category.hourly_rate);
    // controls.adminCommissionPercentage.setValue(this.category.admin_commission_percentage);
    // controls.status.setValue(this.category.status);
  }

  private actionGetBrand() {
    this.brandService.brandGet(this.id).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.brand = res.data;
          this.fillWithData();
        } else {
          this.brand = {};
        }
      },
      (err) => {
        this.errorMessage = 'Unable to find the brand.';
      });
  }



  private actionAddBrand(data) {
    this.brandService.brandAdd(data).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.errorMessage = '';
          this.successMessage = 'Brand Added Successfully';
        } else {
          this.errorMessage = 'Unable to add brand with the provided fields.';
        }
        this.loading = false;
        this.form.reset();
      },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to add brand with the provided fields.';
        this.loading = false;
      });
  }

  private actionEditBrand(data) {
    this.brandService.brandEdit(this.id, data).subscribe((res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.errorMessage = '';
          this.successMessage = 'Brand Updated Successfully';
        } else {
          this.errorMessage = 'Unable to update brand with the provided fields. Please check your fields.';
        }
        this.loading = false;
      },
      (err) => {
        this.successMessage = '';
        this.errorMessage = err ? err : 'Unable to update brand with the provided fields.';
        this.loading = false;
      });
  }


  uploadFile(file, index = -1) {
    const uploadData = new FormData();
    uploadData.append('file', file, file.name);
    uploadData.append('upload_type', 'user');
    // this.otherService.upload(uploadData).subscribe((res: HttpBasicResponse) => {
    //   if (isSuccessResponse(res)) {
    //     if (index === -1) {
    //       this.profileUploaded = res.data;
    //     } else {
    //       this.documentsUploaded[index] = {
    //         document_id: this.documents[index].id,
    //         document: res.data.file
    //       };
    //       this.documents[index].image = res.data.url;
    //     }
    //   }
    // });
  }

  onPictureFileChanged(event) {
    this.selectedPictureFile = event.target.files[0];
    this.uploadFile(this.selectedPictureFile);
  }

  updateTitle(value: string) {
    this.title = value;
  }

  // Delete an uploaded image
  // Requires setting "Return delete token" to "Yes" in your upload preset configuration
  // See also https://support.cloudinary.com/hc/en-us/articles/202521132-How-to-delete-an-image-from-the-client-side-
  deleteImage = function (data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body, options).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.result}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };

  // fileOverBase(e: any): void {
  //   this.hasBaseDropZoneOver = e;
  // }

  // getFileProperties(fileProperties: any) {
  //   // Transforms Javascript Object to an iterable to be used by *ngFor
  //   if (!fileProperties) {
  //     return null;
  //   }
  //   return Object.keys(fileProperties)
  //     .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  // }
}
