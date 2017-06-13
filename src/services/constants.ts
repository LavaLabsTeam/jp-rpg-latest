import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
  //public BASE_URL_ROUTE_SEARCH:string = "http://172.27.26.20/open/api/search?startLan=3.211823&startLon=101.577405&endLan=3.219405&endLon=101.593238&time=12:28:32";
  //public BASE_URL_ROUTE_SEARCH:string = "https://api.myjson.com/bins/17fz71";
  //public BASE_URL_ROUTE_SEARCH:string = "https://api.myjson.com/bins/doyyb";
  //public BASE_URL_ROUTE_SEARCH:string = "http://172.27.26.20/open/api/search?startLan=3.218561&startLon=101.564353&endLan=3.219405&endLon=101.593238&time=12:28:32";
  //public BASE_URL_ROUTE_SEARCH:string = "http://172.27.26.20/open/api/search";
  BASE_URL_API:any = "http://58.27.125.82";
  public BASE_URL_ROUTE_SEARCH:string = this.BASE_URL_API+"/open/api/search";
  public BASE_URL_ROUTES:string = this.BASE_URL_API+"/open/api/routes";
  public BASE_URL_NEAREST_STOPS:string = this.BASE_URL_API+"/open/api/nearest-stops";
  //public BASE_URL_NEAREST_STOPS:string = "https://api.myjson.com/bins/on72z";
  //public BASE_URL_NEAREST_STOPS:string = "https://api.myjson.com/bins/k2lxf";
  public GOOGLE_API_KEY:string="AIzaSyCUo-4x6rSmsd1dts4lvB6jJU5uVP1zvqQ";

  public getMatrixURL(origins:any, destinations:any){
    let url:string="https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+origins+"&destinations="+destinations+"&mode=walking&key="+this.GOOGLE_API_KEY;
    return url;
  }

  public getDirectionURL(origin:any, destination:any){
    let url:string="https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"&mode=walking&key="+this.GOOGLE_API_KEY;
    return url;
  }



}
