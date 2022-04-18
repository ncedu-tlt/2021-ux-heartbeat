import { Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiService } from "../../services/api.service";
import { UserProfileModel } from "../../models/new-api-models/user-profile.model";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { FollowedArtistModel } from "../../models/new-api-models/followed-artist.model";
import { ItemsTrackModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";
import {
  AlbumItemModel,
  ItemsAlbumModel
} from "../../models/new-api-models/album-by-id.model";

@Component({
  selector: "hb-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.less"]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public user!: UserProfileModel;
  public userImage = "";
  public tracks!: ItemsTrackModel;
  public artists!: AlbumItemModel[];
  public followings = 0;
  public trackContext = TrackLaunchContextEnum.TOP_TRACKS;
  public isLoading = true;
  private die$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    public themeStateService: ThemeStateService
  ) {}

  getUserProfile(): Observable<UserProfileModel> {
    return this.apiService.getCurrentUsersProfile();
  }

  getUserSubs(): Observable<FollowedArtistModel> {
    return this.apiService.getFollowedArtists();
  }

  getTopTracks(): Observable<ItemsTrackModel> {
    return this.apiService.getUserTopTracks();
  }

  getTopArtists(): Observable<ItemsAlbumModel> {
    return this.apiService.getUserTopArtists();
  }

  loadData(): void {
    combineLatest([
      this.getUserProfile(),
      this.getUserSubs(),
      this.getTopTracks(),
      this.getTopArtists()
    ])
      .pipe(takeUntil(this.die$))
      .subscribe(([userInfo, userSubs, userTracks, userArtists]) => {
        this.user = userInfo;
        this.userImage = userInfo.images[0]?.url;
        this.followings = userSubs.artists.items.length;
        this.tracks = userTracks;
        this.artists = userArtists.items;
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.die$.next();
  }
}
