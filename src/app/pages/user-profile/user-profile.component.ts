import { Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiService } from "../../services/api.service";
import { UserProfileModel } from "../../models/new-api-models/user-profile.model";
import { ThemeStateService } from "src/app/services/theme-state.service";
import { NewUserTopTracksItemsModel } from "../../models/new-api-models/top-tracks-artist-by-id.model";
import { TrackLaunchContextEnum } from "../../models/track-launch-context.enum";
import { ConverterService } from "../../services/converter.service";
import { ArtistByIdModel } from "../../models/new-api-models/artist-by-id.model";

@Component({
  selector: "hb-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.less"]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public user!: UserProfileModel;
  public userImage = "";
  public tracks!: NewUserTopTracksItemsModel;
  public artists!: ArtistByIdModel[];
  public followings = 0;
  public trackContext = TrackLaunchContextEnum.TOP_TRACKS;
  public isLoading = true;
  private die$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private convertService: ConverterService,
    public themeStateService: ThemeStateService
  ) {}

  loadData(): void {
    combineLatest([
      this.apiService.getCurrentUsersProfile(),
      this.apiService.getFollowedArtists(),
      this.apiService.getUserTopTracks(),
      this.apiService.getUserTopArtists()
    ])
      .pipe(takeUntil(this.die$))
      .subscribe(([userInfo, userSubs, userTracks, userArtists]) => {
        this.user = userInfo;
        this.userImage = userInfo.images[0]?.url;
        this.followings = userSubs.artists.items.length;
        this.tracks =
          this.convertService.convertTopUserTracksToNewTopUserTracks(
            userTracks
          );
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
