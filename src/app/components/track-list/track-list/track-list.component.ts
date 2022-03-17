import { Component, Input } from "@angular/core";
import { ItemsTrackModel } from "../../../models/new-api-models/top-tracks-artist-by-id.model";
import { PlayerService } from "../../../services/player.service";
import { AlbumTracksModel } from "../../../models/new-api-models/album-by-id.model";
import { TrackLaunchContextEnum } from "../../../models/track-launch-context.enum";

@Component({
  selector: "hb-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.less"]
})
export class TrackListComponent {
  @Input() public trackList!: ItemsTrackModel | AlbumTracksModel;
  @Input() public trackContext!: string | TrackLaunchContextEnum;

  constructor(private playerService: PlayerService) {}

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(this.trackList);
  }
}
