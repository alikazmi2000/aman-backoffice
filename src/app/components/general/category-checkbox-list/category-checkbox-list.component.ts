import { Component, OnInit, Input, Output, EventEmitter, Directive, ElementRef } from '@angular/core';

@Component({
  selector: 'choose-category-checkbox-list',
  templateUrl: './category-checkbox-list.component.html',
  //styleUrls: ['./category-list.component.scss']
})

export class CategoryCheckBoxListComponent {

  @Input() categories;
  @Input() sub;
  @Input() categoryParentId;
  @Output() change: EventEmitter<any> = new EventEmitter();
  mainCategories;

  constructor() {
    if(!this.sub){
      this.sub = 0;
    } 
  }

  public ngDoCheck() {
    if(this.categories && !this.mainCategories) {
      this.mainCategories = this.categories.filter(category => category.parentId == this.categoryParentId); 
    }
  }

  public changeCategory(event){
    this.change.emit(event);
  }

}
