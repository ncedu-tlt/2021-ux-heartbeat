import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { Subject, takeUntil } from "rxjs";
import { ApiService } from "../../services/api.service";
import { TrackById } from "../../models/new-api-models/track-by-id.model";
import { SearchStateService } from "../../services/search-state.service";
import { ConverterService } from "../../services/converter.service";
import { NewSearchModel } from "../../models/new-api-models/search.model";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: "hb-search-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.less"]
})
export class SearchPageComponent {
  public key!: string;
  public artists: ArtistByIdModel[] = [];
  public tracks: TrackById[] = [];
  public isDisabledShowMoreArtists = false;
  public isDisabledShowMoreTracks = false;
  public isLoading = true;
  public offset = 0;
  public changeTrackList!: NewSearchModel;
  public trackContext = TrackLaunchContextEnum.SEARCH_TRACKS;
  public die$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private searchStateService: SearchStateService,
    private convert: ConverterService,
    private notificationService: NzNotificationService
  ) {
    this.searchStateService
      .getSearchState()
      .pipe(takeUntil(this.die$))
      .subscribe(key => {
        this.key = key;
        this.getSearchResultByArtists();
        this.getSearchResultByTracks();
        this.isDisabledShowMoreArtists = false;
        this.isDisabledShowMoreTracks = false;
      });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.key = <string>this.activatedRoute.snapshot.queryParams["keyword"];
    this.getSearchResultByArtists();
    this.getSearchResultByTracks();
  }

  showMoreArtists(): void {
    this.isLoading = true;
    this.offset += 2;
    this.api
      .searchForItem(this.key, 2, this.offset)
      .pipe(takeUntil(this.die$))
      .subscribe(
        itemsToArtists => {
          this.artists.push(...itemsToArtists.artists.items);
          if (itemsToArtists.artists.items.length < 2) {
            this.isDisabledShowMoreArtists = true;
          }
          this.isLoading = false;
        },
        (error: ErrorFromSpotifyModel) => {
          this.notificationService.blank(
            "Ошибка авторизации",
            error.error.error.message,
            { nzDuration: 0 }
          );
        }
      );
  }

  showMoreTracks(): any {
    this.isLoading = true;
    this.offset += 6;
    this.api
      .searchForItem(this.key, 6, this.offset)
      .pipe(takeUntil(this.die$))
      .subscribe(
        itemsToTracks => {
          this.tracks.push(...itemsToTracks.tracks.items);
          if (itemsToTracks.tracks.items.length < 6) {
            this.isDisabledShowMoreTracks = true;
          }
          this.changeTrackList =
            this.convert.convertTrackSearchModelToNewSearchModel(this.tracks);
          this.isLoading = false;
        },
        (error: ErrorFromSpotifyModel) => {
          this.notificationService.blank(
            "Ошибка авторизации",
            error.error.error.message,
            { nzDuration: 0 }
          );
        }
      );
  }

  getSearchResultByArtists(): void {
    this.isLoading = true;
    this.api
      .searchForItem(this.key)
      .pipe(takeUntil(this.die$))
      .subscribe(
        artistsSearchResult => {
          this.artists = artistsSearchResult.artists.items;
          this.isLoading = false;
        },
        (error: ErrorFromSpotifyModel) => {
          this.notificationService.blank(
            "Ошибка авторизации",
            error.error.error.message,
            { nzDuration: 0 }
          );
        }
      );
  }

  getSearchResultByTracks(): void {
    this.isLoading = true;
    this.api
      .searchForItem(this.key, 6)
      .pipe(takeUntil(this.die$))
      .subscribe(tracksSearchResult => {
        this.tracks = tracksSearchResult.tracks.items;
        this.changeTrackList =
          this.convert.convertTrackSearchModelToNewSearchModel(this.tracks);
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
