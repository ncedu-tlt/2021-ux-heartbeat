import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { NewTopArtistTracks } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { ApiService } from "../../services/api.service";
import { catchError, Subject, takeUntil, throwError } from "rxjs";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";
import { PlayerService } from "../../services/player.service";
import { ConverterService } from "../../services/converter.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ErrorFromSpotifyModel } from "../../models/error.model";

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
  public trackContext = TrackLaunchContextEnum.TOP_TRACKS;
  public changeTopTracks!: NewTopArtistTracks;
  public isCard = true;
  public subscription!: boolean;
  public die$ = new Subject<void>();

  constructor(
    private api: ApiService,
    public playerService: PlayerService,
    private convert: ConverterService,
    private notificationService: NzNotificationService
  ) {}

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(this.changeTopTracks);
  }

  ngOnInit() {
    this.api
      .getArtistsTopTracks(this.artistInfo.id)
      .pipe(takeUntil(this.die$))
      .subscribe(topTracks => {
        this.changeTopTracks =
          this.convert.convertTopArtistTracksToNewTopArtistTracks(
            topTracks.tracks.slice(0, 4)
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
            this.notificationService.blank(
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
        this.notificationService.blank(
          "Подписка",
          "Вы подписались на исполнителя."
        );
      });
  }

  unsubscribeArtist(): void {
    this.api
      .unfollowArtists(this.artistInfo.id)
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          if (error.status === 401) {
            this.notificationService.blank(
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
        this.notificationService.blank(
          "Подписка",
          "Вы отписались от исполнителя."
        );
      });
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
