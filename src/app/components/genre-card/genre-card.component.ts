import { Component, Input } from "@angular/core";
import { CategoryModel } from "src/app/models/new-api-models/category.model";

@Component({
  selector: "hb-genre-card",
  templateUrl: "./genre-card.component.html",
  styleUrls: ["./genre-card.component.less"]
})
export class GenreCardComponent {
  @Input() public genre!: CategoryModel;
}
