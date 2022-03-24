import { Component, Input } from "@angular/core";
import { ItemUserPlaylistModel } from "src/app/models/new-api-models/current-users-playlist.model";

@Component({
  selector: "hb-playlist-card",
  templateUrl: "./playlist-card.component.html",
  styleUrls: ["./playlist-card.component.less"]
})
export class PlaylistCardComponent {
  @Input() public playlist!: ItemUserPlaylistModel;
}
