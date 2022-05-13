import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { PlayerService } from "../../services/player.service";
import { AuthService } from "../../services/auth.service";
import { SwitchPlayerActionEnum } from "../../models/switch-player-action.enum";
import { ApiService } from "../../services/api.service";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "../../models/new-api-models/current-users-playlist.model";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { ThemeStateService } from "src/app/services/theme-state.service";
import {
  catchError,
  interval,
  Observable,
  Subject,
  takeUntil,
  throwError
} from "rxjs";
import { RepeatStateEnum } from "../../models/repeat-state.enum";
import {
  ItemsTrackModel,
  NewTopArtistTracks
} from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { AlbumTracksModel } from "../../models/new-api-models/album-by-id.model";
import { NewSearchModel } from "../../models/new-api-models/search.model";
import { ErrorHandlingService } from "../../services/error-handling.service";
import {
  TrackLaunchContext,
  TrackLaunchContextEnum
} from "../../models/track-launch-context.enum";

type TrackList =
  | ItemsTrackModel
  | AlbumTracksModel
  | NewSearchModel
  | NewTopArtistTracks;

@Component({
  selector: "hb-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.less"]
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  public ARTIST_NAMES_BLOCK_WIDTH = 130;
  public ARTIST_NAMES_BLOCK_WIDTH_ON_MOBILE = 280;

  @ViewChild("artistNames") mobileArtistNameLine!: ElementRef<HTMLElement>;

  public isMobile = false;
  public drawerVisible = false;
  public actions = SwitchPlayerActionEnum;
  public userPlaylists: ItemUserPlaylistModel[] = [];
  public trackContext!: TrackLaunchContext;
  public trackList!: TrackList;
  public isFavorite = false;
  public modalVisible = false;
  public repeatState = RepeatStateEnum;

  public movingLineCurrentPosition = 0;
  public movingLineScrollWidth!: number;
  public movingLineEdge = false;
  public motionTimer$: Observable<number> = interval(80);

  private die$ = new Subject<void>();
  private stop$ = new Subject<void>();

  constructor(
    public playerService: PlayerService,
    public authService: AuthService,
    public apiService: ApiService,
    public error: ErrorHandlingService,
    private notificationService: NzNotificationService,
    public themeStateService: ThemeStateService
  ) {}

  ngOnInit(): void {
    this.isMobile =
      window.screen.width < 895 || document.documentElement.clientWidth < 895;
    this.playerService.createAudioElement();
    this.playerService.currentTrackInfo$
      .pipe(takeUntil(this.die$))
      .subscribe(() => {
        this.movingLineCurrentPosition = 0;
        this.stop$.next();
        if (this.isMobile && this.drawerVisible) {
          setTimeout(() => {
            this.movingLineScrollWidth =
              this.mobileArtistNameLine.nativeElement.scrollWidth;
            this.changeLinePosition(this.ARTIST_NAMES_BLOCK_WIDTH_ON_MOBILE);
          }, 0);
        }
      });
  }

  ngAfterViewInit(): void {
    window.addEventListener("resize", this.resizeWindow);
  }

  resizeWindow = (): void => {
    if (
      window.screen.width < 895 ||
      document.documentElement.clientWidth < 895
    ) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
      this.drawerVisible = false;
    }
  };

  openPlayerControlOnMobile(id: string): void {
    if (this.isMobile) {
      this.drawerVisible = true;
      this.checkTrackIntoUserFavoriteList(id);
      setTimeout(() => {
        this.movingLineScrollWidth =
          this.mobileArtistNameLine.nativeElement.scrollWidth;
        this.changeLinePosition(this.ARTIST_NAMES_BLOCK_WIDTH_ON_MOBILE);
      }, 0);
    }
  }

  closePlayerControlOnMobile(): void {
    this.drawerVisible = false;
    this.stop$.next();
  }

  getUserPlaylists(id: string): void {
    this.checkTrackIntoUserFavoriteList(id);
    this.apiService
      .getCurrentUsersPlaylists()
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe((playlists: CurrentUsersPlaylistModel) => {
        this.userPlaylists = playlists.items.filter(playlist => {
          return this.authService.getUserData()?.[0].id === playlist.owner.id;
        });
      });
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
        this.notificationService.blank("Удаление трека", "Трек успешно удален");
      });
  }

  addTrackIntoFavoriteList(id: string): void {
    this.apiService
      .putSaveTracksForCurrentUser(id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.isFavorite = true;
        this.notificationService.blank(
          "Добавление трека",
          "Трек успешно добавлен"
        );
      });
  }

  checkTrackIntoUserFavoriteList(id: string): void {
    this.apiService
      .checkUsersSavedTracks(id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(existence => {
        this.isFavorite = existence[0];
      });
  }

  setLineInMotion(e: Event | null): void {
    if (!e) {
      this.stop$.next();
      return;
    }
    this.movingLineScrollWidth = (e.currentTarget as HTMLElement).scrollWidth;
    if (this.movingLineScrollWidth > this.ARTIST_NAMES_BLOCK_WIDTH) {
      this.changeLinePosition(this.ARTIST_NAMES_BLOCK_WIDTH);
    }
  }

  changeLinePosition(blockWidth: number): void {
    if (this.movingLineScrollWidth <= blockWidth) {
      return;
    }
    this.motionTimer$.pipe(takeUntil(this.stop$)).subscribe(() => {
      if (
        !this.movingLineEdge &&
        this.movingLineCurrentPosition > blockWidth - this.movingLineScrollWidth
      ) {
        this.movingLineCurrentPosition--;
      } else {
        this.movingLineEdge = true;
      }
      if (
        this.movingLineCurrentPosition >=
          blockWidth - this.movingLineScrollWidth &&
        this.movingLineEdge &&
        this.movingLineCurrentPosition <= 0
      ) {
        this.movingLineCurrentPosition++;
      } else {
        this.movingLineEdge = false;
      }
    });
  }

  handleOpen(): void {
    this.playerService.isShuffle$.subscribe(bool => {
      if (
        this.playerService.trackContext$.getValue()?.contextType !==
          TrackLaunchContextEnum.SEARCH_TRACKS &&
        this.playerService.trackList$.getValue()
      ) {
        this.trackContext =
          this.playerService.trackContext$.getValue() as TrackLaunchContext;
        this.trackList = bool
          ? this.playerService.shuffleTrackList
          : (this.playerService.trackList$.getValue() as TrackList);
        this.modalVisible = true;
        document.body.style.overflow = "hidden";
      } else {
        this.modalVisible = false;
      }
    });
  }

  handleCancel(): void {
    this.modalVisible = false;
    document.body.style.overflow = "visible";
  }

  switchMode(): string {
    return !this.themeStateService.getIsDarkTheme()
      ? "#FFFFFF"
      : "linear-gradient(252.82deg, rgba(54, 66, 109) 72.05%, rgba(12, 14, 24, 0.7) 100%) no-repeat fixed";
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.resizeWindow);
    this.playerService.closeAudioContext();
    this.die$.next();
    this.stop$.next();
  }
}
