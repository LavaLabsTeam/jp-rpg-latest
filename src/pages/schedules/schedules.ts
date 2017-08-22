import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SchedulesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-schedules',
  templateUrl: 'schedules.html',
})
export class SchedulesPage {
  schedules:any;
  showIndex:any;
  days:any=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.schedules=navParams.get("schedules");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulesPage');
  }

  goBackClicked(){
    this.navCtrl.pop();
  }

  expand(index:any){
    this.showIndex=this.showIndex==index?-1:index;
  }


}
