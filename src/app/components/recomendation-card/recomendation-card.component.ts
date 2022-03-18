import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { PlaylistTrackModel } from "src/app/models/new-api-models/top-tracks-artist-by-id.model";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "hb-recomendation-card",
  templateUrl: "./recomendation-card.component.html",
  styleUrls: ["./recomendation-card.component.less"]
})
export class RecomendationCardComponent {
  @Input() public recomendation!: ItemUserPlaylistModel;
  public trackInfo!: PlaylistTrackModel[];
  public isCard = true;
  public trackTime = 30;
  public info$ = new Subscription();

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.info$ = this.apiService
      .getPlaylistTracks(this.recomendation.id)
      .subscribe(topTracks => {
        this.trackInfo = topTracks.items.slice(0, 4);
      });
  }

  ngOnDestroy(): void {
    this.info$.unsubscribe();
  }
}
