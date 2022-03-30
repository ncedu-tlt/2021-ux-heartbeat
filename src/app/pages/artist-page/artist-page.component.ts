import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../services/api.service";
import {
  ArtistByIdModel,
  ArtistsModel
} from "../../models/new-api-models/artist-by-id.model";
import { catchError, Subject, takeUntil, throwError } from "rxjs";
import { combineLatest } from "rxjs";
import { TopTracksArtistByIdModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ErrorFromSpotifyModel } from "../../models/error.model";

@Component({
  selector: "hb-artist-page",
  templateUrl: "./artist-page.component.html",
  styleUrls: ["./artist-page.component.less"]
})
export class ArtistPageComponent implements OnInit, OnDestroy {
  private key!: string;
  public artistInfo!: ArtistByIdModel;
  public isFollow!: boolean[];
  public artistAlbums!: ArtistsModel;
  public artistTopTracks!: TopTracksArtistByIdModel;
  private die$ = new Subject<void>();
  public isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit() {
    this.key = <string>this.activatedRoute.snapshot.params["id"];
    combineLatest([
      this.apiService.getArtistByID(this.key),
      this.apiService.checkIfUserFollowsArtists(this.key),
      this.apiService.getArtistsAlbums(this.key),
      this.apiService.getArtistsTopTracks(this.key)
    ])
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notificationService.error("Ошибка", error.error.error.message);
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
          this.isFollow = isFollow;
          this.artistAlbums = artistAlbums;
          this.artistTopTracks = artistTopTracks;
          this.isLoading = false;
        }
      );
  }

  toFollowArtist() {
    this.apiService
      .putFollowArtists(this.key)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notificationService.error("Ошибка", error.error.error.message);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.notificationService.blank(
          "Подписка на исполнителя",
          `Вы успешно подписались на ${this.artistInfo.name}`
        );
      });
  }

  toUnfollowArtist() {
    this.apiService
      .unfollowArtists(this.key)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.notificationService.error("Ошибка", error.error.error.message);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.notificationService.blank(
          "Подписка на исполнителя",
          `Вы отписалась от ${this.artistInfo.name}`
        );
      });
  }

  ngOnDestroy() {
    this.die$.next();
  }
}
