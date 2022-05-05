import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from "@angular/core";
import { ApiService } from "../../services/api.service";
import { catchError, Subject, throwError } from "rxjs";
import {
  AlbumItemModel,
  AlbumTracksModel,
  ItemsAlbumModel,
  TracksModel
} from "../../models/new-api-models/album-by-id.model";
import { takeUntil } from "rxjs/operators";
import { ConverterService } from "../../services/converter.service";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";

@Component({
  selector: "hb-albums-page",
  templateUrl: "./albums-page.component.html",
  styleUrls: ["./albums-page.component.less"]
})
export class AlbumsPageComponent implements OnInit, OnDestroy {
  public albums: AlbumItemModel[] = [];
  public tracks!: AlbumTracksModel;
  public album!: AlbumItemModel;
  public isOpen = false;
  public isLoading = true;
  private die$ = new Subject<void>();

  @ViewChildren("album")
  private children!: QueryList<ElementRef<HTMLDivElement>>;

  private oldSelected = "";
  private selectedId = "";

  @ViewChild("openedAlbum")
  private openedAlbum!: ElementRef<HTMLDivElement>;

  constructor(
    private apiService: ApiService,
    private convertService: ConverterService,
    public themeStateService: ThemeStateService,
    public error: ErrorHandlingService
  ) {}

  public loadAlbums(): void {
    this.apiService
      .getSavedAlbums()
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe((albumList: ItemsAlbumModel) => {
        this.albums = albumList.items;
        this.isLoading = false;
      });
  }

  public openAlbum(album: AlbumItemModel): void {
    this.apiService
      .getAlbumsTracksById(album.album.id)
      .pipe(
        takeUntil(this.die$),
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe((trackList: TracksModel) => {
        this.tracks = this.convertService.convertAlbumModelsToNewTracksModels(
          trackList,
          album.album.id,
          album.album.images
        );
      });
    this.album = album;
    this.selectAlbum(album.album.id);
    this.isOpen = true;
    setTimeout(() => this.openedAlbum.nativeElement.scrollIntoView(true), 0);
  }

  public selectAlbum(id: string): void {
    if (!this.selectedId) {
      this.selectedId = id;
    } else {
      this.oldSelected = this.selectedId;
      this.selectedId = id;
    }

    const currentAlbum = this.children.find(
      item => item.nativeElement.id == id
    );
    const oldAlbum = this.children.find(
      item => item.nativeElement.id == this.oldSelected
    );

    if (!currentAlbum) {
      return;
    }
    currentAlbum.nativeElement.classList.toggle("active");

    if (!oldAlbum) {
      return;
    }
    oldAlbum.nativeElement.classList.toggle("active");
  }

  ngOnInit() {
    this.loadAlbums();
  }

  ngOnDestroy() {
    this.die$.next();
  }
}
