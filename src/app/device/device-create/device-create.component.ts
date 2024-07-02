import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-device-create',
  templateUrl: './device-create.component.html',
  styleUrls: ['./device-create.component.scss']
})
export class DeviceCreateComponent implements OnInit {
  isLoading = false;

  title = "Create Device";
  deviceForm: FormGroup = new FormGroup({})
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService,
    private dialogRef: MatDialogRef<DeviceCreateComponent>
  ) { }

  ngOnInit(): void {
    this.errorService.getErrorListener()
    .subscribe((errorMessage) => {
      this.errorMessage = errorMessage
      this.isLoading = false;
    })
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      device_id	: ['', Validators.required],
      device_code: ['', Validators.required],
      is_active: [true, Validators.required],
    })
  }

  onSave() {
    this.isLoading = true;
    this.userService.createDevice(this.deviceForm.value, this.dialogRef)
  }

}
