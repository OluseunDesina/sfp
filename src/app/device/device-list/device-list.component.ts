import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "src/app/user/user.service";
import { DeviceCreateComponent } from "../device-create/device-create.component";

@Component({
  selector: "app-device-list",
  templateUrl: "./device-list.component.html",
  styleUrls: ["./device-list.component.scss"],
})
export class DeviceListComponent implements OnInit {
  private pageSize: number;
  private pageIndex: number;
  length: number;
  tableLoading: boolean = true;
  deviceList: any[] = [];
  displayedColumns: any[] = [
    // "position",
    "device_name",
    "device_id",
    "device_code",
    "location",
    "is_active",
    // "star",
  ];
  expandedElement: any;

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDeviceList();
    this.userService.getIsLoadingListener().subscribe((isLoading) => {
      isLoading ? null : this.getDeviceList();
    });
  }

  openCreateCategoryDialog(data = null) {
    const dialogRef = this.dialog.open(DeviceCreateComponent, {
      data: data,
      width: "80%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDeviceList();
    });
  }

  getDeviceList() {
    this.userService.getDeviceList(this.pageSize, this.pageIndex);
    this.userService.getDeviceListUpdate().subscribe((deviceList) => {
      this.deviceList = deviceList.results;
      // this.deviceList = deviceList.results.map((element, index) => {
      //   return { ...element, position: index + 1 };
      // });
      this.tableLoading = false;
      this.length = deviceList.count;
    });
  }

  onActivateDevice(device) {
    this.userService.activateDevice(device);
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getDeviceList();
  }
}
