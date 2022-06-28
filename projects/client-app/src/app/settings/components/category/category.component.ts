import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryType } from '../../../../constants/category-type';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  id: string;
  editMode: boolean;
  form: FormGroup;
  nameFormControl = new FormControl(null, [Validators.required]);
  categoryTypeFormControl = new FormControl(null, [Validators.required]);
  categoryTypeSource = CategoryType;

  @Input() model: Category;

  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<Category> = new EventEmitter<Category>();

  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(
        new Category(
          this.nameFormControl.value,
          this.categoryTypeFormControl.value,
          this.model.id
        )
      );
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onReset(): void {
    this.form.reset();
  }

  getErrorMessage() {
    if (this.nameFormControl.hasError('required')) {
      return 'You must enter a value';
    }
    return 'Not a valid value';
  }

  private initForm(): void {
    if (this.model && this.model.id !== '') {
      this.editMode = true;
      this.nameFormControl.setValue(this.model.name);
      this.categoryTypeFormControl.setValue(this.model.categoryType);
    }

    this.form = new FormGroup({
      name: this.nameFormControl,
      categoryType: this.categoryTypeFormControl
    });
  }
}
