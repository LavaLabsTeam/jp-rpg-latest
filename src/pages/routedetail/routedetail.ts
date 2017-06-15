import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../services/constants';
import { Http } from '@angular/http';
import { MapPage } from '../map/map';
declare var google:any;
//import 'rxjs/add/operator/map';


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
  origins:Array<any>=[];
  destinations:Array<any>=[];
  startAddress: any;
  startLocation:any;
  endAddress: any;
  endLocation:any;
  placesETARows:Array<string>=[];
  walkPolyLines:Array<string>=[];
  busPolyLines:Array<string>=[];
  api:any;


constructor(public navCtrl: NavController, public navParams: NavParams, public constants:Constants, public http:Http) {
    this.route=navParams.get("data");

    this.startAddress = this.navParams.get("startAddress");
    this.endAddress = this.navParams.get("endAddress");
    this.startLocation = this.navParams.get("startLocation");
    this.endLocation = this.navParams.get("endLocation");
    this.api=this.navParams.get("api");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutedetailPage');
    if(this.api=="jpapp"){
      this.origins.push(new google.maps.LatLng(this.startLocation.lat,this.startLocation.lng));
      //this.origins.push("3.218561,101.564353");
      let i=0;
      for(let trip of this.route.trips){
        if(trip.type=='TRANSIT'){
          this.destinations.push(new google.maps.LatLng(trip.stops[0].stopLat,trip.stops[0].stopLon));
          this.origins.push(new google.maps.LatLng(trip.stops[trip.stops.length-1].stopLat,trip.stops[trip.stops.length-1].stopLon));
        }

        i++;
      }
      this.destinations.push(new google.maps.LatLng(this.endLocation.lat,this.endLocation.lng));
      //this.destinations.push("3.219405,101.593238");
      this.fetchPolylineWalk(0);
    }


  }

  fetchPolylineWalk(index:number){
    // let url=this.constants.getDirectionURL(this.origins[index],this.destinations[index]);
    //
    // this.http.get(url).subscribe(data => {
    //     let body = data.json();
    //     //console.log(body);
    //     this.walkPolyLines.push(body.routes[0].overview_polyline.points);
    //     //this.walkPolyLines.push(index);
    //
    //     if(index<this.origins.length-1){
    //       this.fetchPolylineWalk(index+1);
    //     }
    //     else {
    //       this.walkPolylinesFetched();
    //     }
    //
    // });


    var request = {
      origin: this.origins[index],
      destination: this.destinations[index],
      travelMode: 'WALKING'
    };


    //p.present();
    var directionsService = new google.maps.DirectionsService();
    //console.log(directionsService)
    var obj=this;
    directionsService.route(request, function(rs,status){
      obj.onFetchPolyline(rs,status,index);
    });

  }

  onFetchPolyline(rs, status, index) {
    // console.log("======= "+index+"====");
    // console.log(this.origins.length);
    // console.log(status);
    // console.log(this.origins);
    if (status == 'OK') {
      this.walkPolyLines.push(rs.routes[0].overview_polyline.points);
      this.placesETARows.push(rs.routes[0].legs[0].duration.text);

      if(index<this.origins.length-1){
        this.fetchPolylineWalk(index+1);
      }
      else {
        this.walkPolylinesFetchFinished();
      }

    }

  }


  goBackClicked(){
    this.navCtrl.pop();
  }

  viewMapClicked(){
    this.navCtrl.push(MapPage,{mapdata:{from:"routes",api:this.api,data:{route:this.route, walkPolyLines:this.walkPolyLines, startLocation:this.startLocation,endLocation:this.endLocation}}});
  }

  walkPolylinesFetchFinished(){
    var i=0,j=0;

    for(let trip of this.route.trips){
      if(trip.type=='WALKING'){
        this.route.trips[i]['totalDurationText']=this.placesETARows[j];
        this.route.trips[i]['polyline']=this.walkPolyLines[j];
        j++;
      }
      i++;

    }

    // var service = new google.maps.DistanceMatrixService();
    //
    // service.getDistanceMatrix(
    //   {
    //     origins: this.origins,
    //     destinations: this.destinations,
    //     travelMode: 'WALKING'
    //   }, this.distanceFetched);

  }

  // distanceFetched(response,status){
  //
  // }

}
