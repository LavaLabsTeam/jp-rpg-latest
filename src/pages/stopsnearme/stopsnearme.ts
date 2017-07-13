import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

/**
 * Generated class for the StopsnearmePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stopsnearme',
  templateUrl: 'stopsnearme.html',
})

export class StopsnearmePage {
  records: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public alert: AlertController) {
    // this.records=[
    //   {
    //     id:1,
    //     name:"Stop 1",
    //     eta1:"12:10",
    //     eta2:"13:39"
    //   },
    //   {
    //     id:2,
    //     name:"Stop 2",
    //     eta1:"12:10",
    //     eta2:"13:39"
    //   }
    // ];

    this.records = navParams.get("data");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StopsnearmePage');
  }

  goBackClicked(){
    this.navCtrl.pop();
  }

  viewMapClicked(){
    this.navCtrl.push(MapPage,{mapdata:{from:"stops",data:this.records}})
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
