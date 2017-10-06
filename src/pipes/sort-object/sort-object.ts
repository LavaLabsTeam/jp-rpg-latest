import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortObjectPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'sort-object',
})
export class SortObjectPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, args?: any): any {
    return Object
      .keys(value)
      .map(key => ({ key, value: value[key] }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }
}
