import { Component, Input, ViewEncapsulation } from "@angular/core";
import { catchError, Subject, takeUntil, throwError } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import {
  ItemsTrackModel,
  PlaylistTrackModel
} from "src/app/models/new-api-models/top-tracks-artist-by-id.model";
import { TrackLaunchContextEnum } from "src/app/models/track-launch-context.enum";
import { ApiService } from "src/app/services/api.service";
import { PlayerService } from "src/app/services/player.service";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: "hb-recommendation-card",
  templateUrl: "./recommendation-card.component.html",
  styleUrls: ["./recommendation-card.component.less"],
  encapsulation: ViewEncapsulation.None
})
export class RecommendationCardComponent {
  public trackInfo!: PlaylistTrackModel[];
  public allPlaylist!: ItemsTrackModel;
  public trackContext = TrackLaunchContextEnum.TOP_TRACKS;
  public trackTime = 30;
  public offset = 0;
  public isCard = true;
  public isLoading = true;
  public isLoadingAllPlaylist = true;
  public isVisible = false;
  public isDisabled = true;
  public die$ = new Subject<void>();
  @Input() public recommendation!: ItemUserPlaylistModel;

  constructor(
    public apiService: ApiService,
    private playerService: PlayerService,
    public themeStateService: ThemeStateService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.apiService
      .getPlaylistTracks(this.recommendation.id)
      .pipe(takeUntil(this.die$))
      .subscribe(topTracks => {
        this.trackInfo = topTracks.items.filter(el => el.track).slice(0, 4);
        this.isLoading = false;
        this.isLoadingAllPlaylist = false;
      });
  }

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(null);
  }

  getAllPlaylist(id: string): void {
    this.isLoadingAllPlaylist = true;
    this.apiService
      .getPlaylistTracks(id)
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
        }),
        takeUntil(this.die$)
      )
      .subscribe(allPlaylist => {
        this.allPlaylist = allPlaylist;
        this.allPlaylist.items.filter(el => el.track);
        this.isVisible = true;
        this.isLoadingAllPlaylist = false;
        document.body.style.overflow = "hidden";
      });
  }

  showMore(id: string): void {
    this.offset += 10;
    this.isLoadingAllPlaylist = true;
    this.apiService
      .getPlaylistTracks(id, 10, this.offset)
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
        }),
        takeUntil(this.die$)
      )
      .subscribe(moreTracks => {
        this.allPlaylist.items.push(...moreTracks.items);
        if (moreTracks.items.length < 10) {
          this.isDisabled = false;
        }
        this.isLoadingAllPlaylist = false;
      });
  }

  handleCancel(): void {
    this.isVisible = false;
    document.body.style.overflow = "visible";
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
