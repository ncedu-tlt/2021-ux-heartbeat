import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { CategoryModel } from "src/app/models/new-api-models/category.model";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "hb-genres-collection-page",
  templateUrl: "./genres-collection-page.component.html",
  styleUrls: ["./genres-collection-page.component.less"]
})
export class GenresCollectionPageComponent {
  public genres: CategoryModel[] = [];
  public isLoading = true;
  public genresCollection$ = new Subscription();

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.genresCollection$ = this.apiService
      .getListCategories()
      .subscribe(genresCollection => {
        this.genres = genresCollection.categories.items;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.genresCollection$.unsubscribe();
  }
}
