import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the WalkingDurationPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'walkingDuration',
})
export class WalkingDurationPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(secs: any) {

    // var hours = Math.floor(secs / (60 * 60));
    // var divisor_for_minutes = secs % (60 * 60);
    var minutes = (secs / 60).toFixed(2);
    // var divisor_for_seconds = divisor_for_minutes % 60;
    // var seconds = Math.ceil(divisor_for_seconds);
    return minutes;
  }
}
