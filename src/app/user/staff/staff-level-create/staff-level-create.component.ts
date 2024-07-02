import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ErrorService } from "src/app/shared/services/error.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "../../user.service";

@Component({
  selector: "app-staff-level-create",
  templateUrl: "./staff-level-create.component.html",
  styleUrls: ["./staff-level-create.component.scss"],
})
export class StaffLevelCreateComponent implements OnInit {
  isLoading = false;

  title = "Create New Level";
  levelForm: FormGroup = new FormGroup({});
  private namePattern = "[a-zA-Z][a-zA-Z ]+[a-zA-Z]$";
  mode: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService,
    private helperService: HelperService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.errorService.getErrorListener().subscribe(() => {
      this.isLoading = false;
    });
    this.levelForm = this.fb.group({
      id: [""],
      name: ["", [Validators.required, Validators.pattern(this.namePattern)]],
      daily_limit: ["", Validators.required],
      company_paid: ["", Validators.required],
    });
    this.checkMode();
  }

  checkMode() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.mode = "edit";
        this.title = "edit staff level";
        const id = paramMap.get("id");
        this.userService.getStaffLevelById(id).subscribe((data: any) => {
          this.levelForm = this.fb.group({
            id: [data.id, Validators.required],
            name: [data.name, Validators.required],
            daily_limit: [data.daily_limit, Validators.required],
            company_paid: [data.company_paid, Validators.required],
          });
        });
        return
      }
      this.mode = "create";
      this.title = "create new level";
      this.levelForm = this.fb.group({
        name: ["", Validators.required],
        daily_limit: ["", Validators.required],
        company_paid: ["", Validators.required],
      });
    });
  }

  onSave() {
    this.isLoading = true;
    if (this.levelForm.invalid) {
      this.helperService.validateAllFormFields(this.levelForm);
      return;
    }

    if (this.mode == "edit") {
      this.updateLevel();
      return;
    }

    this.createLevel();
    this.userService.createStaffLevel(this.levelForm.value);
  }

  createLevel() {
    this.isLoading = true;
    this.userService.createStaffLevel(this.levelForm.value);
  }

  updateLevel() {
    this.isLoading = true;
    this.userService.updateStaffLevel(this.levelForm.value);
  }
}
