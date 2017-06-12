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
import { Geolocation } from '@ionic-native/geolocation';
import { Constants } from '../../services/constants';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';

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

  private watch:any;

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

    if(this.startLocation==null || this.endLocation==null){
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
    }

    var error=false;
    this.http.get(this.constants.BASE_URL_ROUTE_SEARCH,config).subscribe(data => {
        let json = data.json();
        //console.log(body);
        if(json.body!=null){
          if(json.body.routes!=null){
            this.navCtrl.push(RoutesPage,{data:json,startAddress:this.startAddress,endAddress:this.endAddress, startLocation:this.startLocation, endLocation:this.endLocation});
            error=false;
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

    });
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
     this.currentLocation={lat:data.coords.latitude,lng:data.coords.longitude};
     console.log(data);
     //this.getGeoCodeReverse(data.coords.latitude,data.coords.longitude);
    });
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
    let modal = this.modalCtrl.create(PreferencemodalPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){

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
