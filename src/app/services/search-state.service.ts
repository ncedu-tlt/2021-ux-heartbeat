import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SearchStateService {
  public searchState$: Subject<string> = new Subject();

  public getSearchState(): Observable<string> {
    return this.searchState$.asObservable();
  }
  public setSearchState(searchValue: string): void {
    if (searchValue) {
      this.searchState$.next(searchValue);
    }
  }
}
