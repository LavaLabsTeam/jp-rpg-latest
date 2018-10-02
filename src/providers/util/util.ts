import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var google:any;

/*
  Generated class for the UtilProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UtilProvider {

  constructor(public http: Http) {
    console.log('Hello UtilProvider Provider');
  }

  async getGoogleGeocode(data){
    return new Promise((resolve, reject) => {
      var geocoder = new google.maps.Geocoder();
      var origin=data.place.place_id;
      geocoder.geocode({ 'placeId': origin }, function (results, status) {
        console.log(results);
        if (status == google.maps.GeocoderStatus.OK) {
            var result = {
              lat : results[0].geometry.location.lat(),
              lng : results[0].geometry.location.lng()
            }
            resolve(result);
        } else{
            alert('Could not find the place');
            reject("Async Error");
        }
      });
    });
  }

}
