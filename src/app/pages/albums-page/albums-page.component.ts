import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { Subject } from "rxjs";
import {
  AlbumTracksModel,
  ImagesFromSpoty,
  ItemsAlbumModel,
  ItemsAlbumsContain,
  TracksModel
} from "../../models/new-api-models/album-by-id.model";
import { takeUntil } from "rxjs/operators";
import { ConverterService } from "../../services/converter.service";

@Component({
  selector: "hb-albums-page",
  templateUrl: "./albums-page.component.html",
  styleUrls: ["./albums-page.component.less"]
})
export class AlbumsPageComponent implements OnInit, OnDestroy {
  public albums: ItemsAlbumsContain[] = [];
  public tracks!: AlbumTracksModel;
  public albumId = "";
  public albumImage: ImagesFromSpoty[] = [];
  public albumName = "";
  public albumArtists = "";
  public isOpen = false;
  public isLoading = true;
  private die$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private convertService: ConverterService
  ) {}

  public loadAlbums(): void {
    this.apiService
      .getSavedAlbums()
      .pipe(takeUntil(this.die$))
      .subscribe((albumList: ItemsAlbumModel) => {
        this.albums = albumList.items;
      });
    this.isLoading = false;
  }

  public openAlbum(
    albumId: string,
    albumImg: ImagesFromSpoty[],
    albumName: string,
    albumArtists: string
  ): void {
    this.apiService
      .getAlbumsTracksById(albumId)
      .pipe(takeUntil(this.die$))
      .subscribe((trackList: TracksModel) => {
        this.tracks = this.convertService.convertAlbumModelsToNewTracksModels(
          trackList,
          albumId,
          albumImg
        );
      });
    this.albumId = albumId;
    this.albumImage = albumImg;
    this.albumName = albumName;
    this.albumArtists = albumArtists;
    this.setActiveStatus(albumId);
    this.isOpen = true;
  }

  public setActiveStatus(albumId: string): void {
    const node: HTMLElement = <HTMLElement>document.getElementById(albumId);
    const old: HTMLElement = <HTMLElement>document.querySelector(".active");

    if (old != null) {
      old.classList.toggle("active");
    }
    node.classList.toggle("active");
  }

  ngOnInit() {
    this.loadAlbums();
  }

  ngOnDestroy() {
    this.die$.next();
  }
}
