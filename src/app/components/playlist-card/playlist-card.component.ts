import { Component, Input } from "@angular/core";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";
import { ThemeStateService } from "src/app/services/theme-state.service";

@Component({
  selector: "hb-playlist-card",
  templateUrl: "./playlist-card.component.html",
  styleUrls: ["./playlist-card.component.less"]
})
export class PlaylistCardComponent {
  @Input() public playlist!: ItemUserPlaylistModel;

  constructor(public themeStateService: ThemeStateService) {}
}
