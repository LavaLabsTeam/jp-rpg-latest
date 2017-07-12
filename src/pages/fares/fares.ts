import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FaresPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-fares',
  templateUrl: 'fares.html',
})
export class FaresPage {
  fares: any;
  concessionFares:Array<any>=[];
  normalFares:Array<any>=[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fares=this.navParams.get("fares");
    for(let fare of this.fares.fareStructures){
      if(fare.isConcession==true){
        this.concessionFares.push(fare);
      }
      else{
        this.normalFares.push(fare);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaresPage');
  }

  goBackClicked(){
    this.navCtrl.pop();
  }

}
