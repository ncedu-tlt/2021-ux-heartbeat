import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { TopTracksModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { ApiService } from "../../services/api.service";
import { Subscription } from "rxjs";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";

@Component({
  selector: "hb-artist-card",
  templateUrl: "./artist-card.component.html",
  styleUrls: ["./artist-card.component.less"]
})
export class ArtistCardComponent implements OnInit, OnDestroy {
  @Input()
  public artistInfo!: ArtistByIdModel;
  public trackContext = TrackLaunchContextEnum.TOP_TRACKS;
  public isCard = true;
  public topTracks: TopTracksModel[] = [];
  public topTracksSearch$ = new Subscription();

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.topTracksSearch$ = this.api
      .getArtistsTopTracks(this.artistInfo.id)
      .subscribe(topTracks => {
        this.topTracks = topTracks.tracks
          .filter(topTrack => topTrack.preview_url !== null)
          .slice(0, 4);
      });
  }

  ngOnDestroy() {
    this.topTracksSearch$.unsubscribe();
  }
}
