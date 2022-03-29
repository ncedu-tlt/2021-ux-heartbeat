import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { ApiService } from "src/app/services/api.service";
import { ThemeStateService } from "src/app/services/theme-state.service";

@Component({
  selector: "hb-genre-page",
  templateUrl: "./genre-page.component.html",
  styleUrls: ["./genre-page.component.less"]
})
export class GenrePageComponent {
  public playlists: ItemUserPlaylistModel[] = [];
  public genre: string;
  public isDisabled = false;
  public offset = 0;
  public isLoading = true;
  public playlistsCollection$ = new Subscription();

  constructor(
    public apiService: ApiService,
    public activatedRoute: ActivatedRoute,
    public themeStateService: ThemeStateService
  ) {
    this.genre = String(this.activatedRoute.snapshot.paramMap.get("genre"));
  }

  ngOnInit(): void {
    this.playlistsCollection$ = this.apiService
      .getCategoriesPlaylists(this.genre)
      .subscribe(playlistsCollection => {
        this.playlists = playlistsCollection.playlists.items;
        this.isLoading = false;
      });
  }

  showMore(): void {
    this.offset += 10;
    this.apiService
      .getCategoriesPlaylists(this.genre, this.offset)
      .subscribe(playlistsCollection => {
        this.playlists.push(...playlistsCollection.playlists.items);
        this.isLoading = false;
        if (playlistsCollection.playlists.items.length < 10) {
          this.isDisabled = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.playlistsCollection$.unsubscribe();
  }
}
