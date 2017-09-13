import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, NavOptions, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { ProgressPage } from '../progress/progress';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Constants } from '../../services/constants';

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
  selecteRouteId:any;
  routeData:any;
  progress:any;

  public dateOptions:Array<Object>=[];
  public selectedDate:Date;
  @ViewChild('searchbox') searchbox; //inject element

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public alert: AlertController, public datePipe:DatePipe, public modalCtrl:ModalController, public constants:Constants, public http:Http) {
    this.routes=navParams.get("routes");
    this.progress = this.modalCtrl.create(ProgressPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutesinfoPage');

    console.log(this.dateOptions);
    this.selectedDate=new Date();
    var dateLabel="Today";
    for(var i=0; i<7; i++){
      var date=this.addDays(new Date(),i);

      if(i==1){
        dateLabel="Tomorrow";
      }
      else if(i>1){
        dateLabel= this.datePipe.transform(date,'dd MMM yyyy');
      }

      this.dateOptions.push(
        {
          label:dateLabel,
          value:date
        }
      )
    }

  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
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

  onSearchClicked(){
    console.log(this.selectedDate);
    console.log(this.selecteRouteId);
    var config={
      params:{
        routeId:this.selecteRouteId,
        date:new Date(this.selectedDate).toISOString().slice(0,10).replace(/-/g,"")
      }
    }
    this.progress.present();
    this.http.get(this.constants.BASE_URL_ROUTE_ROUTE_STOPS, config).timeout(100000).subscribe(data => {
        
        if(data.text().length>0){
          this.routeData=data.json();
        }

        this.progress.dismiss();
    },
    error => {
      this.progress.dismiss();
    });



  }


  onScroll(event){
    console.log(event);
    //this.searchbox.nativeElement.hidden=true;
  }


}
