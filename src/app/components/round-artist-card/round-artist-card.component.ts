import { Component, Input } from "@angular/core";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";

@Component({
  selector: "hb-round-artist-card",
  templateUrl: "./round-artist-card.component.html",
  styleUrls: ["./round-artist-card.component.less"]
})
export class RoundArtistCardComponent {
  @Input() public artist!: ArtistByIdModel;

  constructor(public themeStateService: ThemeStateService) {}
}
