import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'toKm'})
export class ToKmPipe implements PipeTransform {
  transform(value: string) : any {
      return (parseFloat(value) / 1000 );
  }
};
