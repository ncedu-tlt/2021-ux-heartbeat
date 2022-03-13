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

  constructor(
    public playerService: PlayerService,
    public authService: AuthService,
    public apiService: ApiService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.isMobile = window.screen.width < 850;
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

  changeVisiblePlayerControlOnMobile(): void {
    if (this.isMobile) {
      this.drawerVisible = !this.drawerVisible;
    }
  }

  getUserPlaylists() {
    this.apiService
      .getCurrentUsersPlaylists()
      .subscribe((playlists: CurrentUsersPlaylistModel) => {
        this.userPlaylists = playlists.items.filter(playlist => {
          return this.authService.getUserData()?.[0].id === playlist.owner.id;
        });
      });
  }

  addTrackIntoPlaylist(playlistId: string, trackId: string) {
    this.apiService.addItemsToPlaylist(playlistId, trackId).subscribe(() => {
      this.notificationService.blank(
        "Добавление трека",
        "Трек успешно добавлен"
      );
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.resizeWindow);
    this.playerService.closeAudioContext();
  }
}
