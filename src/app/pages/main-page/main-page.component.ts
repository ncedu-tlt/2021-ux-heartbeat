import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "hb-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.less"]
})
export class MainPageComponent {
  constructor(public authService: AuthService) {}
}
