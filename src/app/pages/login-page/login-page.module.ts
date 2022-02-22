import { NgModule } from "@angular/core";
import { LoginPageComponent } from "./login-page.component";
import { LoginPageRoutingModule } from "./login-page-routing.module";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconTestModule } from "ng-zorro-antd/icon/testing";

@NgModule({
  imports: [
    LoginPageRoutingModule,
    NzLayoutModule,
    NzButtonModule,
    NzIconTestModule
  ],
  declarations: [LoginPageComponent],
  exports: [LoginPageComponent]
})
export class LoginPageModule {}
