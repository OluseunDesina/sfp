import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss']
})
export class DepartmentCreateComponent implements OnInit {
  isLoading = false;

  title = "Create Department";
  departmentForm: FormGroup = new FormGroup({})

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.errorService.getErrorListener()
    .subscribe(() => {
      this.isLoading = false
    })
    this.departmentForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  onSave() {
    this.isLoading = true;
    this.userService.createDepartment(this.departmentForm.value)
  }

}
