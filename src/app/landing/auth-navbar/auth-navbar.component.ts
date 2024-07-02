import { Component, Input, OnInit } from '@angular/core';
import { LoginComponent } from "../../auth/login/login.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})
export class AuthNavbarComponent implements OnInit {

  @Input('showNav') showNav: boolean

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: "600px",
      closeOnNavigation: true,
      // disableClose: true,
      hasBackdrop: true,
      panelClass: "login-dialog",
    });

    dialogRef.afterClosed()
    .subscribe((result) => {
      // refresh view
    });
  }

}
