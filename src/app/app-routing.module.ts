import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { AuthGuard } from "./guards/auth.guard";
import { TrackListComponent } from "./components/track-list/track-list/track-list.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";

const routes: Routes = [
  { path: "auth", component: LoginPageComponent },
  { path: "", redirectTo: "playlist", pathMatch: "full" },
  {
    path: "",
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "playlist",
        component: TrackListComponent
      },
      {
        path: "user",
        component: UserProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
