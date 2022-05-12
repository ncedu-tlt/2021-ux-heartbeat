import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ThemeStateService {
  private isDarkTheme = false;

  ThemeStateService() {
    this.isDarkTheme = localStorage.getItem("isDarkTheme") === "true";
  }

  public getIsDarkTheme(): boolean {
    return this.isDarkTheme;
  }

  public setIsDarkTheme(isDarkTheme: boolean): void {
    this.isDarkTheme = isDarkTheme;
    localStorage.setItem("isDarkTheme", JSON.stringify(this.isDarkTheme));
    document.body.style.background = isDarkTheme
      ? "linear-gradient(252.82deg, rgba(54, 66, 109) 72.05%, rgba(12, 14, 24, 0.7) 100%) no-repeat fixed"
      : "#FFFFFF";
  }
}
