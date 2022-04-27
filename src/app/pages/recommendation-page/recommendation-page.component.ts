import { Component } from "@angular/core";
import { catchError, Subscription, throwError } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { ApiService } from "src/app/services/api.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";

@Component({
  selector: "hb-recommendation-page",
  templateUrl: "./recommendation-page.component.html",
  styleUrls: ["./recommendation-page.component.less"]
})
export class RecommendationPageComponent {
  public recommendations: ItemUserPlaylistModel[] = [];
  public isLoading = true;
  public recommendations$ = new Subscription();

  constructor(
    public apiService: ApiService,
    public error: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.recommendations$ = this.apiService
      .getFeaturedPlaylists()
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(recommendationsPlaylist => {
        this.recommendations = recommendationsPlaylist.playlists.items;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.recommendations$.unsubscribe();
  }
}
