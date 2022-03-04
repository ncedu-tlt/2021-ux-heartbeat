import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { AuthGuard } from "./guards/auth.guard";
import { TrackListComponent } from "./components/track-list/track-list/track-list.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { AlbumsPageComponent } from "./pages/albums-page/albums-page.component";
import { FollowedArtistPageComponent } from "./pages/followed-artist-page/followed-artist-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { GenresCollectionPageComponent } from "./pages/genres-collection-page/genres-collection-page.component";
import { RecommendationPageComponent } from "./pages/recommendation-page/recommendation-page.component";
import { SearchPageComponent } from "./pages/search-page/search-page.component";
import { AlbumPageComponent } from "./pages/album-page/album-page.component";
import { ArtistPageComponent } from "./pages/artist-page/artist-page.component";

const routes: Routes = [
  { path: "auth", component: LoginPageComponent },
  { path: "", redirectTo: "playlist", pathMatch: "full" },
  {
    path: "",
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "playlists",
        component: TrackListComponent
      },
      {
        path: "user",
        component: UserProfileComponent
      },
      {
        path: "albums",
        component: AlbumsPageComponent
      },
      {
        path: "album/:id",
        component: AlbumPageComponent
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
            component: HomePageComponent
          },
          {
            path: "recommendations",
            component: RecommendationPageComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
