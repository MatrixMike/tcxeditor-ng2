import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'toDate'})
export class ToDatePipe implements PipeTransform {
  transform(value: string) : any {
      if (!value) {
        return null;
      } else
        return Date.parse(value);
  }
}
