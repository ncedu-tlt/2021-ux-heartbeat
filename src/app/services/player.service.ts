import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  interval,
  Observable,
  Subject,
  takeUntil
} from "rxjs";
import { NgStyleInterface } from "ng-zorro-antd/core/types/ng-class";
import { ItemsTrackModel } from "../models/new-api-models/top-tracks-artist-by-id.model";
import { SwitchPlayerActionEnum } from "../models/switch-player-action.enum";
import {
  NewItemsModel,
  NewTracksModel
} from "../models/new-api-models/album-by-id.model";
import { TrackById } from "../models/new-api-models/track-by-id.model";
import { TrackLaunchContextEnum } from "../models/track-launch-context.enum";

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  public player!: HTMLAudioElement;
  private context!: AudioContext;

  public currentPositionOnProgressBar: number | undefined;
  public currentTooltipPosition: NgStyleInterface = { left: "-18px" };

  public timeOnTooltip$ = new BehaviorSubject<number>(0);
  public musicVolume$ = new BehaviorSubject<number>(100);
  public musicCurrentTime$ = new BehaviorSubject<number>(0);
  private stop$: Subject<void> = new Subject();

  public currentTrackInfo$ = new BehaviorSubject<
    TrackById | NewItemsModel | null
  >(null);
  public currentTrackNumber!: number;
  public trackList$ = new BehaviorSubject<
    ItemsTrackModel | NewTracksModel | null
  >(null);
  public trackContext$ = new BehaviorSubject<
    string | TrackLaunchContextEnum | null
  >(null);

  public isPlay$ = new BehaviorSubject<boolean>(false);
  public isRepeat = false;

  constructor() {
    document.addEventListener("click", this.resumeContext);
  }

  resumeContext = (): void => {
    this.context.resume();
    document.removeEventListener("click", this.resumeContext);
  };

  createAudioElement(): void {
    if (!this.player) {
      this.player = new Audio();
      this.context = new AudioContext();
      const analyser = this.context.createAnalyser();
      this.currentTrackInfo$.subscribe(track => {
        if (track !== null) {
          this.player.src = track.preview_url;
        } else {
          this.player.src = " ";
        }
      });
      this.trackList$.subscribe(
        (trackList: ItemsTrackModel | NewTracksModel | null) => {
          if (trackList) {
            this.currentTrackNumber = trackList.items.findIndex(el => {
              return el.id === this.currentTrackInfo$.getValue()?.id;
            });
          }
        }
      );
      this.player.crossOrigin = "anonymous";
      const source = this.context.createMediaElementSource(this.player);
      source.connect(analyser);
      analyser.connect(this.context.destination);
      this.player.autoplay = false;
      this.player.loop = false;
    }
  }

  switchPlayerAction(): void {
    if (!this.currentTrackInfo$.getValue()) {
      return;
    }
    if (this.player.paused) {
      const musicTimer: Observable<number> = interval(1000);
      this.player.play();
      this.isPlay$.next(true);
      musicTimer.pipe(takeUntil(this.stop$)).subscribe(() => {
        this.musicCurrentTime$.next(Math.round(this.player.currentTime));
        this.displayScaleProgress(Math.round(this.player.currentTime));
        this.checkMusicEnd();
      });
    } else {
      this.isPlay$.next(false);
      this.player.pause();
      this.stop$.next();
    }
  }

  displayScaleProgress(currentTime: number): void {
    this.currentPositionOnProgressBar =
      (currentTime / Math.round(this.player.duration)) * 100;
  }

  changeMusicProgress(event: MouseEvent): void {
    if (!this.currentTrackInfo$.getValue()) {
      return;
    }
    this.player.currentTime = Math.round(
      (event.offsetX / (event.target as HTMLElement).offsetWidth) *
        this.player.duration
    );
    this.musicCurrentTime$.next(this.player.currentTime);
    this.displayScaleProgress(this.player.currentTime);
  }

  changeTooltipPosition(event: MouseEvent): void {
    this.timeOnTooltip$.next(
      Math.round(
        (event.offsetX / (event.target as HTMLElement).offsetWidth) *
          this.player.duration
      )
    );
    this.currentTooltipPosition["left"] = String(event.offsetX - 18) + "px";
  }

  changeMusicVolume(event: MouseEvent): void {
    this.player.volume =
      event.offsetX / (event.target as HTMLElement).offsetWidth;
    this.musicVolume$.next(this.player.volume * 100);
  }

  putOnRepeat(): void {
    this.isRepeat = !this.isRepeat;
    this.player.loop = !this.player.loop;
  }

  checkMusicEnd(): void {
    if (
      this.player.currentTime === this.player.duration &&
      !this.player.loop &&
      this.checkTrackExistence(this.currentTrackNumber + 1)
    ) {
      this.switchTrack(SwitchPlayerActionEnum.SWITCH_NEXT);
    } else if (
      this.player.currentTime === this.player.duration &&
      !this.player.loop
    ) {
      this.player.pause();
      this.isPlay$.next(false);
      this.stop$.next();
    }
  }

  closeAudioContext(): void {
    this.context.close();
  }

  checkTrackExistence(
    index: number
  ): TrackById | NewItemsModel | null | undefined {
    return this.trackList$.getValue()?.items[index];
  }

  switchTrack(action: SwitchPlayerActionEnum): void {
    const trackNumber: number =
      action === SwitchPlayerActionEnum.SWITCH_NEXT
        ? this.currentTrackNumber + 1
        : this.currentTrackNumber - 1;

    const newTrack = this.checkTrackExistence(trackNumber);
    if (newTrack) {
      this.currentTrackInfo$.next(newTrack);
      this.switchPlayerAction();
      this.currentTrackNumber = trackNumber;
    }
  }
}
