import { Component, Input } from "@angular/core";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ApiService } from "../../services/api.service";
import { catchError, Subscription, throwError } from "rxjs";
import { PlayerService } from "../../services/player.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";

@Component({
  selector: "hb-playlist-card",
  templateUrl: "./playlist-card.component.html",
  styleUrls: ["./playlist-card.component.less"]
})
export class PlaylistCardComponent {
  @Input() public playlist!: ItemUserPlaylistModel;
  public die$ = new Subscription();
  public isActive = false;

  constructor(
    public themeStateService: ThemeStateService,
    private api: ApiService,
    public playerService: PlayerService,
    public error: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.playerService.trackContext$.subscribe(value => {
      this.isActive = this.playlist.id === value?.id;
    });
  }

  playPlaylist(id: string): void {
    this.die$ = this.api
      .getPlaylistTracks(id, 50)
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(allPlaylist => {
        const idx = allPlaylist.items.findIndex(
          el => el.track.preview_url !== null
        );
        if (this.playerService.trackContext$.getValue()?.id === id) {
          this.playerService.switchPlayerAction();
        } else {
          this.playerService.currentTrackInfo$.next(
            allPlaylist.items[idx].track
          );
          this.playerService.trackList$.next(allPlaylist);
          this.playerService.trackContext$.next({
            id,
            contextType: TrackLaunchContextEnum.PLAYLIST
          });
          this.playerService.switchPlayerAction();
        }
      });
  }

  stopPlaylist(): void {
    if (this.playerService.trackContext$) {
      this.playerService.switchPlayerAction();
    }
  }

  ngOnDestroy(): void {
    this.die$.unsubscribe();
  }
}
