import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { NZ_I18N } from "ng-zorro-antd/i18n";
import { ru_RU } from "ng-zorro-antd/i18n";
import { registerLocaleData } from "@angular/common";
import ru from "@angular/common/locales/ru";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IconsProviderModule } from "./icons-provider.module";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseClient } from "./clients/supabase.client";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { PlayerComponent } from "./components/player/player.component";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { TimeFormatPipe } from "./pipes/time-format.pipe";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzButtonModule } from "ng-zorro-antd/button";
import { AuthGuard } from "./guards/auth.guard";
import { TrackComponent } from "./components/track/track/track.component";
import { TrackListComponent } from "./components/track-list/track-list/track-list.component";
import { UserMenuComponent } from "./components/user-menu/user-menu.component";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { HeaderComponent } from "./components/header/header.component";
import { SearchComponent } from "./components/search/search.component";
import { SearchPageComponent } from "./pages/search-page/search-page.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { PlaylistsPageComponent } from "./pages/playlists-page/playlists-page.component";
import { RecommendationPageComponent } from "./pages/recommendation-page/recommendation-page.component";
import { ArtistPageComponent } from "./pages/artist-page/artist-page.component";
import { AlbumsPageComponent } from "./pages/albums-page/albums-page.component";
import { FollowedArtistPageComponent } from "./pages/followed-artist-page/followed-artist-page.component";
import { GenrePageComponent } from "./pages/genre-page/genre-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { GenresCollectionPageComponent } from "./pages/genres-collection-page/genres-collection-page.component";
import { FavoriteTracksPageComponent } from "./pages/favorite-tracks-page/favorite-tracks-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { ArtistCardComponent } from "./components/artist-card/artist-card.component";
import { RoundArtistCardComponent } from "./components/round-artist-card/round-artist-card.component";
import { GenreCardComponent } from "./components/genre-card/genre-card.component";
import { PlaylistCardComponent } from "./components/playlist-card/playlist-card.component";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { PulselineComponent } from "./components/pulseline/pulseline.component";
import { RecommendationCardComponent } from "src/app/components/recomendation-card/recommendation-card.component";
import { NzResultModule } from "ng-zorro-antd/result";
import { NzMessageModule } from "ng-zorro-antd/message";
import { AlbumCardComponent } from "./components/album-card/album-card.component";
import { TrackExtendedComponent } from "./components/track-extended/track-extended.component";
import { TrackListExtendedComponent } from "./components/track-list-extended/track-list-extended.component";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzBackTopModule } from "ng-zorro-antd/back-top";

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PlayerComponent,
    TimeFormatPipe,
    LoginPageComponent,
    LoaderComponent,
    TrackListComponent,
    TrackComponent,
    UserMenuComponent,
    HeaderComponent,
    SearchComponent,
    SearchPageComponent,
    UserProfileComponent,
    MainPageComponent,
    PlaylistsPageComponent,
    RecommendationPageComponent,
    ArtistPageComponent,
    AlbumsPageComponent,
    FollowedArtistPageComponent,
    GenrePageComponent,
    HomePageComponent,
    GenresCollectionPageComponent,
    FavoriteTracksPageComponent,
    NotFoundPageComponent,
    ArtistCardComponent,
    RoundArtistCardComponent,
    ArtistCardComponent,
    GenreCardComponent,
    PlaylistCardComponent,
    PulselineComponent,
    RecommendationCardComponent,
    AlbumCardComponent,
    RecommendationCardComponent,
    AlbumCardComponent,
    TrackExtendedComponent,
    TrackListExtendedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzNotificationModule,
    NzMessageModule,
    NzProgressModule,
    NzToolTipModule,
    NzDrawerModule,
    NzButtonModule,
    NzDropDownModule,
    NzEmptyModule,
    NzResultModule,
    NzUploadModule,
    NzInputModule,
    NzBackTopModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: ru_RU },
    { provide: SupabaseClient, useFactory: createSupabaseClient },
    [AuthGuard]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
