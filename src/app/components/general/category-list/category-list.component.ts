import { Component, OnInit, Input, Output, EventEmitter, Directive, ElementRef } from '@angular/core';

@Component({
  selector: 'choose-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})

export class CategoryListComponent {

  @Input() categories;
  @Input() sub;
  @Input() categoryParentId;
  @Output() change: EventEmitter<any> = new EventEmitter();
  mainCategories;

  constructor() {
    if(!this.sub){
      this.sub = '';
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
