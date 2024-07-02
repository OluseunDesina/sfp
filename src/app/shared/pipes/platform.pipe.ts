import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "platform",
})
export class PlatformPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    const platform = value.toLowerCase();

    switch (platform) {
      case "and":
        return "Android";
        break;
      case "web":
        return "WEB";
        break;
      case "ios":
        return "iOS";
        break;
      case "sef":
        return "Self Service";
        break;

      default:
        break;
    }
    // return null;
  }
}
