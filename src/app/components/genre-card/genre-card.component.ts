import { Component } from "@angular/core";

@Component({
  selector: "hb-genre-card",
  templateUrl: "./genre-card.component.html",
  styleUrls: ["./genre-card.component.less"]
})
export class GenreCardComponent {
  genres = ["pop", "rap", "rock", "classic"];
  item = "pop";
}
