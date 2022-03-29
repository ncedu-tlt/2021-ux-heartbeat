import { Component, Input, ViewEncapsulation } from "@angular/core";
import { Subscription } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { PlaylistTrackModel } from "src/app/models/new-api-models/top-tracks-artist-by-id.model";
import { TrackLaunchContextEnum } from "src/app/models/track-launch-context.enum";
import { ApiService } from "src/app/services/api.service";
import { PlayerService } from "src/app/services/player.service";

@Component({
  selector: "hb-recomendation-card",
  templateUrl: "./recomendation-card.component.html",
  styleUrls: ["./recomendation-card.component.less"],
  encapsulation: ViewEncapsulation.None
})
export class RecomendationCardComponent {
  public trackInfo!: PlaylistTrackModel[];
  public trackContext = TrackLaunchContextEnum.TOP_TRACKS;
  public isCard = true;
  public trackTime = 30;
  public isLoading = true;
  public info$ = new Subscription();

  @Input() public recomendation!: ItemUserPlaylistModel;

  constructor(
    public apiService: ApiService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.info$ = this.apiService
      .getPlaylistTracks(this.recomendation.id)
      .subscribe(topTracks => {
        this.trackInfo = topTracks.items.filter(el => el.track).slice(0, 4);
        this.isLoading = false;
      });
  }

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(null);
  }

  ngOnDestroy(): void {
    this.info$.unsubscribe();
  }
}
