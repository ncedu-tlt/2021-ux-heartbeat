import { Injectable } from "@angular/core";
import { PlayerTrackInfoModel } from "../models/player-track-info.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  currentTrackInfo = new BehaviorSubject<PlayerTrackInfoModel>({
    artist: "The Weeknd",
    name: "Sacrifise",
    url: "https://p.scdn.co/mp3-preview/4892940fb0fed9666392fad90945837fe769994f?cid=774b29d4f13844c495f206cafdad9c86",
    img: "https://i.scdn.co/image/ab67616d0000b2734ab2520c2c77a1d66b9ee21d"
  });

  getTrack(trackInfo: PlayerTrackInfoModel) {
    this.currentTrackInfo.next(trackInfo);
  }
}
