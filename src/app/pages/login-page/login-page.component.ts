import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "hb-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.less"]
})
export class LoginPageComponent implements OnDestroy {
  private authSubscription: Subscription;

  constructor(public authService: AuthService, private router: Router) {
    this.authSubscription = this.authService
      .getAuthStateChange()
      .subscribe((event: AuthChangeEvent | null) => {
        if (event === "SIGNED_IN") {
          this.router.navigateByUrl("/home/recommendations");
          return;
        }

        if (event === "SIGNED_OUT") {
          this.router.navigateByUrl("/auth");
          return;
        }
      });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
