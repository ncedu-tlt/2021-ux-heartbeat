import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "hb-loginPage",
  templateUrl: "./loginPage.component.html",
  styleUrls: ["./loginPage.component.less"]
})
export class LoginPageComponent {
  constructor(public authService: AuthService) {}
}
