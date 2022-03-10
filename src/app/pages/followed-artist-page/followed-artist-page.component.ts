import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { FollowedArtistModel } from "../../models/new-api-models/followed-artist.model";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { Subscription } from "rxjs";

@Component({
  selector: "hb-followed-artist-page",
  templateUrl: "./followed-artist-page.component.html",
  styleUrls: ["./followed-artist-page.component.less"]
})
export class FollowedArtistPageComponent implements OnInit, OnDestroy {
  public artists: ArtistByIdModel[] = [];
  public isLoading = true;
  public followedArtists$ = new Subscription();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.followedArtists$ = this.apiService
      .getFollowedArtists()
      .subscribe((artistList: FollowedArtistModel) => {
        this.artists = artistList.artists.items;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.followedArtists$.unsubscribe();
  }
}
