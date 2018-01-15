import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RoundPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'round',
})
export class RoundPipe implements PipeTransform {
  /**
   * Takes a value and round.
   */
  transform(value: number): number {
    return Math.round(value);
  }
}
