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
import { interval, Observable, Subject, takeUntil } from "rxjs";

@Component({
  selector: "hb-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.less"]
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  public ARTIST_NAMES_BLOCK_WIDTH = 130;
  public ARTIST_NAMES_BLOCK_WIDTH_ON_MOBILE = 280;

  @ViewChild("artistNames") mobileArtistNameLine!: ElementRef;

  public isMobile = false;
  public drawerVisible = false;
  public actions = SwitchPlayerActionEnum;
  public userPlaylists: ItemUserPlaylistModel[] = [];
  public isFavorite = false;
  public artistsNames: string | undefined = "";

  public movingLineCurrentPosition = 0;
  public movingLineScrollWidth!: number;
  public movingLineEdge = false;
  public motionTimer: Observable<number> = interval(80);

  private die$ = new Subject<void>();
  private stop$ = new Subject<void>();

  constructor(
    public playerService: PlayerService,
    public authService: AuthService,
    public apiService: ApiService,
    private notificationService: NzNotificationService
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
            this.movingLineScrollWidth = (
              this.mobileArtistNameLine.nativeElement as HTMLElement
            ).scrollWidth;
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
    }
    setTimeout(() => {
      this.movingLineScrollWidth = (
        this.mobileArtistNameLine.nativeElement as HTMLElement
      ).scrollWidth;
      this.changeLinePosition(this.ARTIST_NAMES_BLOCK_WIDTH_ON_MOBILE);
    }, 0);
  }

  closePlayerControlOnMobile(): void {
    this.drawerVisible = false;
    this.stop$.next();
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

  addTrackIntoFavoriteList(id: string): void {
    this.apiService
      .putSaveTracksForCurrentUser(id)
      .pipe(takeUntil(this.die$))
      .subscribe(
        () => {
          this.isFavorite = true;
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

  checkTrackIntoUserFavoriteList(id: string): void {
    this.apiService
      .checkUsersSavedTracks(id)
      .pipe(takeUntil(this.die$))
      .subscribe(existence => {
        this.isFavorite = existence[0];
      });
  }

  setLineInMotion(e: Event | null): void {
    if (!e) {
      this.stop$.next();
      return;
    }
    this.movingLineScrollWidth = (e?.currentTarget as HTMLElement).scrollWidth;
    if (this.movingLineScrollWidth > this.ARTIST_NAMES_BLOCK_WIDTH) {
      this.changeLinePosition(this.ARTIST_NAMES_BLOCK_WIDTH);
    }
  }

  changeLinePosition(blockWidth: number): void {
    if (this.movingLineScrollWidth > blockWidth) {
      this.motionTimer.pipe(takeUntil(this.stop$)).subscribe(() => {
        if (
          !this.movingLineEdge &&
          this.movingLineCurrentPosition >
            blockWidth - this.movingLineScrollWidth
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
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.resizeWindow);
    this.playerService.closeAudioContext();
    this.die$.next();
    this.stop$.next();
  }
}
