import { Component } from "@angular/core";
import { ThemeStateService } from "src/app/services/theme-state.service";

@Component({
  selector: "hb-favorite-tracks-page",
  templateUrl: "./favorite-tracks-page.component.html",
  styleUrls: ["./favorite-tracks-page.component.less"]
})
export class FavoriteTracksPageComponent {
  constructor(public themeStateService: ThemeStateService) {}
}
