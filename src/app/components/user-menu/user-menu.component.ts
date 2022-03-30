import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserMenuInfoModel } from "../../models/user-menu-info.model";
import { Subscription } from "rxjs";
import { ThemeStateService } from "src/app/services/theme-state.service";

@Component({
  selector: "hb-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.less"]
})
export class UserMenuComponent implements OnDestroy {
  public userName!: string;
  public imageUrl = "";
  private subscription$: Subscription;

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    public themeStateService: ThemeStateService
  ) {
    const httpOptions: object = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${<string>this.authService.getAuthToken()}`,
        "Content-Type": "application/json"
      })
    };
    const url = "https://api.spotify.com/v1/me";
    const request = this.http.get<UserMenuInfoModel>(url, httpOptions);
    this.subscription$ = request.subscribe(response => {
      this.userName = response.display_name;
      this.imageUrl = response.images[0]?.url;
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
