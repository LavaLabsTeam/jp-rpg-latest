import {Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { PlacesearchPage } from '../placesearch/placesearch';
import { RoutesPage } from '../routes/routes';
import { EtaresultPage } from '../etaresult/etaresult';
import { StopsnearmePage } from '../stopsnearme/stopsnearme';
import { GeneralinfoPage } from '../generalinfo/generalinfo';
import { PreferencemodalPage } from '../preferencemodal/preferencemodal';
import { DatePipe } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';

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

  private selected: boolean = false;
	private date: any;
  selectedDate: any;

  private watch:any;

  @ViewChild('datePicker') datePicker; //inject element


  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private geolocation: Geolocation, private http:Http) {

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
       this.startLocation=data.place.geometry.location;

       console.log(this.startLocation);
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
       this.endLocation=data.place.geometry.location;

       console.log(this.startLocation);
      }
    });

    modal.present();
  }


  planJourneyClicked(){
    this.navCtrl.push(RoutesPage,{data:"sagar"})
  }

  changeTime(){
    alert(this.name);
  }

  viewETAClicked(){
    this.navCtrl.push(EtaresultPage,{data:"sagar"})
  }

  viewStopsNearMeClicked(){
    this.navCtrl.push(StopsnearmePage,{data:"sagar"})
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
     this.startLocation=resp.coords;
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
     console.log(data);
    });
  }

  ionViewWillUnload() {
    this.watch.unsubscribe();
  }

  getGeoCodeReverse(lat:any, lon: any){
    this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&sensor=true').subscribe(data => {
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

}
