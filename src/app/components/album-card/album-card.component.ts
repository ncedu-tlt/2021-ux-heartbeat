import { Component, Input } from "@angular/core";
import { ItemsArtistModel } from "../../models/new-api-models/artist-by-id.model";

@Component({
  selector: "hb-album-card",
  templateUrl: "./album-card.component.html",
  styleUrls: ["./album-card.component.less"]
})
export class AlbumCardComponent {
  @Input() album!: ItemsArtistModel;
}
