import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';

/**
 * Generated class for the EtaresultPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-etaresult',
  templateUrl: 'etaresult.html',
})
export class EtaresultPage {

  records: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.records=[
      {
        id:1,
        name:"Route 1",
        eta1:"12:10",
        eta2:"13:39"
      },
      {
        id:2,
        name:"Route 2",
        eta1:"12:10",
        eta2:"13:39"
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EtaresultPage');
  }

  goBackClicked(){
    this.navCtrl.pop();
  }

  viewMapClicked(){
    this.navCtrl.push(MapPage,{data:"sagar"})
  }

}
