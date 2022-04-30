import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError, Subscription, throwError } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { ApiService } from "src/app/services/api.service";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";
import { ErrorHandlingService } from "../../services/error-handling.service";

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
    public themeStateService: ThemeStateService,
    public error: ErrorHandlingService
  ) {
    this.genre = String(this.activatedRoute.snapshot.paramMap.get("genre"));
  }

  ngOnInit(): void {
    this.playlistsCollection$ = this.apiService
      .getCategoriesPlaylists(this.genre)
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          if (
            error.status === 404 &&
            error.error.error.message === "Specified id doesn't exist"
          ) {
            this.isLoading = false;
            this.isDisabled = true;
          }
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(playlistsCollection => {
        this.playlists = playlistsCollection.playlists.items;
        this.isLoading = false;
      });
  }

  showMore(): void {
    this.offset += 10;
    this.apiService
      .getCategoriesPlaylists(this.genre, this.offset)
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
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
