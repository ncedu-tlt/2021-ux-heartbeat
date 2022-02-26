import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeFormat"
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number | null): string {
    if (value === null) {
      return " ";
    } else {
      return `00:${
        +(value as string | number) < 10 ? "0" + String(value) : value
      }`;
    }
  }
}
