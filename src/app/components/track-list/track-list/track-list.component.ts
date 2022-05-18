import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  ItemsTrackModel,
  NewTopArtistTracks
} from "../../../models/new-api-models/top-tracks-artist-by-id.model";
import { PlayerService } from "../../../services/player.service";
import { AlbumTracksModel } from "../../../models/new-api-models/album-by-id.model";
import {
  TrackLaunchContext,
  TrackLaunchContextEnum
} from "../../../models/track-launch-context.enum";
import { NewSearchModel } from "../../../models/new-api-models/search.model";

@Component({
  selector: "hb-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.less"]
})
export class TrackListComponent {
  @Input() public trackList!:
    | ItemsTrackModel
    | AlbumTracksModel
    | NewSearchModel
    | NewTopArtistTracks;
  @Input() public trackContext!: TrackLaunchContext;
  @Input() public isUserPlaylist = false;

  @Output() removeFromPlaylist = new EventEmitter<string>();

  constructor(private playerService: PlayerService) {}

  setListTrackIntoPlayer(): void {
    if (
      this.trackContext.contextType === TrackLaunchContextEnum.SEARCH_TRACKS
    ) {
      this.playerService.trackList$.next(null);
    } else {
      this.playerService.trackList$.next(this.trackList);
    }
  }

  upRemoveFromPlaylist(data: string) {
    this.removeFromPlaylist.emit(data);
  }
}
