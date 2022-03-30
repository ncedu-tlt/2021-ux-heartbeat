import { Component } from "@angular/core";
import { ThemeStateService } from "src/app/services/theme-state.service";
@Component({
  selector: "hb-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.less"]
})
export class SidebarComponent {
  constructor(public themeStateService: ThemeStateService) {}

  changeTheme(): void {
    this.themeStateService.setIsDarkTheme(
      !this.themeStateService.getIsDarkTheme()
    );
  }
}
