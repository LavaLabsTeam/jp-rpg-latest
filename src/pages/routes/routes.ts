import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { PlacesearchPage } from '../placesearch/placesearch';
import { RoutedetailPage } from '../routedetail/routedetail';
import { DatePipe } from '@angular/common';
import { Constants } from '../../services/constants';

/**
 * Generated class for the RoutesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-routes',
  templateUrl: 'routes.html',
})
export class RoutesPage {
  name: string;
  startAddress: any;
  startLocation:any;
  endAddress: any;
  endLocation:any;
  result: any;
  routes: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public datePipe:DatePipe, public constants:Constants) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutesPage');
    this.result=this.navParams.get('data').body;
    this.routes=this.result.routes;


    this.startAddress = this.navParams.get("startAddress");
    this.endAddress = this.navParams.get("endAddress");
    this.startLocation = this.navParams.get("startLocation");
    this.endLocation = this.navParams.get("endLocation");

    //console.log(this.startLocation);




    var i=0;
    for (let route of this.routes) {

      var j=0;
      var sum:number=0;
      for (let trip of route.trips) {
        var duration=this.timeDiff(trip.stops[0].departureTime,trip.stops[route.trips[j].stops.length-1].arrivalTime);
        sum=sum+duration;



        this.routes[i].trips[j].totalDuration=this.secondsToTime(duration);
        this.routes[i].trips[j].totalDurationValue=duration;
        j++;
      }



      this.routes[i].totalDurationValue=sum;
      this.routes[i].totalDuration=this.secondsToTime(sum);
      i++;

    }

    console.log(this.routes);


  }

  getAddressOnChange(place){
    //console.log(place);
    //this.viewCtrl.dismiss({place:place});
  }

  timeDiff(time1,time2) {
    //console.log(time1+"  "+time2);
    var t1 = new Date();
    var parts = time1.split(":");
    t1.setHours(parts[0],parts[1],parts[2],0);
    var t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0],parts[1],parts[2],0);

    var seconds= Math.abs(t1.getTime()-t2.getTime())/1000;

    return seconds;
  }

  secondsToTime(secs)
  {
      var hours = Math.floor(secs / (60 * 60));

      var divisor_for_minutes = secs % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);

      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);

      var obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
      };
      return obj;
  }


  setStartLocation(){
    let modal = this.modalCtrl.create(PlacesearchPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){
       this.startAddress=data.place.formatted_address;
       this.startLocation={lat:data.place.geometry.location.lat(),lng:data.place.geometry.location.lng()};

       console.log(this.startLocation);
       //this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
    });

    modal.present();
  }


  setEndLocation(){
    let modal = this.modalCtrl.create(PlacesearchPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){
       this.endAddress=data.place.formatted_address;
       this.endLocation={lat:data.place.geometry.location.lat(),lng:data.place.geometry.location.lng()};

       //console.log(this.startLocation);
      }
    });

    modal.present();
  }

  goBackClicked(){
    this.navCtrl.pop();
  }


  viewRouteDetailsClicked(route){
    this.navCtrl.push(RoutedetailPage,{data:route, startLocation:this.startLocation, endLocation:this.endLocation,startAddress:this.startAddress,endAddress:this.endAddress});
  }

}
