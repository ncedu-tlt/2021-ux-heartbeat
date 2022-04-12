import { Component } from "@angular/core";
import { ThemeStateService } from "src/app/services/theme-state.service";
@Component({
  selector: "hb-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.less"]
})
export class SidebarComponent {
  public isSidebarOpen = false;
  public classList = {};
  constructor(public themeStateService: ThemeStateService) {}

  changeTheme(): void {
    this.themeStateService.setIsDarkTheme(
      !this.themeStateService.getIsDarkTheme()
    );
  }

  handleCancel(): void {
    document.body.style.overflow = "visible";
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      this.classList = {
        modal: false
      };
    } else {
      this.classList = {
        modal: true
      };
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      this.classList = {
        modal: false
      };
    } else {
      this.classList = {
        modal: true
      };
    }
  }
}
