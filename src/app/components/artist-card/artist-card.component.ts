import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { NewTopArtistTracks } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { ApiService } from "../../services/api.service";
import { catchError, Subject, takeUntil, throwError } from "rxjs";
import {
  TrackLaunchContext,
  TrackLaunchContextEnum
} from "../../models/track-launch-context.enum";
import { PlayerService } from "../../services/player.service";
import { ConverterService } from "../../services/converter.service";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzMessageService } from "ng-zorro-antd/message";
import { ErrorHandlingService } from "../../services/error-handling.service";

@Component({
  selector: "hb-artist-card",
  templateUrl: "./artist-card.component.html",
  styleUrls: ["./artist-card.component.less"]
})
export class ArtistCardComponent implements OnInit, OnDestroy {
  @Input()
  public artistInfo!: ArtistByIdModel;
  @Input()
  public followedArtistsId: string[] = [];
  public trackListContext: TrackLaunchContext = {
    id: null,
    contextType: TrackLaunchContextEnum.ARTIST_TOP_TRACKS
  };
  public changeTopTracks!: NewTopArtistTracks;
  public isCard = true;
  public subscription = false;
  public die$ = new Subject<void>();

  constructor(
    private api: ApiService,
    public playerService: PlayerService,
    private convert: ConverterService,
    public themeStateService: ThemeStateService,
    private notificationService: NzNotificationService,
    public error: ErrorHandlingService,
    private message: NzMessageService
  ) {}

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(this.changeTopTracks);
  }

  ngOnInit() {
    this.trackListContext.id = this.artistInfo.id;
    this.api
      .getArtistsTopTracks(this.artistInfo.id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(topTracks => {
        this.changeTopTracks =
          this.convert.convertTopArtistTracksToNewTopArtistTracks(
            topTracks.tracks
          );
        this.followedArtistsId.forEach(element => {
          if (element === this.artistInfo.id) {
            this.subscription = true;
            return;
          }
        });
      });
  }

  subscribeArtist(): void {
    this.api
      .putFollowArtists(this.artistInfo.id)
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
      .subscribe(() => {
        this.subscription = true;
        this.message.info("Вы подписались на исполнителя");
      });
  }

  unsubscribeArtist(): void {
    this.api
      .unfollowArtists(this.artistInfo.id)
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
      .subscribe(() => {
        this.subscription = false;
        this.message.info("Вы отписались от исполнителя");
      });
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
