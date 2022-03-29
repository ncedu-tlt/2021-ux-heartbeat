import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { NewTopArtistTracks } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { ApiService } from "../../services/api.service";
import { Subscription } from "rxjs";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";
import { PlayerService } from "../../services/player.service";
import { ConverterService } from "../../services/converter.service";
import { ThemeStateService } from "src/app/services/theme-state.service";

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
  public changeTopTracks!: NewTopArtistTracks;
  public topTracksSearch$ = new Subscription();

  constructor(
    private api: ApiService,
    public playerService: PlayerService,
    private convert: ConverterService,
    public themeStateService: ThemeStateService
  ) {}

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(this.changeTopTracks);
  }

  ngOnInit() {
    this.topTracksSearch$ = this.api
      .getArtistsTopTracks(this.artistInfo.id)
      .subscribe(topTracks => {
        this.changeTopTracks =
          this.convert.convertTopArtistTracksToNewTopArtistTracks(
            topTracks.tracks.slice(0, 4)
          );
      });
  }

  ngOnDestroy() {
    this.topTracksSearch$.unsubscribe();
  }
}
