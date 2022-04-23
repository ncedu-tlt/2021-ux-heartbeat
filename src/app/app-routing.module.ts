import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { AuthGuard } from "./guards/auth.guard";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { AlbumsPageComponent } from "./pages/albums-page/albums-page.component";
import { FollowedArtistPageComponent } from "./pages/followed-artist-page/followed-artist-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { GenresCollectionPageComponent } from "./pages/genres-collection-page/genres-collection-page.component";
import { RecommendationPageComponent } from "./pages/recommendation-page/recommendation-page.component";
import { SearchPageComponent } from "./pages/search-page/search-page.component";
import { ArtistPageComponent } from "./pages/artist-page/artist-page.component";
import { PlaylistsPageComponent } from "./pages/playlists-page/playlists-page.component";
import { FavoriteTracksPageComponent } from "./pages/favorite-tracks-page/favorite-tracks-page.component";
import { GenrePageComponent } from "./pages/genre-page/genre-page.component";
import { AuthChildrenGuard } from "./guards/auth-children.guard";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";

const routes: Routes = [
  { path: "auth", component: LoginPageComponent },
  { path: "home", redirectTo: "home/recommendations", pathMatch: "full" },
  { path: "", redirectTo: "home/recommendations", pathMatch: "full" },
  {
    path: "",
    component: MainPageComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthChildrenGuard],
    children: [
      {
        path: "user",
        component: UserProfileComponent
      },
      {
        path: "playlists",
        component: PlaylistsPageComponent
      },
      {
        path: "albums",
        component: AlbumsPageComponent
      },
      {
        path: "favorite",
        component: FavoriteTracksPageComponent
      },
      {
        path: "artists",
        component: FollowedArtistPageComponent
      },
      {
        path: "artist/:id",
        component: ArtistPageComponent
      },
      {
        path: "search",
        component: SearchPageComponent
      },
      {
        path: "home",
        component: HomePageComponent,
        children: [
          {
            path: "genres-collection",
            component: GenresCollectionPageComponent
          },
          {
            path: "genres-collection/:genre",
            component: GenrePageComponent
          },
          {
            path: "recommendations",
            component: RecommendationPageComponent
          }
        ]
      }
    ]
  },
  { path: "**", component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
