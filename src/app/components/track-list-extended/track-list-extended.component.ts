import { Component, Input } from "@angular/core";
import {
  ItemsTrackModel,
  NewTopArtistTracks,
  NewUserTopTracksItemsModel
} from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { AlbumTracksModel } from "../../models/new-api-models/album-by-id.model";
import { NewSearchModel } from "../../models/new-api-models/search.model";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";
import { PlayerService } from "../../services/player.service";

@Component({
  selector: "hb-track-list-extended",
  templateUrl: "./track-list-extended.component.html",
  styleUrls: ["./track-list-extended.component.less"]
})
export class TrackListExtendedComponent {
  @Input() public trackList!:
    | ItemsTrackModel
    | AlbumTracksModel
    | NewSearchModel
    | NewTopArtistTracks
    | NewUserTopTracksItemsModel;
  @Input() public trackContext!: string | TrackLaunchContextEnum;

  constructor(private playerService: PlayerService) {}

  setListTrackIntoPlayer(): void {
    if (this.trackContext === TrackLaunchContextEnum.SEARCH_TRACKS) {
      this.playerService.trackList$.next(null);
    } else {
      this.playerService.trackList$.next(this.trackList);
    }
  }
}
