import { Pipe, PipeTransform } from '@angular/core';
import { environment } from "../../../environments/environment";

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {
  private apiUrl = environment.url

  transform(value: unknown, ...args: unknown[]): unknown {

    return `${this.apiUrl}${value}`;
  }

}
