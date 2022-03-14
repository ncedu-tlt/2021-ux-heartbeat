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
  public recomendations: ItemUserPlaylistModel[] = [];
  public recomendations$ = new Subscription();

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.recomendations$ = this.apiService
      .getFeaturedPlaylists()
      .subscribe(recommendationsPlaylist => {
        this.recomendations = recommendationsPlaylist.playlists.items;
      });
  }

  ngOnDestroy(): void {
    this.recomendations$.unsubscribe();
  }
}
