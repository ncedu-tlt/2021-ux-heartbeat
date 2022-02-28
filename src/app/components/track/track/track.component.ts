import { Component, Input, OnInit } from "@angular/core";
import { PlayerService } from "../../../services/player.service";
import { PlayerTrackInfoModel } from "../../../models/player-track-info.model";
import { combineLatest, tap } from "rxjs";

@Component({
  selector: "hb-track",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.less"]
})
export class TrackComponent implements OnInit {
  trackTime = 30;
  trackInfo!: PlayerTrackInfoModel;

  @Input() public track!: PlayerTrackInfoModel;

  isPlay = false;

  constructor(public playerService: PlayerService) {}

  ngOnInit() {
    this.trackInfo = this.track;
    combineLatest(
      this.playerService.currentTrackInfo,
      this.playerService.isPlay
    )
      .pipe(
        tap(([currentTrack, isPlay]) => {
          if (currentTrack?.trackName === this.trackInfo.trackName) {
            this.isPlay = isPlay;
          } else {
            this.isPlay = false;
          }
        })
      )
      .subscribe();
  }

  controlPlayerCurrentTrack() {
    if (this.playerService.currentTrackInfo.getValue() !== this.trackInfo) {
      this.playerService.currentTrackInfo.next(this.trackInfo);
    }
    this.playerService.switchPlayerAction();
  }
}
