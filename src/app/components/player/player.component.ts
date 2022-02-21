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
  public player: HTMLAudioElement | undefined;
  private context: AudioContext | undefined;

  public currentPositionOnProgressBar: number | undefined;
  public currentPositionTooltip: NgStyleInterface = { left: "-18px" };

  public timeOnTooltip = new BehaviorSubject<number | null>(0);
  public musicVolume$ = new BehaviorSubject<number | null>(100);
  public musicCurrentTime$ = new BehaviorSubject<number>(0);
  private stop$: Subject<any> = new Subject();

  playerToggle = false;

  constructor(
    public playerService: PlayerService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createAudioElement();
    document.addEventListener("click", this.resumeContext);
  }

  resumeContext = (): void => {
    void this.context?.resume();
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
  }
  changePlayerState(): void {
    this.playerToggle = !this.playerToggle;
    if (this.player != undefined) {
      if (this.player.paused) {
        const musicTimer: Observable<number> = interval(1000);
        void this.player.play();
        musicTimer.pipe(takeUntil(this.stop$)).subscribe(() => {
          this.musicCurrentTime$.next(
            Math.round(this.player?.currentTime as number)
          );
          this.displayScaleProgress(
            Math.round(this.player?.currentTime as number)
          );
        });
      } else {
        this.player.pause();
        this.stop$.next(true);
      }
    }
  }

  displayScaleProgress(currentTime: number): void {
    this.currentPositionOnProgressBar =
      (currentTime / Math.round(this.player?.duration as number)) * 100;
  }

  changeMusicProgress(event: MouseEvent): void {
    (this.player as HTMLAudioElement).currentTime = Math.round(
      (event.offsetX / (event.target as HTMLElement).offsetWidth) *
        (this.player as HTMLAudioElement).duration
    );
    this.musicCurrentTime$.next((this.player as HTMLAudioElement).currentTime);
    this.displayScaleProgress((this.player as HTMLAudioElement).currentTime);
  }

  changeTooltipPosition(event: MouseEvent): void {
    this.timeOnTooltip.next(
      Math.round(
        (event.offsetX / (event.target as HTMLElement).offsetWidth) *
          (this.player as HTMLAudioElement).duration
      )
    );
    this.currentPositionTooltip["left"] = String(event.offsetX - 18) + "px";
  }

  changeMusicVolume(event: MouseEvent): void {
    (this.player as HTMLAudioElement).volume =
      event.offsetX / (event.target as HTMLElement).offsetWidth;
    this.musicVolume$.next((this.player?.volume as number) * 100);
  }

  putOnAutoplay(): void {
    (this.player as HTMLAudioElement).loop = !this.player?.loop;
  }
}
