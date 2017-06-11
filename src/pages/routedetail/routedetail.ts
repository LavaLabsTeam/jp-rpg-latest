import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../services/constants';
import { Http } from '@angular/http';

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
  placesETARows:any;

constructor(public navCtrl: NavController, public navParams: NavParams, public constants:Constants, public http:Http) {
    this.route=navParams.get("data");
    this.startAddress = this.navParams.get("startAddress");
    this.endAddress = this.navParams.get("endAddress");
    this.startLocation = this.navParams.get("startLocation");
    this.endLocation = this.navParams.get("endLocation");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutedetailPage');
    //this.origins.push(this.startLocation.lat+","+this.startLocation.lng);

    this.origins.push("3.218561,101.564353");
    let i=0;
    for(let trip of this.route.trips){
      this.destinations.push(trip.stops[0].stopLat+","+trip.stops[0].stopLon);
      this.origins.push(trip.stops[trip.stops.length-1].stopLat+","+trip.stops[trip.stops.length-1].stopLon);
      i++;
    }
    //this.destinations.push(this.endLocation.lat+","+this.endLocation.lng);
    this.destinations.push("3.219405,101.593238");

    let url=this.constants.getMatrixURL(this.origins.join("|"),this.destinations.join("|"));

    this.http.get(url).subscribe(data => {
        let body = data.json();
        //console.log(body);
        this.placesETARows=body.rows;
        console.log(this.placesETARows);

    });

    //console.log(url);

  }

  goBackClicked(){
    this.navCtrl.pop();
  }

}
