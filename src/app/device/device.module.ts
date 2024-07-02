import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceCreateComponent } from './device-create/device-create.component';
import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceCreateComponent,
  ],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    SharedModule,
    MatTableModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class DeviceModule { }
