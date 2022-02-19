import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// import { LoginPageComponent } from "./pages/loginPage/loginPage.component";

const routes: Routes = [
  // { path: "", pathMatch: "full", redirectTo: "/login" },
  // { path: "login", component: LoginPageComponent }
  // {
  //   path: "login",
  //   loadChildren: () =>
  //     import("./pages/loginPage/loginPage.module").then(m => m.LoginPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
