import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "hb-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.less"]
})
export class UserProfileComponent {
  constructor(public authService: AuthService) {}
}
