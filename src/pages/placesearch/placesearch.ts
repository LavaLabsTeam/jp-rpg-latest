import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

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
      this.viewCtrl.dismiss();
  }

  getAddressOnChange(place){
    //console.log(place);
    this.viewCtrl.dismiss({place:place});
  }

}
