import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from '../services/helper.service';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

  constructor(
    private helperService: HelperService
  ) {}

  transform(value: any, ...args: any[]): unknown {
    const date = this.helperService.formatDateFromNow(args[0], args[1])
    return date;
  }

}
