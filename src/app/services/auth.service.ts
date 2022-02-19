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

const SCOPES =
  "playlist-read-private playlist-read-collaborative user-top-read user-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read user-library-modify";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private authStateChange$ = new Subject<AuthChangeEvent>();
  private user$ = new BehaviorSubject<User | null>(null);
  private session$ = new BehaviorSubject<Session | null>(null);
  private token$ = new BehaviorSubject<string | null | undefined>(null);

  constructor(
    private supabase: SupabaseClient,
    private notificationService: NzNotificationService
  ) {
    this.supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        this.authStateChange$.next(event);
        this.user$.next(this.supabase.auth.user());
        this.session$.next(session);
        this.token$.next(session?.provider_token);
      }
    );
  }

  async signInWithSpotify(): Promise<void> {
    const { error, user, session } = await this.supabase.auth.signIn(
      {
        provider: "spotify"
      },
      {
        redirectTo: "http://localhost:4200/user",
        // redirectTo: "http://localhost:4200/user",
        scopes: SCOPES
      }
    );
    if (error !== null) {
      this.errorHandling(error);
    } else {
      this.user$.next(user);
      this.session$.next(session);
      this.token$.next(session?.provider_token);
    }
  }

  async signOutOfSpotify(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    this.token$.next(null);
    if (error !== null) {
      this.errorHandling(error);
    }
  }

  // getAuthToken(): string | undefined | null {
  //   console.log("getAuthToken", this.token$.getValue());
  //   return this.token$.getValue();
  // }

  errorHandling(error: ApiError): void {
    this.notificationService.blank("Error", error?.message);
  }

  checkAuthToken(): BehaviorSubject<string | undefined | null> {
    return this.token$;
  }
}
