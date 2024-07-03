import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-carterer-list',
  templateUrl: './carterer-list.component.html',
  styleUrls: ['./carterer-list.component.scss']
})
export class CartererListComponent implements OnInit {
  tableLoading: boolean = true;
  title = "Caterer List";
  dataSource: any[] = [];
  displayedColumns: any[] = [
    "name",
    "nin",
    "date_created",
    "address",
    "city",
    "state",
    "lga",
    "ward",
    "status",
    "star",
  ];
  expandedElement: any;
  length: number;
  pageSize: number;
  pageIndex: number;

  isStaff: boolean;
  isSid: boolean;
  isComp: boolean;
  isVend: boolean;
  isAcct: boolean;

  searchPlaceHolder: string = "Search by User email or Phone";
  downloading: boolean;

  constructor(
    private userService: UserService,
    private helperService: HelperService,
    // private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUserGroup();
    this.getCatererList();
  }

  getUserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        break;
      case "ven":
        this.isVend = true;
        break;
      case "cmp_adm":
        this.isComp = true;
        break;
      case "cmp_act":
        this.isAcct = true;
        break;
      case "sid":
        this.isSid = true;
        break;

      default:
        break;
    }
  }

  onSearch(value) {
    if (value) {
      this.userService.seaarchStaffList(value, this.pageSize, this.pageIndex);
    } else {
      this.getCatererList();
    }
  }

  getCatererList() {
    this.userService.getCatererList(this.pageSize, this.pageIndex)
    // this.userService.getStaffListUpdate()
    .subscribe((students) => {
      this.dataSource = students.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = students.count;
      this.tableLoading = false;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number; }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getCatererList();
  }

  deactivateUser(user) {
    this.tableLoading = true;
    user.is_active = !user.is_active;
    this.userService.deactivateUser(user).subscribe(() => {
      this.getCatererList();
    });
  }

  onEditUser(user) {
    // this.dialog
    //   .open(StaffCreateComponent, { data: user })
    //   .afterClosed()
    //   .subscribe(() => {
    //     this.getStaffList();
    //   });
  }

  onExportExcel() {
    this.downloading = !this.downloading;
    let data;
    this.userService.downloadStaffList(this.length, this.pageIndex).subscribe(
      (res) => {
        data = res.results.map((element) => {
          return {
            name: `${element.first_name} ${element.last_name}`,
            department: element.department,
            email: element.email,
            phone_number: `${element.phone_number}`,
            balance: `${element.balance}`,
            staff_level: element.staff_level,
            last_login: element.last_login,
          };
        });
        this.helperService.exportExcel(
          data,
          "staff-list",
          this.displayedColumns
        );
        this.downloading = !this.downloading;
      },
      (err) => { }
    );
  }
}