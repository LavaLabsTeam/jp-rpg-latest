import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the PreferencemodalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-preferencemodal',
  templateUrl: 'preferencemodal.html',
})
export class PreferencemodalPage {
  showOptions:any;
  accessOptions:any;
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.accessOptions=navParams.get("accessOptions")==undefined?"nar":navParams.get("accessOptions");
    this.showOptions=navParams.get("showOptions")==undefined?"tfr":navParams.get("showOptions");
    //console.log(this.accessOptions);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreferencemodalPage');
  }


  onPreferenceOK(){
    this.viewCtrl.dismiss({accessOptions:this.accessOptions,showOptions:this.showOptions});
  }

  onPreferenceCancelled(){
    this.viewCtrl.dismiss();

  }

}
