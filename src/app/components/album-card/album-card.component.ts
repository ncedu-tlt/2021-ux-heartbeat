import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ItemsArtistModel } from "../../models/new-api-models/artist-by-id.model";
import { ApiService } from "../../services/api.service";
import {
  NzContextMenuService,
  NzDropdownMenuComponent
} from "ng-zorro-antd/dropdown";
import { catchError, Subject, takeUntil, throwError } from "rxjs";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ThemeStateService } from "../../services/theme-state.service";
import {
  AlbumTracksModel,
  TracksModel
} from "../../models/new-api-models/album-by-id.model";
import { ConverterService } from "../../services/converter.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import {
  TrackLaunchContext,
  TrackLaunchContextEnum
} from "../../models/track-launch-context.enum";

@Component({
  selector: "hb-album-card",
  templateUrl: "./album-card.component.html",
  styleUrls: ["./album-card.component.less"]
})
export class AlbumCardComponent implements OnInit, OnDestroy {
  @Input() album!: ItemsArtistModel;
  public trackList!: AlbumTracksModel;
  public trackListContext: TrackLaunchContext = {
    id: null,
    contextType: TrackLaunchContextEnum.ALBUM
  };
  public isFollow!: boolean;
  public isVisible = false;
  private die$ = new Subject<void>();

  constructor(
    public apiService: ApiService,
    public themeStateService: ThemeStateService,
    public convertService: ConverterService,
    private nzContextMenuService: NzContextMenuService,
    private notificationService: NzNotificationService,
    public error: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.trackListContext.id = this.album.id;
    this.checkFollowAlbum();
  }

  openDropdownMenu(event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create(event, menu);
  }

  checkFollowAlbum(): void {
    this.apiService
      .checkSavedAlbums(this.album.id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(isFollow => {
        this.isFollow = isFollow[0];
      });
  }

  addAlbumToFavorite(): void {
    this.apiService
      .putSaveAlbums(this.album.id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.isFollow = true;
        this.notificationService.blank(
          "Действие с альбомом",
          `Альбом ${this.album.name} успешно добавлен`
        );
      });
  }

  deleteAlbumFromFavorite(): void {
    this.apiService
      .deleteAlbums(this.album.id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(() => {
        this.isFollow = false;
        this.notificationService.blank(
          "Действие с альбомом",
          `Альбом ${this.album.name} успешно удален`
        );
      });
  }

  openAllPlaylist(album: ItemsArtistModel): void {
    this.isVisible = true;
    this.apiService
      .getAlbumsTracksById(this.album.id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe((trackList: TracksModel) => {
        this.trackList =
          this.convertService.convertAlbumModelsToNewTracksModels(
            trackList,
            album.id,
            album.images
          );
      });
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
