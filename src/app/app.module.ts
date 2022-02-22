import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
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
import { NzButtonModule } from "ng-zorro-antd/button";
import { AuthGuard } from "./guards/auth.guard";

registerLocaleData(ru);

@NgModule({
  declarations: [AppComponent, LoginPageComponent, UserProfileComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzMenuModule,
    NzNotificationModule,
    NzMenuModule,
    NzButtonModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: ru_RU },
    { provide: SupabaseClient, useFactory: createSupabaseClient },
    [AuthGuard]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
