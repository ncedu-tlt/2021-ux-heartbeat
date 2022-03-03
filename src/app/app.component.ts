import { Component } from "@angular/core";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "hb-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
