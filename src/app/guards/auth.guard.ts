import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(public router: Router) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUrl = new URL(window.location.href);
    const accessToken = currentUrl.hash.substring(14);
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      return true;
    } else {
      void this.router.navigate(["/"]);
      return false;
    }
  }
}
