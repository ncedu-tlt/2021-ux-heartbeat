import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";

import {
  catchError,
  combineLatest,
  Subject,
  Subscription,
  takeUntil,
  throwError
} from "rxjs";

import { PlayerService } from "../../services/player.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { AuthService } from "src/app/services/auth.service";
import { ApiService } from "src/app/services/api.service";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "src/app/models/new-api-models/current-users-playlist.model";
import { ErrorFromSpotifyModel } from "src/app/models/error.model";
import { TrackById } from "../../models/new-api-models/track-by-id.model";
import { TopTracksModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { NewAlbumTracksModel } from "src/app/models/new-api-models/album-by-id.model";
import { TrackLaunchContext } from "../../models/track-launch-context.enum";

@Component({
  selector: "hb-track-extended",
  templateUrl: "./track-extended.component.html",
  styleUrls: ["./track-extended.component.less"]
})
export class TrackExtendedComponent implements OnDestroy, OnInit {
  private controlActiveTrack$: Subscription = new Subscription();
  public userPlaylists: ItemUserPlaylistModel[] = [];
  public _track!: TrackById | NewAlbumTracksModel | TopTracksModel;
  public isPlay = false;
  public isFavorite = false;
  public artistNameList = "";
  public trackTime = 30;
  private die$ = new Subject<void>();

  @Input() set track(track: TrackById | NewAlbumTracksModel) {
    this._track = track;
    this.artistNameList = track?.artists.reduce((prev, cur, index) => {
      return `${prev}${!index ? "" : ","} ${cur.name}`;
    }, "");
  }
  @Input() public trackContext!: TrackLaunchContext;

  @Output() playTrack = new EventEmitter<void>();

  constructor(
    public playerService: PlayerService,
    public apiService: ApiService,
    public notification: NzNotificationService,
    public authService: AuthService,
    public themeStateService: ThemeStateService
  ) {}

  ngOnInit(): void {
    this.controlActiveTrack$ = combineLatest([
      this.playerService.currentTrackInfo$,
      this.playerService.isPlay$,
      this.playerService.trackContext$
    ]).subscribe(
      ([currentTrack, isPlay, trackContext]: [
        currentTrack: TrackById | NewAlbumTracksModel | null,
        isPlay: boolean,
        trackContext: TrackLaunchContext | null | undefined
      ]) => {
        if (
          currentTrack?.id === this._track?.id &&
          this.trackContext.id === trackContext?.id &&
          this.trackContext.contextType === trackContext.contextType
        ) {
          this.isPlay = isPlay;
        } else {
          this.isPlay = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.controlActiveTrack$.unsubscribe();
  }

  setCurrentTrack(): void {
    this.playerService.currentTrackInfo$.next(this._track);
    this.playerService.trackContext$.next(this.trackContext);
    this.playTrack.emit();
  }

  hasAlbumName(
    track: TrackById | NewAlbumTracksModel | TopTracksModel
  ): track is TrackById {
    return (track as TrackById).album.name !== undefined;
  }

  controlPlayerCurrentTrack(): void {
    if (
      this.playerService.currentTrackInfo$.getValue()?.id !== this._track?.id
    ) {
      this.setCurrentTrack();
    } else {
      if (this.trackContext !== this.playerService.trackContext$.getValue()) {
        this.setCurrentTrack();
      }
    }
    this.playerService.switchPlayerAction();
  }

  notificationCall(): void {
    this.notification.blank(
      "Воспроизведение не доступно",
      "В данный момент времени невозможно прослушать эту аудиозапись."
    );
  }

  getUserPlaylists(id: string): void {
    combineLatest([
      this.apiService.checkUsersSavedTracks(id),
      this.apiService.getCurrentUsersPlaylists()
    ])
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notification.error("Ошибка", error.error.error.message);
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

  addTrackIntoFavoriteList(id: string): void {
    this.apiService
      .putSaveTracksForCurrentUser(id)
      .pipe(takeUntil(this.die$))
      .subscribe(
        () => {
          this.isFavorite = true;
          this.notification.blank("Добавление трека", "Трек успешно добавлен");
        },
        (e: ErrorFromSpotifyModel) => {
          this.notification.blank("Ошибка", e.error.error.message);
        }
      );
  }

  removeTrackFromFavoriteList(id: string): void {
    this.apiService
      .deleteTracksForCurrentUser(id)
      .pipe(takeUntil(this.die$))
      .subscribe(
        () => {
          this.isFavorite = false;
          this.notification.blank("Удаление трека", "Трек успешно удален");
        },
        (e: ErrorFromSpotifyModel) => {
          this.notification.blank("Ошибка", e.error.error.message);
        }
      );
  }
}
