import { Component } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Subject, Subscription, takeUntil } from "rxjs";
import { ErrorFromSpotifyModel } from "src/app/models/error.model";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "src/app/models/new-api-models/current-users-playlist.model";
import { ItemsTrackModel } from "src/app/models/new-api-models/top-tracks-artist-by-id.model";
import { TrackLaunchContextEnum } from "src/app/models/track-launch-context.enum";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { PlayerService } from "src/app/services/player.service";
import { ThemeStateService } from "src/app/services/theme-state.service";

@Component({
  selector: "hb-favorite-tracks-page",
  templateUrl: "./favorite-tracks-page.component.html",
  styleUrls: ["./favorite-tracks-page.component.less"]
})
export class FavoriteTracksPageComponent {
  public favorites!: ItemsTrackModel;
  public trackContext = TrackLaunchContextEnum.SAVED_TRACKS;
  public userPlaylists: ItemUserPlaylistModel[] = [];
  public offset = 0;
  public isLoading = true;
  public isFavorite = true;
  public isDisabled = false;

  public favorite$ = new Subscription();
  private die$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private playerService: PlayerService,
    public authService: AuthService,
    public themeStateService: ThemeStateService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.favorite$ = this.apiService
      .getUsersSavedTracks()
      .subscribe(favoriteTrack => {
        this.favorites = favoriteTrack;
        this.isLoading = false;
        if (favoriteTrack.items.length < 9) {
          this.isDisabled = true;
        }
      });
  }

  showMore(): void {
    this.offset += 9;
    this.apiService
      .getUsersSavedTracks(this.offset)
      .subscribe(favoriteTrack => {
        this.favorites.items.push(...favoriteTrack.items);
        this.isLoading = false;
        if (favoriteTrack.items.length < 9) {
          this.isDisabled = true;
        }
      });
  }

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(this.favorites);
  }

  removeTrackFromFavoriteList(id: string): void {
    this.apiService
      .deleteTracksForCurrentUser(id)
      .pipe(takeUntil(this.die$))
      .subscribe(
        () => {
          this.isFavorite = false;
          this.notificationService.blank(
            "Удаление трека",
            "Трек успешно удален"
          );
        },
        (e: ErrorFromSpotifyModel) => {
          this.notificationService.blank("Ошибка", e.error.error.message);
        }
      );
  }

  checkTrackIntoUserFavoriteList(id: string): void {
    this.apiService
      .checkUsersSavedTracks(id)
      .pipe(takeUntil(this.die$))
      .subscribe(existence => {
        this.isFavorite = existence[0];
      });
  }

  getUserPlaylists(id: string): void {
    this.checkTrackIntoUserFavoriteList(id);
    this.apiService
      .getCurrentUsersPlaylists()
      .pipe(takeUntil(this.die$))
      .subscribe((playlists: CurrentUsersPlaylistModel) => {
        this.userPlaylists = playlists.items.filter(playlist => {
          return this.authService.getUserData()?.[0].id === playlist.owner.id;
        });
      });
  }

  addTrackIntoPlaylist(playlistId: string, trackId: string): void {
    this.apiService
      .addItemsToPlaylist(playlistId, trackId)
      .pipe(takeUntil(this.die$))
      .subscribe(
        () => {
          this.notificationService.blank(
            "Добавление трека",
            "Трек успешно добавлен"
          );
        },
        (e: ErrorFromSpotifyModel) => {
          this.notificationService.blank("Ошибка", e.error.error.message);
        }
      );
  }

  ngOnDestroy(): void {
    this.die$.next();
    this.favorite$.unsubscribe();
  }
}
