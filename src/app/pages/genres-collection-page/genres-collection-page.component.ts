import { Component } from "@angular/core";
import { catchError, Subscription, throwError } from "rxjs";
import { CategoryModel } from "src/app/models/new-api-models/category.model";
import { ApiService } from "src/app/services/api.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { ErrorFromSpotifyModel } from "../../models/error.model";

@Component({
  selector: "hb-genres-collection-page",
  templateUrl: "./genres-collection-page.component.html",
  styleUrls: ["./genres-collection-page.component.less"]
})
export class GenresCollectionPageComponent {
  public genres: CategoryModel[] = [];
  public isLoading = true;
  public genresCollection$ = new Subscription();

  constructor(
    public apiService: ApiService,
    public error: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.genresCollection$ = this.apiService
      .getListCategories()
      .pipe(
        catchError((error: ErrorFromSpotifyModel) => {
          this.error.showErrorNotification(error);
          return throwError(() => new Error(error.error.error.message));
        })
      )
      .subscribe(genresCollection => {
        this.genres = genresCollection.categories.items;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.genresCollection$.unsubscribe();
  }
}
