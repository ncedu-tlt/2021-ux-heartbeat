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

@Component({
  selector: "hb-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.less"]
})
export class PlayerComponent {
  private player: HTMLAudioElement | undefined;
  private context: AudioContext | undefined;

  public musicCurrentTime$ = new BehaviorSubject<number>(0);
  private stop$: Subject<any> = new Subject();
  // private musicFile$ = new BehaviorSubject<string>(" ");
  private musicFile =
    "https://p.scdn.co/mp3-preview/4892940fb0fed9666392fad90945837fe769994f?cid=774b29d4f13844c495f206cafdad9c86";

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
    this.player.src = this.musicFile;
    this.player.crossOrigin = "anonymous";
    const source = this.context.createMediaElementSource(this.player);
    source.connect(analyser);
    analyser.connect(this.context.destination);
    this.player.autoplay = false;
  }
  changePlayerState(): void {
    if (this.player != undefined) {
      if (this.player.paused) {
        const musicTimer: Observable<number> = interval(1000);
        void this.player.play();
        musicTimer.pipe(takeUntil(this.stop$)).subscribe(() => {
          this.musicCurrentTime$.next(
            Math.round(this.player?.currentTime as number)
          );
        });
      } else {
        this.player.pause();
        this.stop$.next(true);
      }
    }
  }

  putOnAutoplay(): void {
    (this.player as HTMLAudioElement).loop = !this.player?.loop;
  }
}
