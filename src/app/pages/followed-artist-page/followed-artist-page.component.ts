import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { FollowedArtistModel } from "../../models/new-api-models/followed-artist.model";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { catchError, Subscription, throwError } from "rxjs";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";

@Component({
  selector: "hb-followed-artist-page",
  templateUrl: "./followed-artist-page.component.html",
  styleUrls: ["./followed-artist-page.component.less"]
})
export class FollowedArtistPageComponent implements OnInit, OnDestroy {
  public artists: ArtistByIdModel[] = [];
  public isLoading = true;
  public followedArtists$ = new Subscription();

  constructor(
    private apiService: ApiService,
    public themeStateService: ThemeStateService,
    public error: ErrorHandlingService
  ) {}

  ngOnInit() {
    this.followedArtists$ = this.apiService
      .getFollowedArtists()
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe((artistList: FollowedArtistModel) => {
        this.artists = artistList.artists.items;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.followedArtists$.unsubscribe();
  }
}
