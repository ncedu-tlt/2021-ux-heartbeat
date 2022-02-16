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
  private authStateChange$ = new Subject<AuthChangeEvent>();

  private user$ = new BehaviorSubject<User | null>(null);
  private session$ = new BehaviorSubject<Session | null>(null);

  private SCOPES =
    "playlist-read-private playlist-read-collaborative user-top-read user-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read user-library-modify";

  constructor(
    private supabase: SupabaseClient,
    private notificationService: NzNotificationService
  ) {
    this.supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        this.authStateChange$.next(event);
        this.user$.next(this.supabase.auth.user());
        this.session$.next(session);
      }
    );
  }

  async signInWithSpotify(): Promise<void> {
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

  async signOutOfSpotify(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error !== null) {
      this.errorHandling(error);
    }
  }

  getAuthToken(): string | undefined | null {
    return this.session$.getValue()?.provider_token;
  }

  errorHandling(error: ApiError): void {
    this.notificationService.blank("Error", `${error?.message}`);
  }
}
