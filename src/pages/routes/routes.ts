import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ToastController } from 'ionic-angular';
import { PlacesearchPage } from '../placesearch/placesearch';
import { RoutedetailPage } from '../routedetail/routedetail';
import { DatePipe } from '@angular/common';
import { Constants } from '../../services/constants';
import { PreferencemodalPage } from '../preferencemodal/preferencemodal';
import { DatepickerPage } from '../datepicker/datepicker';
import { ProgressPage } from '../progress/progress';
import { Http } from '@angular/http';

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

  showOptions:any;
  accessOptions:any;
  progress:any;

  private selected: boolean = false;
  selectedDate: any;
  selectedTime: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public datePipe:DatePipe, public constants:Constants, public http:Http, private toastCtrl: ToastController) {
    this.accessOptions = navParams.get("accessOptions");
    this.showOptions = navParams.get("showOptions");
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

    this.calculateRoutesDuration();

    this.progress = this.modalCtrl.create(ProgressPage);

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
       this.planJourney();
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
       this.planJourney();
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


  planJourney(){
    var config={
      params:{
        startLan:this.startLocation.lat,
        startLon:this.startLocation.lng,
        endLan:this.endLocation.lat,
        endLon:this.endLocation.lng,
        time:this.selectedTime+":30"
      }

      // params:{
      //   startLan:"3.2066336",
      //   startLon:"101.58067779999999",
      //   endLan:"3.2197116",
      //   endLon:"101.59704629999999",
      //   time:"12:30:30"
      // }
    }

    if(this.accessOptions=="hasescal"){
      config.params['hasEscalators']="true";
    }
    else {
      config.params['hasEscalators']="false";
    }

    if(this.accessOptions=="hasstairs"){
      config.params['hasStares']="true";
    }
    else {
      config.params['hasStares']="false";
    }


    // this.startAddress="MRT & KTM Sungai Buloh Drop Off";
    // this.endAddress="Kuarters Integrasi Hospital Sungai Buloh";

    this.startLocation={lat:config.params.startLan,lng:config.params.startLon};
    this.endLocation={lat:config.params.endLan,lng:config.params.endLon};

    var error=false;
    this.progress.present();
    this.http.get(this.constants.BASE_URL_ROUTE_SEARCH,config).subscribe(data => {
        let json = data.json();
        //console.log(body);
        if(json.body!=null){
          if(json.body.routes!=null){
            if(json.body.routes.length>0){
              //this.navCtrl.push(RoutesPage,{data:json,startAddress:this.startAddress,endAddress:this.endAddress, startLocation:this.startLocation, endLocation:this.endLocation});
              this.result=json.body;
              this.routes=this.result.routes;
              this.calculateRoutesDuration();

              error=false;
            }
            else {
              error=true;
            }

          }
          else {
            error=true;
          }
        }
        else {
          error=true
        }

        if(error){
          let toast = this.toastCtrl.create({
            message: 'No Routes Found!',
            duration: 3000,
            position: 'bottom'
          });

          toast.present();
        }
        this.progress.dismiss();

    },
    error => {
      this.progress.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Error Occured!',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    });
  }



  dateChanged(date) {
    console.log(date);
		this.selected=true;
    //this.selectedDate=datePipe.transform(date, 'dd/MM/yyyy');
    this.planJourney();
	};


  showPreference(){
    var data;
    if(this.showOptions!=null && this.accessOptions!=null)
      data={accessOptions:this.accessOptions,showOptions:this.showOptions};
    else {
      data=null;
    }

    let modal = this.modalCtrl.create(PreferencemodalPage,data);

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){
        this.showOptions=data.showOptions;
        this.accessOptions=data.accessOptions;
        this.planJourney();
      }
    });

    modal.present();


  }

  showDatePicker(){
    let modal = this.modalCtrl.create(DatepickerPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
     this.selected=false;
     if(data!=undefined){
        this.selected=true;
        this.selectedDate=data.date;
        this.selectedTime=data.hour+":"+data.min;
        this.planJourney();

     }
    });

    modal.present();
  }


  calculateRoutesDuration(){
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
  }


}
