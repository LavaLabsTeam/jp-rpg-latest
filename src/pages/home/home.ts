import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  registered: boolean;
  name: string;
  constructor(public navCtrl: NavController) {

  }

  sayMyName() {
    console.log('My name is sagar')
    this.registered=!this.registered;
    this.name="sagar";
  }

  changeTime(){
    alert(this.name);
  }

}
