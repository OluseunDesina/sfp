import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { NotificationService } from "src/app/shared/services/notification.service";
import { environment } from "../../environments/environment";
import { PaginatedResponse } from "../shared/models/response.model";
import { ErrorService } from "../shared/services/error.service";
import { AuthService } from "../../app/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.url;
  private companyList: PaginatedResponse = new PaginatedResponse();
  private companysListener = new Subject<PaginatedResponse>();
  private deviceList: PaginatedResponse = new PaginatedResponse();
  private devicesListener = new Subject<PaginatedResponse>();
  private companyAdminList: PaginatedResponse = new PaginatedResponse();
  private companyAdminListener = new Subject<PaginatedResponse>();
  private accountantList: PaginatedResponse = new PaginatedResponse();
  private accountantListener = new Subject<PaginatedResponse>();
  private staffs: PaginatedResponse = new PaginatedResponse();
  private staffsListener = new Subject<PaginatedResponse>();
  private staffsCreateErrorListener = new Subject<any[]>();
  private staffLevels: PaginatedResponse = new PaginatedResponse();
  private staffLevelsListener = new Subject<PaginatedResponse>();
  private departments: PaginatedResponse = new PaginatedResponse();
  private departmentsListener = new Subject<PaginatedResponse>();
  private vendors: PaginatedResponse = new PaginatedResponse();
  private vendorsListener = new Subject<PaginatedResponse>();
  private vendorStaffs = new PaginatedResponse();
  private vendorStaffsListener = new Subject<PaginatedResponse>();
  private isLoadingListener = new Subject<boolean>();
  private deactivatingListener = new Subject<boolean>();
  private ratingsListener = new Subject<PaginatedResponse>();
  private ratings: PaginatedResponse = new PaginatedResponse();
  private students!: PaginatedResponse;
  private studentsListener = new Subject<PaginatedResponse>();
  private schools!: PaginatedResponse;
  private schoolsListener = new Subject<PaginatedResponse>();
  private farmers!: PaginatedResponse;
  private farmersListener = new Subject<PaginatedResponse>();
  private caterers!: PaginatedResponse;
  private caterersListener = new Subject<PaginatedResponse>();


  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private errorService: ErrorService
  ) { }

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  updateVendor(formData) {
    return this.http
      .patch(`${this.apiUrl}auth/vendor/${formData.id}/`, formData)
      .pipe(shareReplay());
    // dialogRef.close();
  }

  getCompanyList(pageSize = 10, pageIndex = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/companys/${query}`)
      .subscribe(
        (res) => {
          this.companyList = res;
          this.companysListener.next({ ...this.companyList });
        },
        (err) => { }
      );
  }

  getCompanyListUpdate() {
    return this.companysListener.asObservable();
  }

  createCompany(formData) {
    this.isLoadingListener.next(true);
    this.http
      .post(`${this.apiUrl}auth/companys/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.isLoadingListener.next(false);
          this.notificationService.success(
            `Success`,
            `Company onboard successful`
          );
          this.router.navigate(["/user/company-list"]);
        },
        (err) => {
          const errorMessage =
            err.error.message || err.error.details || err.error.error;
          this.notificationService.danger(`Error`, errorMessage);
          this.isLoadingListener.next(false);
          this.errorService.handleError(errorMessage);
        }
      );
  }

  getDeviceList(pageSize = 10, pageIndex = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/devices/${query}`)
      .subscribe(
        (res) => {
          this.deviceList = res;
          this.devicesListener.next({ ...this.deviceList });
        },
        (err) => { }
      );
  }

  getDeviceListUpdate() {
    return this.devicesListener.asObservable();
  }

  activateDevice(device) {
    this.isLoadingListener.next(true);
    this.http
      .patch(`${this.apiUrl}auth/devices/${device.id}/`, device)
      .subscribe(
        (response: any) => {
          this.isLoadingListener.next(false);
          this.notificationService.success("Success", response.message);
        },
        (err) => {
          this.notificationService.danger("Error", err.error.message);
          this.isLoadingListener.next(false);
        }
      );
  }

  createDevice(formData, dialogRef) {
    this.isLoadingListener.next(true);
    // const company = this.hel
    this.http
      .post(`${this.apiUrl}auth/devices/`, { ...formData })
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.isLoadingListener.next(false);
          this.notificationService.success(
            `Success`,
            `Device onboard successful`
          );
          dialogRef.close();
        },
        (err) => {
          const errorMessage =
            err.error.message ||
            err.error.details ||
            err.error.error ||
            `device code: ${err.error.device_code[0]}` ||
            `name: ${err.error.name[0]}` ||
            `device id: ${err.error.device_id[0]}` ||
            `${err.error.is_active[0]}` ||
            err.error.company[0] ||
            err.error.location[0];
          // this.notificationService.danger(`Error`, errorMessage);
          this.isLoadingListener.next(false);
          this.errorService.handleError(errorMessage);
        }
      );
  }

  uploadStaff(employees) {
    this.http
      .post(`${this.apiUrl}auth/bulk-employee/`, employees)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.isLoadingListener.next(false);
          this.notificationService.success(
            `Successful`,
            `User(s) account created`
          );
          this.router.navigate(["/user/staff-list"]);
        },
        (err) => {
          this.staffsCreateErrorListener.next(err.error);
          // this.notificationService.danger(`Error`, `An unknown error occured`);
          this.isLoadingListener.next(false);
          this.errorService.handleError(err.error.message || err.error.details);
        }
      );
  }

  deactivateUser(user) {
    // TODO: refactor code to take either phone or email
    this.http
      .post(`${this.apiUrl}auth/change-user-status/`, {
        user_email: user.email || user.phone_number,
        status: user.is_active,
      })
      .subscribe(
        (response: any) => {
          this.notificationService.success("Success", response.message);
          this.deactivatingListener.next(true);
        },
        (err) => {
          this.notificationService.danger("Error", err.error.message);
          this.deactivatingListener.next(true);
        }
      );
    return this.deactivatingListener.asObservable();
  }

  toggleCashHold(user) {
    this.http
      .patch(`${this.apiUrl}auth/vendor/${user.user.id}/`, {
        cash_hold: user.cash_hold,
      })
      .subscribe(
        (response: any) => {
          this.notificationService.success("Success", response.message);
          this.deactivatingListener.next(true);
        },
        (err) => {
          this.notificationService.danger("Error", err.error.message);
          this.deactivatingListener.next(true);
        }
      );
    return this.deactivatingListener.asObservable();
  }

  toggleScan(vendor) {
    this.http
      .patch(`${this.apiUrl}auth/vendor/${vendor.user.id}/`, {
        is_allow_any_day_ticket_scan: vendor.is_allow_any_day_ticket_scan,
      })
      .subscribe(
        (response: any) => {
          console.log(vendor);
          console.log(vendor.is_allow_any_day_ticket_scan);
          this.notificationService.success("Success", response.message);
          this.deactivatingListener.next(true);
        },
        (err) => {
          this.notificationService.danger("Error", err.error.message);
          this.deactivatingListener.next(true);
        }
      );
    return this.deactivatingListener.asObservable();
  }

  getStaffCreationErrorUpdate() {
    return this.staffsCreateErrorListener.asObservable();
  }

  getCompanyAdminList(pageSize = 10, pageIndex = 1, company) {
    const query = `?limit=${pageSize}&offset=${pageIndex}&${company ? "&company=" + company : ""
      }`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/cmp-adm/${query}`)
      .subscribe(
        (res) => {
          this.companyAdminList = res;
          this.companyAdminListener.next({ ...this.companyAdminList });
        },
        (err) => { }
      );
  }

  getCompanyAdminListUpdate() {
    return this.companyAdminListener.asObservable();
  }

  createCompanyAdmin(formData) {
    this.isLoadingListener.next(true);
    this.http
      .post(`${this.apiUrl}auth/cmp-adm/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response: any) => {
          this.notificationService.success(response.status, response.message);
          this.router.navigate(["/user/company-admin-list"]);
          this.isLoadingListener.next(false);
        },
        (err) => {
          this.notificationService.danger(`Error`, `An unknown error occured`);
          this.isLoadingListener.next(false);
          this.errorService.handleError(err.error.message || err.error.details);
        }
      );
  }

  getAccountantList(pageSize = 10, pageIndex = 1, company) {
    const query = `?limit=${pageSize}&offset=${pageIndex}&${company ? "&company=" + company : ""
      }`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/cmp-act/${query}`)
      .subscribe(
        (res) => {
          this.accountantList = res;
          this.accountantListener.next({ ...this.accountantList });
        },
        (err) => { }
      );
  }

  getAccountantUpdate() {
    return this.accountantListener.asObservable();
  }

  createAccountant(formData) {
    this.http
      .post(`${this.apiUrl}auth/cmp-act/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response: { status: string; message: string; }) => {
          this.notificationService.success(response.status, response.message);
          this.router.navigate(["/user/accountant-list"]);
        },
        (err) => {
          this.notificationService.danger(`Error`, `An unknown error occured`);
          // this.errorService.handleError(err.error.message);
          this.errorService.handleError(err.error.message || err.error.details);
        }
      );
  }

  getStaffList(pageSize: number = 10, pageIndex: number = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/staffs/${query}`)
      .subscribe(
        (res) => {
          this.staffs = res;
          this.staffsListener.next({ ...this.staffs });
        },
        (err) => { }
      );
  }

  getFarmerList(pageSize: number = 10, pageIndex: number = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/fgn_farmers/${query}`)
      // .get<PaginatedResponse>(`${this.apiUrl}auth/fgn_students`)
      .subscribe(
        (res) => {
          this.farmers = res;
          this.farmersListener.next({ ...this.farmers });
        },
        (err) => {
          this.farmersListener.next(new PaginatedResponse())
        }
      );

      return this.farmersListener.asObservable()
  }

  uploadFarmer(employees) {
    this.http
      .post(`${this.apiUrl}auth/bulk_fgn_users/`, {...employees, sector: 'farmer'})
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.isLoadingListener.next(false);
          this.notificationService.success(
            `Successful`,
            `Farmer(s) created`
          );
          this.router.navigate(["/user/farmer-list"]);
        },
        (err) => {
          this.staffsCreateErrorListener.next(err.error);
          // this.notificationService.danger(`Error`, `An unknown error occured`);
          this.isLoadingListener.next(false);
          this.errorService.handleError(err.error.message || err.error.details);
        }
      );
  }

  getCatererList(pageSize: number = 10, pageIndex: number = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/fgn_caterers/${query}`)
      // .get<PaginatedResponse>(`${this.apiUrl}auth/fgn_students`)
      .subscribe(
        (res) => {
          this.caterers = res;
          this.caterersListener.next({ ...this.caterers });
        },
        (err) => {
          this.caterersListener.next(new PaginatedResponse())
        }
      );

      return this.caterersListener.asObservable()
  }

  uploadCarterer(employees) {
    this.http
      .post(`${this.apiUrl}auth/bulk_fgn_users/`, {...employees, sector: 'caterer'})
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.isLoadingListener.next(false);
          this.notificationService.success(
            `Successful`,
            `Carterer(s) created`
          );
          this.router.navigate(["/user/caterer-list"]);
        },
        (err) => {
          this.staffsCreateErrorListener.next(err.error);
          // this.notificationService.danger(`Error`, `An unknown error occured`);
          this.isLoadingListener.next(false);
          this.errorService.handleError(err.error.message || err.error.details);
        }
      );
  }

  getSchoolList(pageSize: number = 10, pageIndex: number = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/fgn_schools/${query}`)
      // .get<PaginatedResponse>(`${this.apiUrl}auth/fgn_students`)
      .subscribe(
        (res) => {
          this.schools = res;
          this.schoolsListener.next({ ...this.schools });
        },
        (err) => {
          this.schoolsListener.next(new PaginatedResponse())
        }
      );

      return this.schoolsListener.asObservable()
  }

  uploadSchools(employees) {
    this.http
      .post(`${this.apiUrl}auth/bulk_fgn_users/`, {...employees, sector: 'school'})
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.isLoadingListener.next(false);
          this.notificationService.success(
            `Successful`,
            `School(s) created`
          );
          this.router.navigate(["/user/school-list"]);
        },
        (err) => {
          this.staffsCreateErrorListener.next(err.error);
          // this.notificationService.danger(`Error`, `An unknown error occured`);
          this.isLoadingListener.next(false);
          this.errorService.handleError(err.error.message || err.error.details);
        }
      );
  }

  getStudentList(pageSize: number = 10, pageIndex: number = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/fgn_students/${query}`)
      // .get<PaginatedResponse>(`${this.apiUrl}auth/fgn_students`)
      .subscribe(
        (res) => {
          this.students = res;
          this.studentsListener.next({ ...this.students });
        },
        (err) => {
          this.studentsListener.next(new PaginatedResponse())
        }
      );

      return this.studentsListener.asObservable()
  }

  uploadStudent(employees) {
    this.http
      .post(`${this.apiUrl}auth/bulk_fgn_users/`, {...employees, sector: 'student'})
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.isLoadingListener.next(false);
          this.notificationService.success(
            `Successful`,
            `User(s) account created`
          );
          this.router.navigate(["/user/student-list"]);
        },
        (err) => {
          this.staffsCreateErrorListener.next(err.error);
          // this.notificationService.danger(`Error`, `An unknown error occured`);
          this.isLoadingListener.next(false);
          this.errorService.handleError(err.error.message || err.error.details);
        }
      );
  }

  downloadStaffList(pageSize: number, pageIndex: number = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    return this.http.get<PaginatedResponse>(
      `${this.apiUrl}auth/staffs/${query}`
    );
  }

  seaarchStaffList(search, pageSize: number = 10, pageIndex: number = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}&search=${search}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/staffs/${query}`)
      .subscribe(
        (res) => {
          this.staffs = res;
          this.staffsListener.next({ ...this.staffs });
        },
        (err) => { }
      );
  }

  getStaffListUpdate() {
    return this.staffsListener.asObservable();
  }

  createStaff(formData) {
    this.http
      .post(`${this.apiUrl}auth/staffs/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.notificationService.success(
            `Success`,
            `staff account creation successful`
          );
          this.router.navigate(["/staff-list"]);
        },
        (err) => { }
      );
  }

  updateStaff(formData) {
    return this.http
      .patch(`${this.apiUrl}auth/admin-update-user/${formData.id}/`, formData)
      .pipe(shareReplay());
  }

  updateStaffLevel(formData) {
    this.http
      .patch(`${this.apiUrl}auth/staff-level/${formData.id}/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.notificationService.success(
            `Success`,
            `staff Level update successful`
          );
          this.router.navigate(["user/staff-level-list"]);
        },
        (err) => {
          this.errorService.handleError(err.error.message || err.error.details);
          this.notificationService.danger(
            `Error`,
            `Department update was unsuccessful`
          );
          this.notificationService.danger(``, `${err.error.name || err.name}`);
        }
      );
  }

  createStaffLevel(formData) {
    this.http
      .post(`${this.apiUrl}auth/staff-level/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.notificationService.success(
            `Success`,
            `staff Level creation successful`
          );
          this.router.navigate(["user/staff-level-list"]);
        },
        (err) => {
          this.errorService.handleError(err.error.message || err.error.details);
          this.notificationService.danger(
            `Error`,
            `Department creation was unsuccessful`
          );
          this.notificationService.danger(``, `${err.error.name || err.name}`);
        }
      );
  }

  getStaffLevelById(id) {
    return this.http.get<PaginatedResponse>(
      `${this.apiUrl}auth/staff-level/${id}/`
    );
    // .subscribe(
    //   (res) => {
    //   },
    //   (err) => {}
    // );
    // return this.staffLevelsListener.asObservable();
  }

  getStaffLevels() {
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/staff-level/`)
      .subscribe(
        (res) => {
          this.staffLevels = res;
          this.staffLevelsListener.next({ ...this.staffLevels });
        },
        (err) => { }
      );
    return this.staffLevelsListener.asObservable();
  }

  getDepartments(pageSize = 10, pageIndex = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/departments/${query}`)
      .subscribe(
        (res) => {
          this.departments = res;
          this.departmentsListener.next({ ...this.departments });
        },
        (err) => { }
      );
  }

  getDepartmentsUpdate() {
    return this.departmentsListener.asObservable();
  }

  createDepartment(formData) {
    this.http
      .post(`${this.apiUrl}auth/departments/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.notificationService.success(
            `Success`,
            `Department creation successful`
          );
          this.router.navigate(["/user/department-list"]);
        },
        (err) => {
          this.errorService.handleError(err.error.message || err.error.details);
          this.notificationService.danger(
            `Error`,
            `Department creation was unsuccessful`
          );
          this.notificationService.danger(``, `${err.error.name || err.name}`);
        }
      );
  }

  getVendors(pageSize = 10, pageIndex = 1, company = null) {
    const query = `?limit=${pageSize}&offset=${pageIndex}${company ? "&company=" + company : ""
      }`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/vendor/${query}`)
      .subscribe(
        (res) => {
          this.vendors = res;
          this.vendorsListener.next({ ...this.vendors });
        },
        (err) => { }
      );
  }

  getVendorRatings(vendor_id: string, startDate: string, endDate: string, meal_type?: number, pageSize = 10, pageIndex = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}${vendor_id ? "&vendor=" + vendor_id : ""}${startDate ? "&start_date=" + startDate : ""}${endDate ? "&end_date=" + endDate : ""}${meal_type ? "&meal_type=" + meal_type : ""}`;
    this.http.get<PaginatedResponse>(`${this.apiUrl}auth/vendor-rating/${query}`)
      .subscribe((res) => {
        this.ratings = res;
        this.ratingsListener.next({ ...this.ratings });
      },
        (err) => {
          this.ratingsListener.error(err);
        });
  }

  getVendorsUpdate() {
    return this.vendorsListener.asObservable();
  }

  getVendorRatingsUpdate() {
    return this.ratingsListener.asObservable();
  }

  createVendor(formData) {
    this.http
      .post(`${this.apiUrl}auth/vendor/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.notificationService.success(
            `Success`,
            `Vendor account creation successful`
          );
          this.router.navigate(["/user/vendor-list"]);
        },
        (err) => {
          const errorMessage =
            err.error.message || err.error.details || err.error.error;
          this.notificationService.danger(`Error`, errorMessage);
          this.errorService.handleError(errorMessage);
        }
      );
  }

  getVendorStaffs(pageSize = 10, pageIndex = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}auth/vendor-staff/${query}`)
      .subscribe(
        (res) => {
          this.vendorStaffs = res;
          this.vendorStaffsListener.next({ ...this.vendorStaffs });
        },
        (err) => { }
      );
  }

  getVendorStaffsUpdate() {
    return this.vendorStaffsListener.asObservable();
  }

  createVendorStaff(formData) {
    this.http
      .post(`${this.apiUrl}auth/vendor-staff/`, formData)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.notificationService.success(
            `Success`,
            `Vendor account creation successful`
          );
          this.router.navigate(["/user/vendor-staff-list"]);
        },
        (err) => {
          this.notificationService.warning(
            `Error`,
            `Account creation was unsuccessful`
          );
          this.errorService.handleError(err.error.message || err.error.details);
        }
      );
  }
}
