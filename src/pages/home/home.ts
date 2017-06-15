import {Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { PlacesearchPage } from '../placesearch/placesearch';
import { RoutesPage } from '../routes/routes';
import { EtaresultPage } from '../etaresult/etaresult';
import { StopsnearmePage } from '../stopsnearme/stopsnearme';
import { GeneralinfoPage } from '../generalinfo/generalinfo';
import { PreferencemodalPage } from '../preferencemodal/preferencemodal';
import { DatepickerPage } from '../datepicker/datepicker';
import { ProgressPage } from '../progress/progress';
import { Geolocation } from '@ionic-native/geolocation';
import { Constants } from '../../services/constants';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';

declare var google:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  registered: boolean;
  name: string;
  startAddress: any;
  startLocation:any;
  endAddress: any;
  endLocation:any;
  whatTime:any;

  currentLocation:any;

  private selected: boolean = false;
  selectedDate: any;
  selectedTime: any;
  progress:any;

  private watch:any;
  showOptions:any;
  accessOptions:any;
  @ViewChild('datePicker') datePicker; //inject element

 //sample places to see route
 //MRT & KTM Sungai Buloh Drop Off and Kuarters Integrasi Hospital Sungai Buloh and time 12:24 to 12:55

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private geolocation: Geolocation, private http:Http, private constants:Constants, private toastCtrl: ToastController) {
    this.whatTime = Observable.interval(1000).map(x => new Date()).share();
    console.log(constants);
  }

  sayMyName() {
    console.log('My name is sagar')
    this.registered=!this.registered;
    this.name="sagar";
  }

  setStartLocation(){
    let modal = this.modalCtrl.create(PlacesearchPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){
       this.startAddress=data.place.formatted_address;
       this.startLocation={lat:data.place.geometry.location.lat(),lng:data.place.geometry.location.lng()};
       //console.log(this.startLocation);
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
       this.endLocation={lat:data.place.geometry.location.lat(),lng:data.place.geometry.location.lng()}

       console.log(this.startLocation);
      }
    });

    modal.present();
  }


  planJourneyClicked(){

    if(this.startLocation==null || this.endLocation==null && false){
      let toast = this.toastCtrl.create({
        message: 'Please select start and destination locations !',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
      return false;
    }

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
              this.navCtrl.push(RoutesPage,{data:json,startAddress:this.startAddress,endAddress:this.endAddress, startLocation:this.startLocation, endLocation:this.endLocation,api:"jpapp"});
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
          this.callGoogle();
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

  callGoogle(){
    //var url=this.constants.getDirectionURLPublic(this.startLocation.lat+","+this.startLocation.lng,this.endLocation.lat+","+this.endLocation.lng);
    var error=false;

    var request = {
      origin: new google.maps.LatLng(this.startLocation.lat, this.startLocation.lng),
      destination: new google.maps.LatLng(this.endLocation.lat, this.endLocation.lng),
      travelMode: 'TRANSIT'
    };




    var p=this.progress;
    var tctrl=this.toastCtrl;
    //p.present();
    var directionsService = new google.maps.DirectionsService();
    console.log(directionsService);
    var obj=this;

    directionsService.route(request, function(rs, status) {
      //console.log("=======");
      //console.log(rs);
      if (status == 'OK') {
        obj.mapResult(rs);
      }
      else {
        //this.progress.dismiss();
        let toast = tctrl.create({
          message: 'Error Occured!',
          duration: 3000,
          position: 'bottom'
        });

        toast.present();
      }

    });
  }


  mapResult(result:any){
    //console.log(result);
    var data={};
    var routes=[];
    var trips=[];
    var stops=[];

    for(let route of result.routes){
      var r={};

      for(let trip of route.legs[0].steps){
        var t={};
        t['routeLongName']="";
        t['totalDurationValue']=trip.duration.value;
        t['totalDurationText']=trip.duration.text;
        t['distanceValue']=trip.distance.value;
        t['distanceText']=trip.distance.text;
        t['instruction']=trip.instructions;
        t['type']=trip.travel_mode;
        t['polyline']=trip.encoded_lat_lngs;
        t['stops']=[];
        trips.push(t);
      }
      r['trips']=trips;
      routes.push(r);
    }
    data['body']={routes:routes};
    this.navCtrl.push(RoutesPage,{data:data,startAddress:this.startAddress,endAddress:this.endAddress, startLocation:this.startLocation, endLocation:this.endLocation,api:"google",googleDirectionResult:result});


  }

  changeTime(){
    alert(this.name);
  }

  viewETAClicked(){
    this.navCtrl.push(EtaresultPage,{data:"sagar"})
  }

  viewStopsNearMeClicked(){

    if(this.currentLocation==null){
      let toast = this.toastCtrl.create({
        message: 'Current location not resolved !',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
      return false;
    }

    var config={
      params:{
        lat:this.currentLocation.lat,
        lon:this.currentLocation.lng
      }
    }

    var error=false;
    this.http.get(this.constants.BASE_URL_NEAREST_STOPS,config).subscribe(data => {
        let json = data.json();
        //console.log(body);
        if(json.body!=null){
          if(json.body.length>0){
            error=false;
            this.navCtrl.push(StopsnearmePage,{data:json.body});
          }
          else {
            {
              error=true;
            }
          }

        }
        else {
          error=true
        }

        if(error){
          let toast = this.toastCtrl.create({
            message: 'No Stops Found!',
            duration: 3000,
            position: 'bottom'
          });

          toast.present();
        }

    });


  }

  onGeneralInfoClicked(){
    this.navCtrl.push(GeneralinfoPage,{data:"sagar"})
  }




	dateChanged(date) {
    console.log(date);
		this.selected=true;
    //this.selectedDate=datePipe.transform(date, 'dd/MM/yyyy');
	};



  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((resp) => {
     // resp.coords.latitude
     // resp.coords.longitude
     this.startLocation={lat:resp.coords.latitude,lng:resp.coords.longitude};
     this.currentLocation={lat:resp.coords.latitude,lng:resp.coords.longitude};
     this.getGeoCodeReverse(resp.coords.latitude,resp.coords.longitude);
     //console.log(resp);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.watch = this.geolocation.watchPosition();
    this.watch.subscribe((data) => {
     // data can be a set of coordinates, or an error (if an error occurred).
     // data.coords.latitude
     // data.coords.longitude
     if(data.coords!=undefined){
       this.currentLocation={lat:data.coords.latitude,lng:data.coords.longitude};
     }

     console.log(data);
     //this.getGeoCodeReverse(data.coords.latitude,data.coords.longitude);
    });


    this.progress = this.modalCtrl.create(ProgressPage);









  }

  ionViewWillUnload() {
    this.watch.unsubscribe();
  }

  getGeoCodeReverse(lat:any, lng: any){
    this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true').subscribe(data => {
        let body = data.json();
        if(body.results[0])
          this.startAddress = body.results[0].formatted_address;

    });
  }


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

     }
    });

    modal.present();
  }

}
