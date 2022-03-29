import { Component } from "@angular/core";
import { ThemeStateService } from "src/app/services/theme-state.service";

@Component({
  selector: "hb-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.less"]
})
export class HomePageComponent {
  constructor(public themeStateService: ThemeStateService) {}
}
