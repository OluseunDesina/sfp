import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { CompanyCreateComponent } from "./company/company-create/company-create.component";
import { CompanyListComponent } from "./company/company-list/company-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CompanyAdminCreateComponent } from "./company-admin/company-admin-create/company-admin-create.component";
import { CompanyAdminListComponent } from "./company-admin/company-admin-list/company-admin-list.component";
import { AccountantCreateComponent } from "./accountant/accountant-create/accountant-create.component";
import { AccountantListComponent } from "./accountant/accountant-list/accountant-list.component";
import { StaffCreateComponent } from "./staff/staff-create/staff-create.component";
import { StaffListComponent } from "./staff/staff-list/staff-list.component";
import { UserGroupListComponent } from "./user-group/user-group-list/user-group-list.component";
import { UserGroupCreateComponent } from "./user-group/user-group-create/user-group-create.component";
import { DepartmentListComponent } from "./department/department-list/department-list.component";
import { DepartmentCreateComponent } from "./department/department-create/department-create.component";
import { VendorCreateComponent } from "./vendor/vendor-create/vendor-create.component";
import { VendorListComponent } from "./vendor/vendor-list/vendor-list.component";
import { VendorStaffListComponent } from "./vendor-staff/vendor-staff-list/vendor-staff-list.component";
import { VendorStaffCreateComponent } from "./vendor-staff/vendor-staff-create/vendor-staff-create.component";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper/";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { SharedModule } from "../shared/shared.module";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AdminComponent } from "./admin/admin.component";
import { BulkEmployeeUploadComponent } from "./bulk-employee-upload/bulk-employee-upload.component";
import { StaffLevelCreateComponent } from "./staff/staff-level-create/staff-level-create.component";
import { StaffLevelListComponent } from "./staff/staff-level-list/staff-level-list.component";
import { MatMenuModule } from "@angular/material/menu";
import { EditAccountDetailsComponent } from './vendor/edit-account-details/edit-account-details.component';
import { MatDialogModule } from "@angular/material/dialog";
import { VendorRatingListComponent } from './vendor/vendor-rating-list/vendor-rating-list.component';

@NgModule({
  declarations: [
    CompanyCreateComponent,
    CompanyListComponent,
    CompanyAdminCreateComponent,
    CompanyAdminListComponent,
    AccountantCreateComponent,
    AccountantListComponent,
    StaffCreateComponent,
    StaffListComponent,
    UserGroupListComponent,
    UserGroupCreateComponent,
    DepartmentListComponent,
    DepartmentCreateComponent,
    VendorCreateComponent,
    VendorListComponent,
    VendorStaffListComponent,
    VendorStaffCreateComponent,
    AdminComponent,
    BulkEmployeeUploadComponent,
    StaffLevelCreateComponent,
    StaffLevelListComponent,
    EditAccountDetailsComponent,
    VendorRatingListComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    NgxIntlTelInputModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule
  ],
})
export class UserModule { }
