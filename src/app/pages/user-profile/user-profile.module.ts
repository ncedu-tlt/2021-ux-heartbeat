import { NgModule } from "@angular/core";
import { UserProfileRoutingModule } from "./user-profile-routing.module";
import { UserProfileComponent } from "./user-profile.component";
import { AuthGuard } from "../../guards/auth.guard";

@NgModule({
  imports: [UserProfileRoutingModule],
  declarations: [UserProfileComponent],
  exports: [UserProfileComponent],
  providers: [AuthGuard]
})
export class UserProfileModule {}
