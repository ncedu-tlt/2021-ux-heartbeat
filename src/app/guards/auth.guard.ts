import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.authService.checkAuthToken().subscribe(token => {
        if (token) {
          resolve(true);
        } else {
          void this.router.navigate(["/"]);
          resolve(false);
        }
      });
    });
  }
}
