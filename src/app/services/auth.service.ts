import { Injectable } from "@angular/core";
import {
  ApiError,
  AuthChangeEvent,
  Session,
  SupabaseClient,
  User
} from "@supabase/supabase-js";
import { BehaviorSubject, Observable } from "rxjs";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { UserIdentity } from "@supabase/gotrue-js/dist/main/lib/types";

const SCOPES =
  "playlist-read-private playlist-read-collaborative user-top-read user-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read user-library-modify user-follow-read user-follow-modify user-read-recently-played user-read-playback-state user-modify-playback-state ugc-image-upload";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private authStateChange$ = new BehaviorSubject<AuthChangeEvent | null>(null);
  private user$ = new BehaviorSubject<User | null>(null);
  private session$ = new BehaviorSubject<Session | null>(null);

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

  public getAuthStateChange(): Observable<AuthChangeEvent | null> {
    return this.authStateChange$.asObservable();
  }

  public isLoggedIn(): boolean {
    return !!this.supabase.auth.user();
  }

  async signInWithSpotify(): Promise<void> {
    const { error } = await this.supabase.auth.signIn(
      {
        provider: "spotify"
      },
      {
        scopes: SCOPES
      }
    );
    if (error) {
      this.errorHandling(error);
    }
  }

  async signOutOfSpotify(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      this.errorHandling(error);
    }
  }

  getAuthToken(): string | undefined | null {
    return this.session$.getValue()?.provider_token;
  }

  getUserData(): UserIdentity[] | null | undefined {
    if (this.user$.getValue()?.identities) {
      return this.user$.getValue()?.identities;
    } else return null;
  }

  errorHandling(error: ApiError): void {
    this.notificationService.blank("Error", error?.message);
  }
}
