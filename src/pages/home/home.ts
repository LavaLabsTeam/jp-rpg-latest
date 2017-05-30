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
  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }

  sayMyName() {
    console.log('My name is sagar')
    this.registered=!this.registered;
    this.name="sagar";

    let modal = this.modalCtrl.create(PlacesearchPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
    });

    modal.present();
  }

  changeTime(){
    alert(this.name);
  }

}
