import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
  //public BASE_URL_ROUTE_SEARCH:string = "http://172.27.26.20/open/api/search?startLan=3.211823&startLon=101.577405&endLan=3.219405&endLon=101.593238&time=12:28:32";
  //public BASE_URL_ROUTE_SEARCH:string = "https://api.myjson.com/bins/17fz71";
  //public BASE_URL_ROUTE_SEARCH:string = "https://api.myjson.com/bins/doyyb";
  //public BASE_URL_ROUTE_SEARCH:string = "http://172.27.26.20/open/api/search?startLan=3.218561&startLon=101.564353&endLan=3.219405&endLon=101.593238&time=12:28:32";
  //public BASE_URL_ROUTE_SEARCH:string = "http://172.27.26.20/open/api/search";
  //BASE_URL_API:any = "http://58.27.125.82";
  BASE_URL_API:any = "http://drpgwebex.rpgbistest.com.my";
  BASE_URL_WEATHER_API:any = "https://api.darksky.net/forecast/b1d0bd16d1b49fca14e923b3a1dc39a1/";
  public BASE_URL_ROUTE_SEARCH:string = this.BASE_URL_API+"/open/api/search";
  public BASE_URL_ROUTES:string = this.BASE_URL_API+"/open/api/routes";
  public BASE_URL_SCHEDULES:string = this.BASE_URL_API+"/open/api/schedules";
  public BASE_URL_FARES:string = this.BASE_URL_API+"/open/api/fares-data";
  public BASE_URL_FARES_ROUTES:string = this.BASE_URL_API+"/open/api/fares-for-routes";
  public BASE_URL_NEAREST_STOPS:string = this.BASE_URL_API+"/open/api/nearest-stops";
  //public BASE_URL_NEAREST_STOPS:string = "https://api.myjson.com/bins/on72z";
  //public BASE_URL_NEAREST_STOPS:string = "https://api.myjson.com/bins/k2lxf";
  public GOOGLE_API_KEY:string="AIzaSyCUo-4x6rSmsd1dts4lvB6jJU5uVP1zvqQ";

  getWeatherAPI(lat:any,lng:any){
    return this.BASE_URL_WEATHER_API+lat+","+lng+"?units=si";
  }

}
