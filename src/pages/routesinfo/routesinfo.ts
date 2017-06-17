import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RoutesinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-routesinfo',
  templateUrl: 'routesinfo.html',
})
export class RoutesinfoPage {
  routes: any;
  showIndex:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.routes=navParams.get("routes");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutesinfoPage');
  }

  goBackClicked(){
    this.navCtrl.pop();
  }

  expand(index:any){
    this.showIndex=this.showIndex==index?-1:index;
  }


}
