import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import {
  catchError,
  Observable,
  Subject,
  takeUntil,
  throwError,
  combineLatest
} from "rxjs";
import { ApiService } from "../../services/api.service";
import { SearchStateService } from "../../services/search-state.service";
import { ConverterService } from "../../services/converter.service";
import {
  NewSearchModel,
  SearchModel
} from "../../models/new-api-models/search.model";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { FollowedArtistModel } from "../../models/new-api-models/followed-artist.model";
import { PlayerService } from "../../services/player.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";

@Component({
  selector: "hb-search-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.less"]
})
export class SearchPageComponent {
  public key!: string;
  public artists: ArtistByIdModel[] = [];
  public changeTrackList!: NewSearchModel;
  public isDisabledShowMoreArtists = false;
  public isDisabledShowMoreTracks = false;
  public isLoading = true;
  public offset = 0;
  public die$ = new Subject<void>();
  public followedArtistsId: string[] = [];
  public trackListContext = {
    id: null,
    contextType: TrackLaunchContextEnum.SEARCH_TRACKS
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private searchStateService: SearchStateService,
    public playerService: PlayerService,
    private convert: ConverterService,
    private notificationService: NzNotificationService,
    public themeStateService: ThemeStateService,
    public error: ErrorHandlingService
  ) {
    this.searchStateService
      .getSearchState()
      .pipe(takeUntil(this.die$))
      .subscribe(key => {
        this.key = key;
        this.resolveSearchResult();
        this.isDisabledShowMoreArtists = false;
        this.isDisabledShowMoreTracks = false;
      });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.key = <string>this.activatedRoute.snapshot.queryParams["keyword"];
    this.resolveSearchResult();
  }

  setListTrackIntoPlayer(): void {
    this.playerService.trackList$.next(this.changeTrackList);
  }

  getSearchResultByArtists(): Observable<SearchModel> {
    return this.api.searchForItem(this.key);
  }

  getSearchResultByTracks(): Observable<SearchModel> {
    return this.api.searchForItem(this.key, 6);
  }

  getFollowedArtists(): Observable<FollowedArtistModel> {
    return this.api.getFollowedArtists();
  }

  showMoreArtists(): void {
    this.isLoading = true;
    this.offset += 2;
    this.api
      .searchForItem(this.key, 2, this.offset)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(itemsToArtists => {
        this.artists.push(...itemsToArtists.artists.items);
        if (itemsToArtists.artists.items.length < 2) {
          this.isDisabledShowMoreArtists = true;
        }
        this.isLoading = false;
      });
  }

  showMoreTracks(): any {
    this.isLoading = true;
    this.offset += 6;
    this.api
      .searchForItem(this.key, 6, this.offset)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(itemsToTracks => {
        const itemsForConvert =
          this.convert.convertTrackSearchModelToNewSearchModel(
            itemsToTracks.tracks.items
          );
        this.changeTrackList.items.push(...itemsForConvert.items);
        if (itemsForConvert.items.length < 6) {
          this.isDisabledShowMoreTracks = true;
        }
        this.isLoading = false;
      });
  }

  resolveSearchResult(): void {
    combineLatest([
      this.getSearchResultByArtists(),
      this.getSearchResultByTracks(),
      this.getFollowedArtists()
    ])
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          if (
            error.status === 400 &&
            error.error.error.message === "No search query"
          ) {
            this.isLoading = false;
            this.isDisabledShowMoreTracks = true;
            this.isDisabledShowMoreArtists = true;
            this.notificationService.warning(
              "Ошибка во время поиска",
              "Введите в поле поиска название песни и/или имя исполнителя"
            );
          }
          return throwError(() => new Error(error.error.error.message));
        }),
        takeUntil(this.die$)
      )
      .subscribe(([itemsToArtists, tracksSearchResult, artistList]) => {
        this.artists = itemsToArtists.artists.items;
        if (this.artists.length < 2) {
          this.isDisabledShowMoreArtists = true;
        }

        this.changeTrackList =
          this.convert.convertTrackSearchModelToNewSearchModel(
            tracksSearchResult.tracks.items
          );
        if (this.changeTrackList.items.length < 6) {
          this.isDisabledShowMoreTracks = true;
        }

        for (const artistsId of artistList.artists.items) {
          this.followedArtistsId.push(artistsId.id);
        }

        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
