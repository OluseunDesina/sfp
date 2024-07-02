import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountantCreateComponent } from "./accountant/accountant-create/accountant-create.component";
import { AccountantListComponent } from "./accountant/accountant-list/accountant-list.component";
import { AdminComponent } from "./admin/admin.component";
import { CompanyAdminCreateComponent } from "./company-admin/company-admin-create/company-admin-create.component";
import { CompanyAdminListComponent } from "./company-admin/company-admin-list/company-admin-list.component";
import { CompanyCreateComponent } from "./company/company-create/company-create.component";
import { CompanyListComponent } from "./company/company-list/company-list.component";
import { DepartmentCreateComponent } from "./department/department-create/department-create.component";
import { DepartmentListComponent } from "./department/department-list/department-list.component";
import { StaffListComponent } from "./staff/staff-list/staff-list.component";
import { UserGroupCreateComponent } from "./user-group/user-group-create/user-group-create.component";
import { UserGroupListComponent } from "./user-group/user-group-list/user-group-list.component";
import { VendorStaffCreateComponent } from "./vendor-staff/vendor-staff-create/vendor-staff-create.component";
import { VendorStaffListComponent } from "./vendor-staff/vendor-staff-list/vendor-staff-list.component";
import { VendorCreateComponent } from "./vendor/vendor-create/vendor-create.component";
import { VendorListComponent } from "./vendor/vendor-list/vendor-list.component";
import { BulkEmployeeUploadComponent } from "./bulk-employee-upload/bulk-employee-upload.component";
import { StaffLevelCreateComponent } from "./staff/staff-level-create/staff-level-create.component";
import { StaffLevelListComponent } from "./staff/staff-level-list/staff-level-list.component";
import { VendorRatingListComponent } from "./vendor/vendor-rating-list/vendor-rating-list.component";
import { StaffCreateComponent } from "./staff/staff-create/staff-create.component";

const routes: Routes = [
  {
    path: "company-create",
    component: CompanyCreateComponent,
  },
  {
    path: "company-list",
    component: CompanyListComponent,
  },
  {
    path: "company-admin-create",
    component: CompanyAdminCreateComponent,
  },
  {
    path: "company-admin-list",
    component: CompanyAdminListComponent,
  },
  {
    path: "accountant-create",
    component: AccountantCreateComponent,
  },
  {
    path: "accountant-list",
    component: AccountantListComponent,
  },
  // {
  //   path: "staff-single-create",
  //   component: StaffCreateComponent,
  // },
  {
    path: "staff-create",
    component: StaffCreateComponent,
  },
  {
    path: "bulk-staff-create",
    component: BulkEmployeeUploadComponent,
  },
  {
    path: "staff-list",
    component: StaffListComponent,
  },
  {
    path: "staff-level-edit/:id",
    component: StaffLevelCreateComponent,
  },
  {
    path: "staff-level-create",
    component: StaffLevelCreateComponent,
  },
  {
    path: "staff-level-list",
    component: StaffLevelListComponent,
  },
  {
    path: "vendor-create",
    component: VendorCreateComponent,
  },
  {
    path: "vendor-list",
    component: VendorListComponent,
  },
  {
    path: "vendor-staff-create",
    component: VendorStaffCreateComponent,
  },
  {
    path: "vendor-staff-list",
    component: VendorStaffListComponent,
  },
  {
    path: "department-create",
    component: DepartmentCreateComponent,
  },
  {
    path: "department-list",
    component: DepartmentListComponent,
  },
  {
    path: "user-group-create",
    component: UserGroupCreateComponent,
  },
  {
    path: "user-group-list",
    component: UserGroupListComponent,
  },
  {
    path: "admin-list",
    component: AdminComponent,
  },
  {
    path: "vendor-rating-list/:id/:vendor_name",
    component: VendorRatingListComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
