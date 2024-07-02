import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  shareReplay,
  switchMap,
} from "rxjs/operators";

@Component({
  selector: "app-table-functions",
  templateUrl: "./table-functions.component.html",
  styleUrls: ["./table-functions.component.scss"],
})
export class TableFunctionsComponent implements OnInit {
  @Input("downloading") downloading: boolean = false;
  @Input("hideDownload") hideDownload: boolean = false;
  @Input("mealTypeArray") mealTypeArray;
  @Input("companyArray") companyArray;
  @Input("rangePicker") rangePicker: boolean = false;
  @Input("datePicker") datePicker: boolean = false;
  @Input("vendorArray") vendorArray;
  @Input("statusArray") statusArray;
  @Input("showSearch") showSearch: boolean = false;
  @Input("searchPlaceHolder") searchPlaceHolder: boolean = false;
  @Output("exportExcel") exportExcel = new EventEmitter();
  @Output("companyChange") companyChange = new EventEmitter();
  @Output("mealTypeChange") mealTypeChange = new EventEmitter();
  @Output("vendorChange") vendorChange = new EventEmitter();
  @Output("statusChange") statusChange = new EventEmitter();
  @Output("setStartDate") setStartDate = new EventEmitter();
  @Output("setEndDate") setEndDate = new EventEmitter();
  @Output("setDate") setDate = new EventEmitter();
  @Output("search") search = new EventEmitter();
  searchText$ = new Subject<string>();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  searchText: string = "";

  constructor() {}

  ngOnInit(): void {}

  onMealTypeChange(value) {
    this.mealTypeChange.emit(value);
  }

  onCompanyChange(value) {
    this.companyChange.emit(value);
  }

  onVendorChange(value) {
    this.vendorChange.emit(value);
  }

  onStatusChange(value) {
    this.statusChange.emit(value);
  }

  onSetStartDate(value) {
    this.setStartDate.emit(value);
  }

  onSetEndDate(value) {
    this.setEndDate.emit(value);
  }

  onSetDate(value) {
    this.setDate.emit(value);
  }

  onExportExcel() {
    this.exportExcel.emit(this.downloading);
  }

  onSearch() {
    this.searchText$
      .pipe(debounceTime(1000), distinctUntilChanged(), shareReplay())
      .subscribe(() => {
        this.search.emit(this.searchText);
      });
  }

  onSearchTextChange() {
    if (this.searchText == "") {
      this.onSearch();
    }
  }

  onTextChange() {
    this.searchText$.next(this.searchText);
    this.onSearch();
  }
}
