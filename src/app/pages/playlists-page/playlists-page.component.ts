import { Component } from "@angular/core";
import { ItemsTrackModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "../../models/new-api-models/current-users-playlist.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "hb-playlists-page",
  templateUrl: "./playlists-page.component.html",
  styleUrls: ["./playlists-page.component.less"]
})
export class PlaylistsPageComponent {
  public playlists: ItemUserPlaylistModel[] = [];
  public tracks!: ItemsTrackModel;
  public isLoading = true;
  public isOpen = false;
  public playlistId!: string;
  public playlistImg!: string;
  public playlistAuthor!: string;
  public playlistName!: string;
  public isActive = false;
  private die$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  loadPlaylists(): void {
    this.apiService
      .getCurrentUsersPlaylists()
      .pipe(takeUntil(this.die$))
      .subscribe((playlistList: CurrentUsersPlaylistModel) => {
        this.playlists = playlistList.items;
        this.isLoading = false;
      });
  }

  openPlaylist(
    playlistId: string,
    playlistImg: string,
    playlistAuthor: string,
    playlistName: string
  ): void {
    this.apiService
      .getPlaylistTracks(playlistId)
      .pipe(takeUntil(this.die$))
      .subscribe((playlistTracks: ItemsTrackModel) => {
        this.tracks = playlistTracks;
        this.playlistId = playlistId;
        this.playlistImg = playlistImg;
        this.playlistAuthor = playlistAuthor;
        this.playlistName = playlistName;
        this.isOpen = true;
      });
    this.setActiveStatus(playlistId);
  }

  setActiveStatus(playlistId: string): void {
    const node: HTMLElement = <HTMLElement>document.getElementById(playlistId);
    const old: HTMLElement = <HTMLElement>document.querySelector(".active");
    if (old != null) {
      old.classList.toggle("active");
    }
    node.classList.toggle("active");
  }

  ngOnInit(): void {
    this.loadPlaylists();
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
