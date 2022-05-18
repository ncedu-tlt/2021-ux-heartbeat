import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../services/api.service";
import {
  ArtistByIdModel,
  ArtistsModel,
  ItemsArtistModel
} from "../../models/new-api-models/artist-by-id.model";
import {
  catchError,
  combineLatest,
  Subject,
  takeUntil,
  throwError
} from "rxjs";
import {
  NewTopArtistTracks,
  TopTracksArtistByIdModel
} from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import {
  TrackLaunchContext,
  TrackLaunchContextEnum
} from "../../models/track-launch-context.enum";
import { PlayerService } from "../../services/player.service";
import { ThemeStateService } from "../../services/theme-state.service";
import { ConverterService } from "../../services/converter.service";
import { ErrorHandlingService } from "../../services/error-handling.service";

@Component({
  selector: "hb-artist-page",
  templateUrl: "./artist-page.component.html",
  styleUrls: ["./artist-page.component.less"]
})
export class ArtistPageComponent implements OnInit, OnDestroy {
  private key!: string;
  public artistInfo!: ArtistByIdModel;
  public isFollow!: boolean;
  public artistAlbums!: ItemsArtistModel[];
  public artistTopTracks!: NewTopArtistTracks;
  public trackContext = TrackLaunchContextEnum.ARTIST_TOP_TRACKS;
  private die$ = new Subject<void>();
  public isLoading = true;
  public showMoreDisabled = false;
  public offset = 0;
  public trackListContext: TrackLaunchContext = {
    id: null,
    contextType: TrackLaunchContextEnum.ARTIST_TOP_TRACKS
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notificationService: NzNotificationService,
    private playerService: PlayerService,
    public error: ErrorHandlingService,
    public themeStateService: ThemeStateService,
    public convert: ConverterService
  ) {}

  ngOnInit(): void {
    this.key = <string>this.activatedRoute.snapshot.params["id"];
    combineLatest([
      this.apiService.getArtistByID(this.key),
      this.apiService.checkIfUserFollowsArtists(this.key),
      this.apiService.getArtistsAlbums(this.key, "album"),
      this.apiService.getArtistsTopTracks(this.key)
    ])
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(
        ([artist, isFollow, artistAlbums, artistTopTracks]: [
          artist: ArtistByIdModel,
          isFollow: boolean[],
          artistAlbum: ArtistsModel,
          artistTopTracks: TopTracksArtistByIdModel
        ]) => {
          this.artistInfo = artist;
          this.trackListContext.id = artist.id;
          this.isFollow = isFollow[0];
          this.artistAlbums = artistAlbums.items;
          this.artistTopTracks =
            this.convert.convertTopArtistTracksToNewTopArtistTracks(
              artistTopTracks.tracks
            );
          this.offset += 10;
          this.showMoreDisabled = this.offset < artistAlbums.total;
          this.isLoading = false;
        }
      );
  }

  toFollowArtist(): void {
    this.apiService
      .putFollowArtists(this.key)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.isFollow = !this.isFollow;
        this.notificationService.blank(
          "Подписка на исполнителя",
          `Вы успешно подписались на ${this.artistInfo.name}`
        );
      });
  }

  toUnfollowArtist(): void {
    this.apiService
      .unfollowArtists(this.key)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.isFollow = !this.isFollow;
        this.notificationService.blank(
          "Подписка на исполнителя",
          `Вы отписалась от ${this.artistInfo.name}`
        );
      });
  }

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(this.artistTopTracks);
  }

  showMoreAlbums(): void {
    this.isLoading = true;
    this.apiService
      .getArtistsAlbums(this.key, "album", this.offset)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(artistAlbums => {
        this.artistAlbums.push(...artistAlbums.items);
        this.offset += 10;
        this.showMoreDisabled = this.offset < artistAlbums.total;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
