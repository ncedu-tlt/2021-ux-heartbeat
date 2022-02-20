import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeFormat"
})
export class FormatPipe implements PipeTransform {
  transform(value: number): string {
    const convertedTime: number | string =
      value < 10 ? "0" + String(value) : value;
    return `00:${convertedTime}`;
  }
}
