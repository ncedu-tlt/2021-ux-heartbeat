import { Component, Input } from "@angular/core";
import { ItemsTrackModel } from "../../../models/new-api-models/top-tracks-artist-by-id.model";
import { PlayerService } from "../../../services/player.service";

@Component({
  selector: "hb-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.less"]
})
export class TrackListComponent {
  @Input() public trackList!: ItemsTrackModel;

  constructor(private playerService: PlayerService) {}

  setListTrackIntoPlayer() {
    this.playerService.trackList$.next(this.trackList);
  }
}
