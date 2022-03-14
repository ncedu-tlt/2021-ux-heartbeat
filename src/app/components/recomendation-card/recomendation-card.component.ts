import { Component, Input } from "@angular/core";
import { TopTracksModel } from "src/app/models/new-api-models/top-tracks-artist-by-id.model";

@Component({
  selector: "hb-recomendation-card",
  templateUrl: "./recomendation-card.component.html",
  styleUrls: ["./recomendation-card.component.less"]
})
export class RecomendationCardComponent {
  @Input() public track!: TopTracksModel;
}
