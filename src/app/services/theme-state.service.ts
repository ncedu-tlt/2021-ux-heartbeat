import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ThemeStateService {
  private isDarkTheme = false;

  public getIsDarkTheme(): boolean {
    this.isDarkTheme = localStorage.getItem("isDarkTheme") === "true";
    document.body.style.background = this.isDarkTheme
      ? "linear-gradient(252.82deg, rgba(54, 66, 109) 72.05%, rgba(12, 14, 24, 0.7) 100%) no-repeat fixed"
      : "#FFFFFF";
    return this.isDarkTheme;
  }

  public setIsDarkTheme(isDarkTheme: boolean): void {
    this.isDarkTheme = isDarkTheme;
    localStorage.setItem("isDarkTheme", JSON.stringify(this.isDarkTheme));
  }
}
