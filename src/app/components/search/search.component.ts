import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "hb-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.less"]
})
export class SearchComponent {
  search = "";
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private router: Router) {}

  searchBtnClicked(val: string) {
    val = val.trim();
    this.router.navigateByUrl(`/search?keyword=${val}`);
  }
}
