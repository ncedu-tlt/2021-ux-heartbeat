import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "hb-search-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.less"]
})
export class SearchPageComponent {
  key: string;
  constructor(private activatedRoute: ActivatedRoute) {
    this.key = <string>this.activatedRoute.snapshot.queryParams["keyword"];
  }
}
