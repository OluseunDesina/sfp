import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceCreateComponent } from './device-create/device-create.component';
import { DeviceListComponent } from './device-list/device-list.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceListComponent
  },
  {
    path: 'device-create',
    component: DeviceCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }
