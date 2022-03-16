import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";
import { Subscription } from "rxjs";
import { SearchModel } from "../../models/new-api-models/search.model";
import { ApiService } from "../../services/api.service";
import { TrackById } from "../../models/new-api-models/track-by-id.model";
import { SearchStateService } from "../../services/search-state.service";

@Component({
  selector: "hb-search-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.less"]
})
export class SearchPageComponent {
  public key: string;
  public artists: ArtistByIdModel[] = [];
  public tracks: TrackById[] = [];
  public searchResult$ = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private searchStateService: SearchStateService
  ) {
    this.key = <string>this.activatedRoute.snapshot.queryParams["keyword"];
    this.searchResult$ = this.searchStateService
      .getSearchState()
      .subscribe(key => {
        this.api.searchForItem(key).subscribe((artists: SearchModel) => {
          this.artists = artists.artists.items.filter(
            artist => artist.followers.total > 100
          );
          this.tracks = artists.tracks.items;
        });
      });
  }

  ngOnDestroy() {
    this.searchResult$.unsubscribe();
  }
}
