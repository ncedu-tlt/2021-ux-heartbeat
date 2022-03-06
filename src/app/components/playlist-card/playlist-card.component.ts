import { Component, Input } from "@angular/core";
import { GenreCardComponent } from "src/app/components/genre-card/genre-card.component";

@Component({
  selector: "hb-playlist-card",
  templateUrl: "./playlist-card.component.html",
  styleUrls: ["./playlist-card.component.less"]
})
export class PlaylistCardComponent {
  genres: GenreCardComponent[] = [];
  @Input() public genre = GenreCardComponent;

  constructor(public genreCardComponent: GenreCardComponent) {}
}
