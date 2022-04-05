import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ItemsArtistModel } from "../../models/new-api-models/artist-by-id.model";
import { ApiService } from "../../services/api.service";
import {
  NzDropdownMenuComponent,
  NzContextMenuService
} from "ng-zorro-antd/dropdown";
import { catchError, Subject, takeUntil, throwError } from "rxjs";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: "hb-album-card",
  templateUrl: "./album-card.component.html",
  styleUrls: ["./album-card.component.less"]
})
export class AlbumCardComponent implements OnInit, OnDestroy {
  @Input() album!: ItemsArtistModel;
  public isFollow!: boolean;
  private die$ = new Subject<void>();

  constructor(
    public apiService: ApiService,
    private nzContextMenuService: NzContextMenuService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
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
          this.notificationService.error("Ошибка", error.error.error.message);
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
          this.notificationService.error("Ошибка", error.error.error.message);
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
          this.notificationService.error("Ошибка", error.error.error.message);
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

  ngOnDestroy(): void {
    this.die$.next();
  }
}
