import { Injectable } from "@angular/core";
import { ActivatedRoute, CanActivateChild, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthChildrenGuard implements CanActivateChild {
  constructor(
    private authService: AuthService,
    public router: Router,
    public route: ActivatedRoute
  ) {}
  canActivateChild(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(["/auth"]);
      return false;
    }
  }
}
