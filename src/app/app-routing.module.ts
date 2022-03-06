import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { AuthGuard } from "./guards/auth.guard";
import { SearchPageComponent } from "./pages/search-page/search-page.component";

const routes: Routes = [
  { path: "user", component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: "", component: LoginPageComponent },
  { path: "search", component: SearchPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
