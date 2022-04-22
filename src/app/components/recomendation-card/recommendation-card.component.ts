import { Component, Input, ViewEncapsulation } from "@angular/core";
import { catchError, Subject, takeUntil, throwError } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { ItemsTrackModel } from "src/app/models/new-api-models/top-tracks-artist-by-id.model";
import { ApiService } from "src/app/services/api.service";
import { PlayerService } from "src/app/services/player.service";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ConverterService } from "../../services/converter.service";

@Component({
  selector: "hb-recommendation-card",
  templateUrl: "./recommendation-card.component.html",
  styleUrls: ["./recommendation-card.component.less"],
  encapsulation: ViewEncapsulation.None
})
export class RecommendationCardComponent {
  public trackInfo!: ItemsTrackModel;
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
    private notificationService: NzNotificationService,
    public convert: ConverterService
  ) {}

  ngOnInit(): void {
    this.apiService
      .getPlaylistTracks(this.recommendation.id)
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
      .subscribe(topTracks => {
        this.trackInfo = topTracks;
        this.trackInfo.items.filter(el => el.track);
        this.isLoading = false;
        this.isLoadingAllPlaylist = false;
      });
  }

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(this.trackInfo);
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
        this.trackInfo.items.push(...moreTracks.items);
        if (moreTracks.items.length < 10) {
          this.isDisabled = false;
        }
        this.isLoadingAllPlaylist = false;
      });
  }

  openAllPlaylist(): void {
    this.isVisible = true;
    document.body.style.overflow = "hidden";
  }

  handleCancel(): void {
    this.isVisible = false;
    document.body.style.overflow = "visible";
  }

  switchMode(): string {
    return !this.themeStateService.getIsDarkTheme()
      ? "#FFFFFF"
      : "linear-gradient(252.82deg, rgba(54, 66, 109) 72.05%, rgba(12, 14, 24, 0.7) 100%) no-repeat fixed";
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
