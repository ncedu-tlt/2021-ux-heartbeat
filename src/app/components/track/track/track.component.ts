import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PlayerService } from "../../../services/player.service";
import { PlayerTrackInfoModel } from "../../../models/player-track-info.model";
import { combineLatest, Subscription } from "rxjs";

@Component({
  selector: "hb-track",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.less"]
})
export class TrackComponent implements OnInit, OnDestroy {
  public trackTime = 30;
  public trackInfo!: PlayerTrackInfoModel;
  private controlActiveTrack: Subscription = new Subscription();
  public isPlay = false;

  @Input() public track!: PlayerTrackInfoModel;

  constructor(public playerService: PlayerService) {}

  ngOnInit() {
    this.trackInfo = this.track;
    this.controlActiveTrack = combineLatest(
      this.playerService.currentTrackInfo,
      this.playerService.isPlay
    ).subscribe(([currentTrack, isPlay]) => {
      if (currentTrack?.trackName === this.trackInfo.trackName) {
        this.isPlay = isPlay;
      } else {
        this.isPlay = false;
      }
    });
  }

  ngOnDestroy() {
    this.controlActiveTrack.unsubscribe();
  }

  controlPlayerCurrentTrack() {
    if (this.playerService.currentTrackInfo.getValue() !== this.trackInfo) {
      this.playerService.currentTrackInfo.next(this.trackInfo);
    }
    this.playerService.switchPlayerAction();
  }
}
