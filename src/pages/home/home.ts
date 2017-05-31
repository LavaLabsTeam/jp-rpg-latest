import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { PlacesearchPage } from '../placesearch/placesearch';

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
  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

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

  changeTime(){
    alert(this.name);
  }

}
