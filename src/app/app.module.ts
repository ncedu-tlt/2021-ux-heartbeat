import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
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
import { LoginPageModule } from "./pages/loginPage/loginPage.module";
import { UserProfileModule } from "./pages/userProfile/user-profile.module";
import { AuthGuard } from "./guards/auth.guard";

registerLocaleData(ru);

@NgModule({
  declarations: [AppComponent],
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
    NzButtonModule,
    LoginPageModule,
    UserProfileModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: ru_RU },
    { provide: SupabaseClient, useFactory: createSupabaseClient },
    [AuthGuard]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
