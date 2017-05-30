import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the PlacesearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-placesearch',
  templateUrl: 'placesearch.html',
})
export class PlacesearchPage {
  search: string;
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    //alert(this.navParams.data.name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesearchPage');
  }


  onCloseClicked(){
      alert("hello");
      this.viewCtrl.dismiss({data:this.search});
  }

}
