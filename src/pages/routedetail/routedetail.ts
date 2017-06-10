import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RoutedetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-routedetail',
  templateUrl: 'routedetail.html',
})
export class RoutedetailPage {

  route:any;
  origins:Array<string>=[];
  destinations:Array<string>=[];
  startAddress: any;
  startLocation:any;
  endAddress: any;
  endLocation:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.route=navParams.get("data");
    this.startAddress = this.navParams.get("startAddress");
    this.endAddress = this.navParams.get("endAddress");
    this.startLocation = this.navParams.get("startLocation");
    this.endLocation = this.navParams.get("endLocation");



    //console.log(this.route);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutedetailPage');
    this.origins.push(this.startLocation.lat+","+this.startLocation.lng);
    let i=0;
    for(let trip of this.route.trips){
      this.destinations.push(trip.stops[0].stopLat+","+trip.stops[0].stopLon);
      this.origins.push(trip.stops[trip.stops.length-1].stopLat+","+trip.stops[trip.stops.length-1].stopLon);
      i++;
    }

    this.destinations.push(this.endLocation.lat+","+this.endLocation.lng);

    console.log(this.origins);
    console.log("=======");
    console.log(this.destinations);
  }

  goBackClicked(){
    this.navCtrl.pop();
  }

}
