import { Component, ViewEncapsulation } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { catchError, Subject, Subscription, takeUntil, throwError } from "rxjs";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { ErrorFromSpotifyModel } from "src/app/models/error.model";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "src/app/models/new-api-models/current-users-playlist.model";
import { ItemsTrackModel } from "src/app/models/new-api-models/top-tracks-artist-by-id.model";
import {
  TrackLaunchContext,
  TrackLaunchContextEnum
} from "src/app/models/track-launch-context.enum";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { PlayerService } from "src/app/services/player.service";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ErrorHandlingService } from "../../services/error-handling.service";

@Component({
  selector: "hb-favorite-tracks-page",
  templateUrl: "./favorite-tracks-page.component.html",
  styleUrls: ["./favorite-tracks-page.component.less"],
  encapsulation: ViewEncapsulation.None
})
export class FavoriteTracksPageComponent {
  public favorites!: ItemsTrackModel;
  public trackListContext: TrackLaunchContext = {
    id: null,
    contextType: TrackLaunchContextEnum.SAVED_TRACKS
  };
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
    public error: ErrorHandlingService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.favorite$ = this.apiService
      .getUsersSavedTracks()
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(favoriteTrack => {
        this.favorites = favoriteTrack;
        this.isLoading = false;
        if (favoriteTrack.items.length < 24) {
          this.isDisabled = true;
        }
      });
  }

  showMore(): void {
    this.offset += 24;
    this.apiService
      .getUsersSavedTracks(this.offset)
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(favoriteTrack => {
        this.favorites.items.push(...favoriteTrack.items);
        this.isLoading = false;
        if (favoriteTrack.items.length < 24) {
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
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.isFavorite = false;
        this.favorites.items.splice(
          this.favorites.items.findIndex(track => {
            return track.track.id === id;
          }),
          1
        );
        this.notificationService.blank("Удаление трека", "Трек успешно удален");
      });
  }

  getUserPlaylists(id: string): void {
    combineLatest([
      this.apiService.checkUsersSavedTracks(id),
      this.apiService.getCurrentUsersPlaylists()
    ])
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(
        ([existence, playlists]: [
          existence: boolean[],
          playlists: CurrentUsersPlaylistModel
        ]) => {
          this.isFavorite = existence[0];
          this.userPlaylists = playlists.items.filter(playlist => {
            return this.authService.getUserData()?.[0].id === playlist.owner.id;
          });
        }
      );
  }

  addTrackIntoPlaylist(playlistId: string, trackId: string): void {
    this.apiService
      .addItemsToPlaylist(playlistId, trackId)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.notificationService.blank(
          "Добавление трека",
          "Трек успешно добавлен"
        );
      });
  }

  ngOnDestroy(): void {
    this.die$.next();
    this.favorite$.unsubscribe();
  }
}
