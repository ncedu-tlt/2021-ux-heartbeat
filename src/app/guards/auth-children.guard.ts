import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CanActivateChild, Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthChildrenGuard implements CanActivateChild {
  constructor(private authService: AuthService, public router: Router) {}
  canActivateChild(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(["/auth"]);
      return false;
    }
  }
}
