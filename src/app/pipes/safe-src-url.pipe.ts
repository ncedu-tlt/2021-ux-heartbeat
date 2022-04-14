import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Pipe({ name: "safeResourceUrl" })
export class SafeUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}
  public transform(url: string | null): SafeResourceUrl | null {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : url;
  }
}
