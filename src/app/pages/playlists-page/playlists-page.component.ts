import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { ItemsTrackModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import {
  CurrentUsersPlaylistModel,
  ItemUserPlaylistModel
} from "../../models/new-api-models/current-users-playlist.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiService } from "../../services/api.service";
import { ThemeStateService } from "src/app/services/theme-state.service";

@Component({
  selector: "hb-playlists-page",
  templateUrl: "./playlists-page.component.html",
  styleUrls: ["./playlists-page.component.less"]
})
export class PlaylistsPageComponent implements OnInit, OnDestroy {
  public playlists: ItemUserPlaylistModel[] = [];
  public playlist!: ItemUserPlaylistModel;
  public tracks!: ItemsTrackModel;
  public isLoading = true;
  public isOpen = false;
  private die$ = new Subject<void>();

  @ViewChildren("playlist")
  private children!: QueryList<ElementRef<HTMLDivElement>>;

  private oldSelected = "";
  private selectedId = "";

  constructor(
    private apiService: ApiService,
    public themeStateService: ThemeStateService
  ) {}

  loadPlaylists(): void {
    this.apiService
      .getCurrentUsersPlaylists()
      .pipe(takeUntil(this.die$))
      .subscribe((playlistList: CurrentUsersPlaylistModel) => {
        this.playlists = playlistList.items;
        this.isLoading = false;
      });
  }

  openPlaylist(playlist: ItemUserPlaylistModel): void {
    this.apiService
      .getPlaylistTracks(playlist.id)
      .pipe(takeUntil(this.die$))
      .subscribe((playlistTracks: ItemsTrackModel) => {
        this.tracks = playlistTracks;
      });
    this.playlist = playlist;
    this.isOpen = true;
    this.selectPlaylist(playlist.id);
  }

  public selectPlaylist(id: string): void {
    if (!this.selectedId) {
      this.selectedId = id;
    } else {
      this.oldSelected = this.selectedId;
      this.selectedId = id;
    }

    const currentPlaylist = this.children.find(
      item => item.nativeElement.id == id
    );
    const oldPlaylist = this.children.find(
      item => item.nativeElement.id == this.oldSelected
    );

    if (!currentPlaylist) {
      return;
    }
    currentPlaylist.nativeElement.classList.toggle("active");

    if (!oldPlaylist) {
      return;
    }
    oldPlaylist.nativeElement.classList.toggle("active");
  }

  ngOnInit(): void {
    this.loadPlaylists();
  }

  ngOnDestroy(): void {
    this.die$.next();
  }
}
