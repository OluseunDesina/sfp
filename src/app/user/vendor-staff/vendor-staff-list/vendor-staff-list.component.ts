import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UserService } from "../../user.service";

@Component({
  selector: "app-vendor-staff-list",
  templateUrl: "./vendor-staff-list.component.html",
  styleUrls: ["./vendor-staff-list.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class VendorStaffListComponent implements OnInit, AfterViewInit {
  // dataSource: any[] = ;
  private pageSize: number;
  private pageIndex: number;
  tableLoading: boolean = true;
  dataSource = new MatTableDataSource([]);
  title = "Vendors List";
  displayedColumns: any[] = [
    // "position",
    "name",
    "email",
    // "account_info",
    // "balance",
    "star",
  ];
  expandedElement: any;
  length: number;

  constructor(private userService: UserService) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getVendorStaffs();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getVendorStaffs() {
    this.userService.getVendorStaffs(this.pageSize, this.pageIndex);
    this.userService.getVendorStaffsUpdate().subscribe((vendorStaffs) => {
      const data = vendorStaffs.results.map((element, index) => {
        return {
          ...element,
          position: index + 1,
          // balance: element?.user?.balance,
          // email: element?.user?.email,
        };
      });
      // this.dataSource = new MatTableDataSource(data);
      this.tableLoading = false;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.length = vendorStaffs.count;
    });
  }

  pageChange(value: {pageSize: number, pageIndex: number}) {
    this.tableLoading = true;
    this.pageSize = value.pageSize
    this.pageIndex = value.pageIndex
    this.getVendorStaffs()
  }
}
