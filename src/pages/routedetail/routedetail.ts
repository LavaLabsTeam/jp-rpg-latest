import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../services/constants';
import { Http } from '@angular/http';
import { MapPage } from '../map/map';
import * as _ from 'lodash';
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

  showEndWalkingIcon: any;
  showStartWalkingIcon: any;
  showWalkingIcon: boolean;
  route:any;
  origins:Array<any>=[];
  destinations:Array<any>=[];
  startAddress: any;
  startLocation:any;
  endAddress: any;
  endLocation:any;
  placesETARows:Array<string>=[];
  walkPolyLines:Array<any>=[];
  busPolyLines:Array<string>=[];
  placeNames:Array<string>=[];
  api:any;
  googleDirectionResult:any;
  selectedTime:any;


constructor(public navCtrl: NavController, public navParams: NavParams, public constants:Constants, public http:Http) {
    this.route=navParams.get("data");

    this.startAddress = this.navParams.get("startAddress");
    this.endAddress = this.navParams.get("endAddress");
    this.startLocation = this.navParams.get("startLocation");
    this.endLocation = this.navParams.get("endLocation");
    this.selectedTime=this.navParams.get("selectedTime");
    this.api=this.navParams.get("api");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutedetailPage', this.route);
    if(this.api=="jpapp"){
      this.origins.push(new google.maps.LatLng(this.startLocation.lat,this.startLocation.lng));
      //this.origins.push("3.218561,101.564353");
      let i=0;
      for(let trip of this.route.trips){
        if(trip.type=='TRANSIT'){
          // this.destinations.push(new google.maps.LatLng(trip.stops[0].stopLat,trip.stops[0].stopLon));
          // this.origins.push(new google.maps.LatLng(trip.stops[trip.stops.length-1].stopLat,trip.stops[trip.stops.length-1].stopLon));
          this.destinations.push(new google.maps.LatLng(trip.polyline[0].shapePtLat,trip.polyline[0].shapePtLon));
          this.origins.push(new google.maps.LatLng(trip.polyline[trip.polyline.length-1].shapePtLat,trip.polyline[trip.polyline.length-1].shapePtLon));
          
        }

        i++;
      }
      this.destinations.push(new google.maps.LatLng(this.endLocation.lat,this.endLocation.lng));
      //this.destinations.push("3.219405,101.593238");
      this.fetchPolylineWalk(0);
    }
    else {
      // this.googleDirectionResult = this.navParams.get("googleDirectionResult");
    }

    this.showStartWalkingIcon = sessionStorage.getItem('is_rpg_start_stop');
    this.showEndWalkingIcon = sessionStorage.getItem('is_rpg_end_stop');


  }

  fetchPolylineWalk(index: number){
    if(index == 0){
      this.walkPolyLines.push(
        [
          {
            shapePtLat: parseFloat(this.startLocation.lat),
            shapePtLon: parseFloat(this.startLocation.lng),
          },
          {
            shapePtLat: parseFloat(this.route.trips[index+1].polyline[0].shapePtLat),
            shapePtLon: parseFloat(this.route.trips[index+1].polyline[0].shapePtLon),
          }
        ],
      );
      // this.walkPolyLines.push({
      //   lat: parseFloat(this.route.trips[index+1].polyline[0].shapePtLat),
      //   lng: parseFloat(this.route.trips[index+1].polyline[0].shapePtLon),
      //   travelMode: 'WALKING'
      // });
    } else if(index == this.route.trips.length - 1){
      this.walkPolyLines.push(
        [
          {
            shapePtLat: parseFloat(this.route.trips[index-1].polyline[this.route.trips[index-1].polyline.length-1].shapePtLat),
            shapePtLon: parseFloat(this.route.trips[index-1].polyline[this.route.trips[index-1].polyline.length-1].shapePtLon),
          },
          {
            shapePtLat: parseFloat(this.endLocation.lat),
            shapePtLon: parseFloat(this.endLocation.lng),
          }
        ]
      );
      // this.walkPolyLines.push({
      //   lat: parseFloat(this.endLocation.lat),
      //   lng: parseFloat(this.endLocation.lng),
      //   travelMode: 'WALKING'
      // });
    } else {
      if(this.route.trips[index].type == "FERRY"){
        this.walkPolyLines.push(
          [
            {
              shapePtLat: parseFloat(this.route.trips[index-1].stops[this.route.trips[index-1].stops.length-1].stopLat),
              shapePtLon: parseFloat(this.route.trips[index-1].stops[this.route.trips[index-1].stops.length-1].stopLon),
            },
            {
              shapePtLat: parseFloat(this.route.trips[index+1].stops[0].stopLat),
              shapePtLon: parseFloat(this.route.trips[index+1].stops[0].stopLon),
            }
          ],
        );
        // this.walkPolyLines.push({
        //   lat: parseFloat(this.route.trips[index+1].stops[0].stopLat),
        //   lng: parseFloat(this.route.trips[index+1].stops[0].stopLon),
        //   travelMode: 'WALKING'
        // });
      }
    }

    if(index<this.route.trips.length-1){
      this.fetchPolylineWalk(index+1);
    }
    else {
      this.walkPolylinesFetchFinished();
    }
  }

  fetchPolylineWalk2(index:number){
    // let url=this.constants.getDirectionURL(this.origins[index],this.destinations[index]);
    //
    // this.http.get(url).subscribe(data => {viewMapClicked
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
    if (status == 'OK') {
      this.walkPolyLines.push(rs.routes[0].overview_polyline);
      this.placesETARows.push(rs.routes[0].legs[0].duration.text);
      this.placeNames.push(rs.routes[0].legs[0].start_address);

      if(index<this.origins.length-1){
        this.fetchPolylineWalk2(index+1);
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
    debugger
    // if(this.api=="google"){
    //     this.navCtrl.push(MapPage,{mapdata:{from:"routes",api:this.api,data:{route:this.route, walkPolyLines:this.walkPolyLines, startLocation:this.startLocation,endLocation:this.endLocation, googleDirectionResult:this.googleDirectionResult}}});
    // }
    // else {
      this.navCtrl.push(MapPage,{mapdata:{from:"routes",api:this.api,data:{route:this.route, walkPolyLines:this.walkPolyLines, startLocation:this.startLocation,endLocation:this.endLocation}}});
    // }

  }

  walkPolylinesFetchFinished(){
    var i=0,j=0;

    for(let trip of this.route.trips){
      if(trip.type=='WALKING' || trip.type == 'FERRY'){
        this.route.trips[i]['totalDurationText']=this.placesETARows[j];
        this.route.trips[i]['polyline']=this.walkPolyLines[j];
        if(j==0 || j==this.route.trips.length-1){
          this.route.trips[i]['origin']=this.route.trips[i]['instruction'];
          // this.route.trips[i]['instruction']=this.placeNames[j];
        }
        j++;
      }

      if(i==0){
        this.route.trips[i]['departureInfo']="Leave at "+this.tConvert(this.selectedTime);
      }
      else{
        if(trip.type=='TRANSIT'){
          this.route.trips[i]['departureInfo']="Departure time- "+this.tConvert(this.route.trips[i].stops[0]['departureTime']);
        }
        else{
          this.route.trips[i]['departureInfo']="Leave at "+this.tConvert(this.route.trips[i-1].stops[this.route.trips[i-1].stops.length-1]['departureTime']);
        }
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

  tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      //console.log(time);
      time[3] = " ";
      time[4] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      //time = time.splice(5,1);
      //time.pop();
      
    }
    return time.join (''); // return adjusted time or original string
  }

}
