import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SearchStateService } from "../../services/search-state.service";

@Component({
  selector: "hb-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.less"]
})
export class SearchComponent {
  public search = "";

  constructor(
    private router: Router,
    private searchStateService: SearchStateService
  ) {}

  searchBtnClicked() {
    this.search = this.search.trim();
    this.searchStateService.setSearchState(this.search);
    this.router.navigateByUrl(`/search?keyword=${this.search}`);
  }
}
