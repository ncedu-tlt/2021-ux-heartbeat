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
import { TrackLaunchContextEnum } from "../../../models/track-launch-context.enum";

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
  @Input() public trackContext!: string | TrackLaunchContextEnum;

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
        if (
          currentTrack?.id === this.track.id &&
          this.trackContext === this.playerService.trackContext$.getValue()
        ) {
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

  setCurrentTrack(): void {
    this.playerService.currentTrackInfo$.next(this.track);
    this.playerService.trackContext$.next(this.trackContext);
    this.playTrack.emit();
  }

  controlPlayerCurrentTrack(): void {
    if (this.playerService.currentTrackInfo$.getValue()?.id !== this.track.id) {
      this.setCurrentTrack();
    } else {
      if (this.trackContext !== this.playerService.trackContext$.getValue()) {
        this.setCurrentTrack();
      }
    }
    this.playerService.switchPlayerAction();
  }
}
