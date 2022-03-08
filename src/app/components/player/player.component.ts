import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { PlayerService } from "../../services/player.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "hb-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.less"]
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  isMobile!: boolean;
  drawerVisible = false;

  constructor(
    public playerService: PlayerService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isMobile = window.screen.width < 850;
    this.playerService.createAudioElement();
  }

  ngAfterViewInit(): void {
    window.addEventListener("resize", this.resizeWindow);
  }

  resizeWindow = (): void => {
    if (
      window.screen.width < 850 ||
      document.documentElement.clientWidth < 850
    ) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
      this.drawerVisible = false;
    }
  };

  changeVisiblePlayerControlOnMobile(): void {
    if (this.isMobile) {
      this.drawerVisible = !this.drawerVisible;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.resizeWindow);
    this.playerService.closeAudioContext();
  }
}
