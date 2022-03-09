import { Component, Input } from "@angular/core";
import { ArtistCardModel } from "../../models/artist-card.model";

@Component({
  selector: "hb-round-artist-card",
  templateUrl: "./round-artist-card.component.html",
  styleUrls: ["./round-artist-card.component.less"]
})
export class RoundArtistCardComponent {
  @Input() public artist!: ArtistCardModel;
}
