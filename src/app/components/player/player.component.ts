import { AfterViewInit, Component, OnInit } from "@angular/core";
import { PlayerService } from "../../services/player.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "hb-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.less"]
})
export class PlayerComponent implements OnInit, AfterViewInit {
  isMobile!: boolean;
  drawerVisible = false;

  constructor(
    public playerService: PlayerService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isMobile = window.screen.width < 790;
    this.playerService.createAudioElement();
  }

  ngAfterViewInit() {
    window.addEventListener("resize", () => {
      this.isMobile = window.screen.width < 790;
    });
  }

  changeVisiblePlayerControlOnMobile(): void {
    if (this.isMobile) {
      this.drawerVisible = !this.drawerVisible;
    }
  }
}
