import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  // dataSource: any[] = ;
  private pageSize: number;
  private pageIndex: number;
  tableLoading: boolean = true;
  dataSource = new MatTableDataSource([]);
  title = "Vendors List";
  displayedColumns: any[] = [
    "position",
    "bussiness_name",
    "email",
    "account_info",
    "balance",
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
          balance: element.user.balance,
          email: element.user.email,
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
