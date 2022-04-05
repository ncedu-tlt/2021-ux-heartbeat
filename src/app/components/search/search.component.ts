import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SearchStateService } from "../../services/search-state.service";
import { debounceTime, Subject, Subscription } from "rxjs";

@Component({
  selector: "hb-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.less"]
})
export class SearchComponent {
  public search = "";
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription!: Subscription;
  public debounceTime = 1000;

  constructor(
    private router: Router,
    private searchStateService: SearchStateService
  ) {}

  ngOnInit(): void {
    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe(() => {
        this.search = this.search.trim();
        this.searchStateService.setSearchState(this.search);
      });
  }

  searchBtnClicked() {
    this.router.navigateByUrl(`/search?keyword=${this.search}`);
  }

  inputChanged(): void {
    this.modelChanged.next(this.search);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
