import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { TopTracksModel } from "src/app/models/new-api-models/top-tracks-artist-by-id.model";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "hb-recomendation-card",
  templateUrl: "./recomendation-card.component.html",
  styleUrls: ["./recomendation-card.component.less"]
})
export class RecomendationCardComponent {
  @Input() public recomendation!: ItemUserPlaylistModel;
  public trackInfo: TopTracksModel[] = [];
  public isCard = true;
  public trackTime = 30;
  public info$ = new Subscription();

  constructor(public apiService: ApiService) {}

  ngOnInit() {
    this.info$ = this.apiService
      .getArtistsTopTracks(this.recomendation.id)
      .subscribe(topTracks => {
        this.trackInfo = topTracks.tracks.slice(0, 4);
      });
  }
}
