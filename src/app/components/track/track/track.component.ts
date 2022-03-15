import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from "@angular/core";
import { PlayerService } from "../../../services/player.service";
import { combineLatest, Subscription } from "rxjs";
import { TrackById } from "../../../models/new-api-models/track-by-id.model";
import { NewItemsModel } from "../../../models/new-api-models/album-by-id.model";

@Component({
  selector: "hb-track",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.less"]
})
export class TrackComponent implements OnInit, OnDestroy {
  public trackTime = 30;
  private controlActiveTrack$: Subscription = new Subscription();
  public isPlay = false;

  @Input() public track!: TrackById | NewItemsModel;
  @Input() public isCard = false;

  @Output() playTrack = new EventEmitter<void>();

  constructor(public playerService: PlayerService) {}

  ngOnInit(): void {
    this.controlActiveTrack$ = combineLatest([
      this.playerService.currentTrackInfo$,
      this.playerService.isPlay$
    ]).subscribe(
      ([currentTrack, isPlay]: [
        currentTrack: TrackById | NewItemsModel | null,
        isPlay: boolean
      ]) => {
        if (currentTrack?.id === this.track.id) {
          this.isPlay = isPlay;
        } else {
          this.isPlay = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.controlActiveTrack$.unsubscribe();
  }

  controlPlayerCurrentTrack(): void {
    if (this.playerService.currentTrackInfo$.getValue() !== this.track) {
      this.playerService.currentTrackInfo$.next(this.track);
    }
    this.playerService.switchPlayerAction();
    this.playTrack.emit();
  }
}
