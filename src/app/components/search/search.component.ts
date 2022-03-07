import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "hb-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.less"]
})
export class SearchComponent {
  public search = "";

  constructor(private router: Router) {}

  searchBtnClicked() {
    this.search = this.search.trim();
    this.router.navigateByUrl(`/search?keyword=${this.search}`);
  }
}
