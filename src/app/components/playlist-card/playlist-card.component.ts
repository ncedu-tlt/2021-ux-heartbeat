import { Component, Input } from "@angular/core";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ApiService } from "../../services/api.service";
import { catchError, Subscription, throwError } from "rxjs";
import { PlayerService } from "../../services/player.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";

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
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.playerService.trackContext$.subscribe(() => {
      this.isActive =
        this.playerService.trackContext$.getValue() === this.playlist.id;
    });
  }

  playPlaylist(id: string): void {
    this.die$ = this.api
      .getPlaylistTracks(id, 50)
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          if (error.status === 401) {
            this.notificationService.error(
              "Ошибка авторизации",
              "Вам необходимо пройти авторизацию заново",
              { nzDuration: 0 }
            );
          }
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(allPlaylist => {
        const idx = allPlaylist.items.findIndex(
          el => el.track.preview_url !== null
        );
        if (this.playerService.trackContext$.getValue() === id) {
          this.playerService.switchPlayerAction();
        } else {
          this.playerService.currentTrackInfo$.next(
            allPlaylist.items[idx].track
          );
          this.playerService.trackList$.next(allPlaylist);
          this.playerService.trackContext$.next(id);
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
