import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { FollowedArtistModel } from "../../models/new-api-models/followed-artist.model";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "hb-followed-artist-page",
  templateUrl: "./followed-artist-page.component.html",
  styleUrls: ["./followed-artist-page.component.less"]
})
export class FollowedArtistPageComponent implements OnInit {
  public artistInfo$ = new BehaviorSubject<ArtistByIdModel[] | null>(null);
  public isLoading = true;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService
      .getFollowedArtists()
      .subscribe((artistList: FollowedArtistModel) => {
        if (artistList.artists.items.length) {
          this.artistInfo$.next(artistList.artists.items);
        } else {
          this.artistInfo$.next(null);
        }
        this.isLoading = false;
      });
  }
}
