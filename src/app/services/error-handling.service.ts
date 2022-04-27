import { Injectable } from "@angular/core";
import { ErrorFromSpotifyModel } from "../models/error.model";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Injectable({
  providedIn: "root"
})
export class ErrorHandlingService {
  constructor(public notificationService: NzNotificationService) {}

  showErrorNotification(error: ErrorFromSpotifyModel) {
    if (error.status === 401) {
      this.notificationService.error(
        "Ошибка авторизации",
        "Вам необходимо пройти авторизацию заново",
        { nzDuration: 0 }
      );
    }
  }
}
