import { Injectable } from "@angular/core";
import {
  ApiError,
  AuthChangeEvent,
  Session,
  SupabaseClient,
  User
} from "@supabase/supabase-js";
import { BehaviorSubject, Subject } from "rxjs";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public authStateChange$ = new Subject<AuthChangeEvent>();

  public user$ = new BehaviorSubject<User | null>(null);
  public session$ = new BehaviorSubject<Session | null>(null);

  public SCOPES =
    "playlist-read-private playlist-read-collaborative user-top-read user-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read user-library-modify";

  constructor(
    private supabase: SupabaseClient,
    private notificationService: NzNotificationService
  ) {
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.authStateChange$.next(event);
      this.user$.next(this.supabase.auth.user());
      this.session$.next(session);
    });
  }

  async signInWithSpotify() {
    const { user, session, error } = await this.supabase.auth.signIn(
      {
        provider: "spotify"
      },
      {
        scopes: this.SCOPES
      }
    );
    if (error !== null) {
      this.errorHandling(error);
    } else {
      this.user$.next(user);
      this.session$.next(session);
    }
  }

  async signOutOfSpotify() {
    const { error } = await this.supabase.auth.signOut();
    if (error !== null) {
      this.errorHandling(error);
    }
  }

  getAuthToken() {
    return this.session$.getValue()?.provider_token;
  }

  errorHandling(error: ApiError) {
    this.notificationService.blank("Error", `${error?.message}`);
  }
}
