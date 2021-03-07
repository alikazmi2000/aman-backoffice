import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Input,
  NgZone,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { ActivatedRoute,Router } from "@angular/router";
import { Subject } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { HttpBasicResponse } from "../../../models/httpBasicResponse";
import { isSuccessResponse } from "../../../helpers/helpers";
import { Breadcrumb } from "../../../models/breadcrumb";
import APP_SETTINGS from "../../../helpers/settings";
import { ProductService } from "src/app/services/product.service";
import { BrandService } from "src/app/services/brand.service";
import {
  FileUploader,
  FileUploaderOptions,
  ParsedResponseHeaders,
} from "ng2-file-upload";
import { Cloudinary } from "@cloudinary/angular-5.x";
import { HttpClient } from "@angular/common/http";
import { CategoryService } from "../../../services/category.service";
import { AttributeService } from "../../../services/attribute.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CustomValidators } from 'ng2-validation';
@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit, OnDestroy {
  public Editor = ClassicEditor;
  @Input()
  responses: Array<any>;
  editImages: Array<any>;

  private hasBaseDropZoneOver: boolean = false;
  private uploader: FileUploader;

  form: FormGroup;
  loading = false;
  errorMessage: string | null;
  successMessage: string | null;
  id = null;
  edit = false;
  product: any;
  allCategories: any;
  allBrands: any;
  private unsubscribe: Subject<any>;
  selectedPictureFile: File;
  title: string;
  attribute = [];
  defaultManageStock:boolean = true;
  attributeSelectedDropdown = [];
  variationSelectedDropdown = [];
  breadcrumb: Array<Breadcrumb>;
  dropdownSettings = {
    text: "Select Attribute",
    ...APP_SETTINGS.dropdownSettingsSingle,
  };
  dropdownSettingsVariation = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'myclass custom-class-example',
    text: "Enter Choice Values",
    addNewItemOnFilter: true
  }
  statusItems = [
    { title: "Active", value: APP_SETTINGS.status.Active },
    { title: "Inactive", value: APP_SETTINGS.status.InActive },
  ];

  variationproductType = false;
  submitted = false;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private brandService: BrandService,
    private attributeService: AttributeService,
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient,
    private categoryService: CategoryService
  ) {
    this.unsubscribe = new Subject();
    this.responses = [];
    this.title = "";
  }

  ngOnInit() {
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${
        this.cloudinary.config().cloud_name
      }/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      allowedMimeType: ["image/png", "image/jpg", "image/jpeg"],
      //allowedMimeType: ['image/png'],
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: "X-Requested-With",
          value: "XMLHttpRequest",
        },
      ],
    };

    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append("upload_preset", this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = "products";
      if (this.title) {
        form.append("context", `photo=${this.title}`);
        tags = `products,${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      form.append("folder", "angular_products");
      // Add custom tags
      form.append("tags", tags);
      // Add file to upload
      form.append("file", fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    // Insert or update an entry in the responses array
    const upsertResponse = (fileItem) => {
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
          this.responses[existingId] = Object.assign(
            this.responses[existingId],
            fileItem
          );
        } else {
          // Create new response
          //this.responses[0] = fileItem;
          this.responses.push(fileItem);
          console.log(this.editImages);
          if (this.edit) {
            console.log(fileItem);

            let img = {
              data: {
                url: fileItem.data.url,
                original_filename: fileItem.data.original_filename,
              },
            };
            this.editImages.push(fileItem);
            console.log(this.editImages);
          }
        }
        //console.log(this.responses);
      });
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (
      item: any,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) =>
      upsertResponse({
        file: item.file,
        status,
        data: JSON.parse(response),
      });

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse({
        file: fileItem.file,
        progress,
        data: {},
      });

    this.initForm();

    this.id = this.route.snapshot.paramMap.get("id");
    this.edit = !!this.id;
    this.actionGetAttributes();
    if (this.edit) {
      this.actionGetProduct();
      this.title = "Edit";
    } else {
      this.title = "Add";
      this.getAllCategories();
      this.getAllBrands();
     
    }

    this.breadcrumb = [
      { title: "Dashboard", route: "/dashboard", active: false },
      { title: "Products", route: "/products/list", active: false },
      { title: "Products Detail", active: true },
    ];
  }

  get f() { return this.form.controls; }
  get t() { return this.f.variations as FormArray; }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initForm() {
    const validation = {
      name: ["", Validators.compose([Validators.required])],
      description: [""],
      short_description: ["", Validators.compose([Validators.required])],
      type: ["", Validators.compose([Validators.required])],
      categories: this.fb.array([], [Validators.required]),
      brands: this.fb.array([]),
      price: ["", Validators.compose([Validators.required,CustomValidators.number,CustomValidators.min(0)])],
      sku: ["", Validators.compose([Validators.required])],
      sync: [false],
      feature_image: [""],
      manage_stock: [true],
      status: ["", Validators.compose([Validators.required])],
      stock_quantity: ["", Validators.compose([Validators.required,CustomValidators.digits])],
      variations: new FormArray([])
    };

    // if (this.edit) {
    //   validation['status'] = ['', Validators.compose([
    //     Validators.required
    //   ])];
    // }
    this.form = this.fb.group(validation);


    if (this.edit) {
      /* Do Nothing */
    } else {
    this.form.reset();
    const controls = this.form.controls;
    controls.type.setValue("simple");
    controls.manage_stock.setValue(true);
    this.defaultManageStock = true;
    controls.status.setValue("publish");
    }
  }

  onCheckboxChangeCategory(e) {
    console.log(e);
    const checkArray: FormArray = this.form.get("categories") as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get("brands") as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  submit(): void {
    this.submitted = true;
    const controls = this.form.controls;
    console.log(controls);

    /** check form */
    if (this.form.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;

    const data = {
      name: controls.name.value,
      description: controls.description.value,
      short_description: controls.short_description.value,
      sku: controls.sku.value,
      manage_stock: controls.manage_stock.value,
      type:controls.type.value,
      price: controls.price.value,
      stock_quantity: controls.stock_quantity.value,
      categories: controls.categories.value,
      brands: controls.brands.value,
      sync_square: controls.sync.value,
      images: [],
      attributes: [],
      variations: controls.variations.value,
      status: controls.status.value
    };


    if(data.type=="variable"){
      
      data.price = 0;
      data.manage_stock = false;
      data.stock_quantity = 0;

      //Seprate Attributes from variations


      for(let i=0;i<this.attributeSelectedDropdown.length;i++){

        let options = [];

        for(let j=0;j<this.variationSelectedDropdown.length;j++){
          if(this.variationSelectedDropdown[j].parent_id == this.attributeSelectedDropdown[i].id){
            options.push(this.variationSelectedDropdown[j].itemName);
          }
        }



        data.attributes.push({
          id : this.attributeSelectedDropdown[i].id,
          name: this.attributeSelectedDropdown[i].itemName,
          options: options,
          variation : true,
          visible:true,
        })

      }


    }else{

      delete data.attributes;
      delete data.variations;

    }

    if (!controls.sync.value) {
      data.sync_square = false;
    }

    if (this.edit) {
      for (let i = 0; i < this.editImages.length; i++) {
        if (i == parseInt(controls.feature_image.value)) {
          data.images.unshift({
            name: this.editImages[i].data.original_filename,
            src: this.editImages[i].data.url,
            alt: this.editImages[i].data.original_filename,
          });
        } else {
          data.images.push({
            name: this.editImages[i].data.original_filename,
            src: this.editImages[i].data.url,
            alt: this.editImages[i].data.original_filename,
          });
        }
      }


      delete data.sku;
    } else {
      if (this.responses) {
        for (let i = 0; i < this.responses.length; i++) {
          if (i == parseInt(controls.feature_image.value)) {
            data.images.unshift({
              name: this.responses[i].data.original_filename,
              src: this.responses[i].data.url,
              alt: this.responses[i].data.original_filename,
            });
          } else {
            data.images.push({
              name: this.responses[i].data.original_filename,
              src: this.responses[i].data.url,
              alt: this.responses[i].data.original_filename,
            });
          }
        }
      }
    }

    console.log(data);
    if (this.edit) {
      //data['status'] = controls.status.value;
      this.actionEditProduct(data);
    } else {
      this.actionAddProduct(data);
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }

    return (
      control.hasError(validationType) && (control.dirty || control.touched)
    );
  }

  private fillWithData() {
    // name: ['', Validators.compose([
    //   Validators.required,
    // ])],
    // description: [''],
    // short_description: ['', Validators.compose([
    //   Validators.required,
    // ])],
    // // type: ['simple', Validators.compose([
    // //   Validators.required,
    // // ])],
    // categories: this.fb.array([], [Validators.required]),
    // brands: this.fb.array([]),
    // price: ['', Validators.compose([
    //   Validators.required,
    // ])],
    // sku: ['', Validators.compose([
    //   Validators.required,
    // ])],
    // sync:[false],
    // feature_image:[''],
    // stock_quantity: ['', Validators.compose([
    //   Validators.required,
    // ])]

    const controls = this.form.controls;
    controls.name.setValue(this.product.name);
    controls.description.setValue(this.product.description);
    controls.short_description.setValue(this.product.short_description);
    controls.sku.setValue(this.product.sku);
    controls.stock_quantity.setValue(this.product.stock_quantity);
    controls.sync.setValue(this.product.sync_square);
    controls.price.setValue(this.product.price);
    controls.type.setValue(this.product.type);
    controls.status.setValue(this.product.status);
    if(this.product.type=="variable"){
      this.variationproductType = true;


      for(let i=0;i<this.product.attributes.length;i++){

    
        let ind = this.attribute.findIndex(x => x.id === this.product.attributes[i].id);
        let values  = this.attribute[ind].values;

        this.attributeSelectedDropdown.push({ id: this.product.attributes[i].id, itemName: this.product.attributes[i].name,values:values });

      }


    


      
    }
   

    for (let i = 0; i < this.product.categories.length; i++) {
      this.onCheckboxChangeCategory({
        target: {
          checked: true,
          value: this.product.categories[i],
        },
      });
    }

    for (let i = 0; i < this.product.brands.length; i++) {
      this.onCheckboxChange({
        target: {
          checked: true,
          value: this.product.brands[i],
        },
      });
    }

    this.getAllCategories();
    this.getAllBrands();
   






    this.editImages = this.product.images.map((img) => {
      return {
        data: {
          url: img.src,
          original_filename: img.name,
        },
        status: "success",
      };
    });
  }

  private actionGetAttributes() {
    
    this.attributeService.attributeGetAll().subscribe(
      (res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          for (const item of res.data) {
            let values = [];
            console.log(item.values);
            for(const val of item.options){
              values.push({
                id : Math.random(),
                itemName: val,
                parent_id:item._id,
                parent_name:item.name
              })
            }
            
            this.attribute.push({ id:item._id, itemName: item.name,values:values});
          }
        }
      },
      (err) => {
        // TODO: should handle error
      }
    );
  }

  private getAllCategories() {
    this.categoryService.categoryGetAll().subscribe(
      (res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          if (this.edit) {
            let mapData = res.data;

            this.allCategories = mapData.map((dta) => {
              return {
                ...dta,
                checked: this.product.categories.includes(dta.id)
                  ? true
                  : false,
              };
            });
          } else {
            let mapData = res.data;

            this.allCategories = mapData.map((dta) => {
              return {
                ...dta,
                checked: false,
              };
            });
          }
        } else {
          this.allCategories = {};
        }
      },
      (err) => {
        //this.errorMessage = 'Unable to find the category.';
      }
    );
  }

  private getAllBrands() {
    this.brandService.brandGetAll().subscribe(
      (res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          if (this.edit) {
            let mapData = res.data;

            this.allBrands = mapData.map((dta) => {
              return {
                ...dta,
                checked: this.product.brands.includes(dta._id) ? true : false,
              };
            });
          } else {
            let mapData = res.data;

            this.allBrands = mapData.map((dta) => {
              return {
                ...dta,
                checked: false,
              };
            });
          }
        } else {
          this.allBrands = [];
        }
      },
      (err) => {
        //this.errorMessage = 'Unable to find the category.';
      }
    );
  }

  private actionGetProduct() {
    this.productService.productGet(this.id).subscribe(
      (res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.product = res.data;
          this.fillWithData();
        } else {
          this.product = {};
        }
      },
      (err) => {
        this.errorMessage = "Unable to find the brand.";
      }
    );
  }

  private actionAddProduct(data) {
    this.productService.productAdd(data).subscribe(
      (res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.errorMessage = "";
          this.successMessage = "Product Added Successfully";
        } else {
          this.errorMessage = "Unable to add product with the provided fields.";
        }
        this.loading = false;
        this.resetForm();
        this.responses = [];
      },
      (err) => {
        this.successMessage = "";
        this.errorMessage = err
          ? err
          : "Unable to add product with the provided fields.";
        this.loading = false;
      }
    );
  }

  private actionEditProduct(data) {
    this.productService.productEdit(this.id,data).subscribe(
      (res: HttpBasicResponse) => {
        if (isSuccessResponse(res)) {
          this.errorMessage = "";
          this.successMessage = "Product Update Successfully";
        } else {
          this.errorMessage = "Unable to update product with the provided fields.";
        }
        this.loading = false;
        //this.resetForm();
        this.responses = [];
      },
      (err) => {
        this.successMessage = "";
        this.errorMessage = err
          ? err
          : "Unable to upload product with the provided fields.";
        this.loading = false;
      }
    );
  }


  resetForm(){

    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['products/add']);
  });
    


  }

  // private actionEditBrand(data) {
  //   this.brandService.brandEdit(this.id, data).subscribe((res: HttpBasicResponse) => {
  //       if (isSuccessResponse(res)) {
  //         this.errorMessage = '';
  //         this.successMessage = 'Category Updated Successfully';
  //       } else {
  //         this.errorMessage = 'Unable to update category with the provided fields. Please check your fields.';
  //       }
  //       this.loading = false;
  //     },
  //     (err) => {
  //       this.successMessage = '';
  //       this.errorMessage = err ? err : 'Unable to update category with the provided fields.';
  //       this.loading = false;
  //     });
  // }

  uploadFile(file, index = -1) {
    const uploadData = new FormData();
    uploadData.append("file", file, file.name);
    uploadData.append("upload_type", "user");
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
    if (this.edit) {
      this.editImages.splice(index, 1);
    }

    this.responses.splice(index, 1);

    if (data.delete_token) {
      const url = `https://api.cloudinary.com/v1_1/${
        this.cloudinary.config().cloud_name
      }/delete_by_token`;
      const headers = new Headers({
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      });
      const options = { headers: headers };
      const body = {
        token: data.delete_token,
      };
      this.http.post(url, body, options).subscribe((response) => {
        console.log(`Deleted image - ${data.public_id} ${response.result}`);
        // Remove deleted item for responses
        this.responses.splice(index, 1);
      });
    }
  };

  // fileOverBase(e: any): void {
  //   this.hasBaseDropZoneOver = e;
  // }

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties).map((key) => ({
      key: key,
      value: fileProperties[key],
    }));
  }

  onAttributeSelect(item: any) {
    this.variationSelectedDropdown = [];
    this.clearVariationForm();
  }
  onAttributeDeSelect(item: any) {
    this.variationSelectedDropdown = [];
    this.clearVariationForm();
  }

  onAddVariationItem(data:string,index){
    //this.count++;
    this.attributeSelectedDropdown[index].values.push({"id": Math.random(),"itemName":data,"parent_name":this.attributeSelectedDropdown[index].itemName,"parent_id":this.attributeSelectedDropdown[index].id});
    this.variationSelectedDropdown.push({"id": Math.random(),"itemName":data,"parent_name":this.attributeSelectedDropdown[index].itemName,"parent_id":this.attributeSelectedDropdown[index].id});
    this.updateVariation();
  }

  onVariationSelect(item: any) {
    this.updateVariation();
    
  }
  onVariationDeSelect(item: any) {
    this.t.removeAt(this.t.value.findIndex(image => image.attribute[0].id === item.id))

  }

  onVariationSelectAll(items: any) {
    this.updateVariation();
  }
  onVariationDeSelectAll(items: any) {
   this.clearVariationForm();
  }


  clearVariationForm(){
    while (this.t.length) {
      this.t.removeAt(0);
   }
  }


  onChangeProduct(value){

    if(value=="simple"){
      this.variationproductType = false;
      //Dynamic Validation Change

      this.form.controls.price.setValidators([Validators.required, CustomValidators.number,CustomValidators.min(0)]);
      this.form.controls.stock_quantity.setValidators([Validators.required, CustomValidators.digits]);
      console.log(this.t);
      for(let i=0;i<this.t.controls.length;i++){
      this.t.controls[i]['controls']['attribute'].setValidators(null);
      this.t.controls[i]['controls']['price'].setValidators(null);
      this.t.controls[i]['controls']['manage_stock'].setValidators(null);
      this.t.controls[i]['controls']['stock_quantity'].setValidators(null);

      this.t.controls[i]['controls']['attribute'].setErrors(null);
      this.t.controls[i]['controls']['price'].setErrors(null);
      this.t.controls[i]['controls']['manage_stock'].setErrors(null);
      this.t.controls[i]['controls']['stock_quantity'].setErrors(null);

      }

    }else{
      this.variationproductType = true;
      //Dynamic Validation Change
      this.form.controls.price.setValidators(null);
      this.form.controls.stock_quantity.setValidators(null);
      this.form.controls['price'].setErrors(null);
      this.form.controls['stock_quantity'].setErrors(null);
      for(let i=0;i<this.t.controls.length;i++){
        this.t.controls[i]['controls']['attribute'].setValidators([Validators.required]);
        this.t.controls[i]['controls']['price'].setValidators([Validators.required,CustomValidators.number,CustomValidators.min(0)]);
        this.t.controls[i]['controls']['manage_stock'].setValidators([Validators.required]);
        this.t.controls[i]['controls']['stock_quantity'].setValidators([Validators.required,CustomValidators.digits]);

      }
    }

    this.form.updateValueAndValidity();

  }

    


  updateVariation(){

    let attributeName = this.variationSelectedDropdown[0].parent_name;
    let option = [];
    for (let i = this.t.length; i < this.variationSelectedDropdown.length; i++) {

      console.log(this.variationSelectedDropdown[i]);
      let name = [{
        id : this.variationSelectedDropdown[i].parent_id,
        name: this.variationSelectedDropdown[i].parent_name,
        option: this.variationSelectedDropdown[i].itemName      
      }]

    this.t.push(this.fb.group({
      attribute: [name, Validators.required],
      price: ['', [Validators.required,CustomValidators.number,CustomValidators.min(0)]],
      manage_stock: [true, [Validators.required]],
      stock_quantity: [0, [Validators.required,CustomValidators.digits]]
    }));

    option.push(this.variationSelectedDropdown[i].itemName);


  }


  // this.a.push(this.fb.group({
  //   name: [attributeName, Validators.required],
  //   visible: [true, [Validators.required]],
  //   variation: [true, [Validators.required]],
  //   options: [option]
  // }));

  }

 
  


}
