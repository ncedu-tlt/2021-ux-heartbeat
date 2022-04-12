import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "hb-recommendation-page",
  templateUrl: "./recommendation-page.component.html",
  styleUrls: ["./recommendation-page.component.less"]
})
export class RecommendationPageComponent {
  public recommendations: ItemUserPlaylistModel[] = [];
  public isLoading = true;
  public recommendations$ = new Subscription();

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.recommendations$ = this.apiService
      .getFeaturedPlaylists()
      .subscribe(recommendationsPlaylist => {
        this.recommendations = recommendationsPlaylist.playlists.items;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.recommendations$.unsubscribe();
  }
}
