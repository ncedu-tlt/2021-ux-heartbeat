import { Component, Input } from "@angular/core";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";

@Component({
  selector: "hb-round-artist-card",
  templateUrl: "./round-artist-card.component.html",
  styleUrls: ["./round-artist-card.component.less"]
})
export class RoundArtistCardComponent {
  @Input() public artist!: ArtistByIdModel;
}
