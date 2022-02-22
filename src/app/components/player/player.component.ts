import { Component } from "@angular/core";
import { PlayerService } from "../../services/player.service";
import { AuthService } from "../../services/auth.service";
import {
  BehaviorSubject,
  interval,
  Observable,
  Subject,
  takeUntil
} from "rxjs";
import { NgStyleInterface } from "ng-zorro-antd/core/types/ng-class";

@Component({
  selector: "hb-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.less"]
})
export class PlayerComponent {
  public player!: HTMLAudioElement;
  private context!: AudioContext;

  public currentPositionOnProgressBar: number | undefined;
  public currentTooltipPosition: NgStyleInterface = { left: "-18px" };

  public timeOnTooltip = new BehaviorSubject<number>(0);
  public musicVolume$ = new BehaviorSubject<number>(100);
  public musicCurrentTime$ = new BehaviorSubject<number>(0);
  private stop$: Subject<void> = new Subject();

  isPlay = false;
  isRepeat = false;

  constructor(
    public playerService: PlayerService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createAudioElement();
    document.addEventListener("click", this.resumeContext);
  }

  resumeContext = (): void => {
    void this.context.resume();
    document.removeEventListener("click", this.resumeContext);
  };

  createAudioElement(): void {
    this.player = new Audio();
    this.context = new AudioContext();
    const analyser = this.context.createAnalyser();
    this.player.src = this.playerService.currentTrackInfo.getValue().url;
    this.player.crossOrigin = "anonymous";
    const source = this.context.createMediaElementSource(this.player);
    source.connect(analyser);
    analyser.connect(this.context.destination);
    this.player.autoplay = false;
    this.player.loop = false;
  }

  switchPlayerAction(): void {
    this.isPlay = !this.isPlay;
    if (this.player.paused) {
      const musicTimer: Observable<number> = interval(1000);
      void this.player.play();
      musicTimer.pipe(takeUntil(this.stop$)).subscribe(() => {
        this.musicCurrentTime$.next(Math.round(this.player.currentTime));
        this.displayScaleProgress(Math.round(this.player.currentTime));
        this.checkMusicEnd();
      });
    } else {
      this.player.pause();
      this.stop$.next();
    }
  }

  displayScaleProgress(currentTime: number): void {
    this.currentPositionOnProgressBar =
      (currentTime / Math.round(this.player.duration)) * 100;
  }

  changeMusicProgress(event: MouseEvent): void {
    this.player.currentTime = Math.round(
      (event.offsetX / (event.target as HTMLElement).offsetWidth) *
        this.player.duration
    );
    this.musicCurrentTime$.next(this.player.currentTime);
    this.displayScaleProgress(this.player.currentTime);
  }

  changeTooltipPosition(event: MouseEvent): void {
    this.timeOnTooltip.next(
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
    this.player.loop = !this.player?.loop;
  }

  checkMusicEnd(): void {
    if (
      this.player.currentTime === this.player?.duration &&
      !this.player.loop
    ) {
      this.player.pause();
      this.isPlay = !this.isPlay;
      this.stop$.next();
    }
  }
}
