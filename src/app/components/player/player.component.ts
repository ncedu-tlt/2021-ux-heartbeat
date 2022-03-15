import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
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
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "hb-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.less"]
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  public isMobile!: boolean;
  public drawerVisible = false;
  public actions = SwitchPlayerActionEnum;
  public userPlaylists: ItemUserPlaylistModel[] = [];
  public isFavorite = false;
  private die$ = new Subject<void>();

  constructor(
    public playerService: PlayerService,
    public authService: AuthService,
    public apiService: ApiService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.isMobile =
      window.screen.width < 850 || document.documentElement.clientWidth < 850;
    this.playerService.createAudioElement();
  }

  ngAfterViewInit(): void {
    window.addEventListener("resize", this.resizeWindow);
  }

  resizeWindow = (): void => {
    if (
      window.screen.width < 850 ||
      document.documentElement.clientWidth < 850
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
  }

  closePlayerControlOnMobile(): void {
    this.drawerVisible = false;
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

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.resizeWindow);
    this.playerService.closeAudioContext();
    this.die$.next();
  }
}
