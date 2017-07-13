import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, NavOptions } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public alert: AlertController) {
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


  showConfrimation(stop){
    let alrt = this.alert.create({
        title: 'Set Address?',
        inputs : [
             {
               type:'radio',
               label:'Set as start address in search',
               value:'start',
               checked:true
             },
             {
               type:'radio',
               label:'Set as end address in search',
               value:'end'
              }
        ],
        buttons: [{
          text: "OK",
          handler: data => {
            if(data=="start"){
              this.setStartLocation(stop);
            }
            else
            {
              this.setEndLocation(stop);
            }
          }
        },
        {
          text: "Cancel",
          role: 'cancel'
        }]
      })

    alrt.present();


  }

  setStartLocation(stop){
    this.events.publish('stop:tapped', {type:"start",address:stop.stopName,location:{lat:stop.stopLat,lng:stop.stopLon}});
    this.navCtrl.popToRoot();
  }

  setEndLocation(stop){
    this.events.publish('stop:tapped', {type:"end",address:stop.stopName,location:{lat:stop.stopLat,lng:stop.stopLon}});
    this.navCtrl.popToRoot();
  }


}
