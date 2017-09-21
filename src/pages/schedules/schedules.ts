import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { ProgressPage } from '../progress/progress';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Constants } from '../../services/constants';

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
  showIndex:any=0;
  public dateOptions:Array<Object>=[];
  public selectedDate:Date;
  public selectedDateOption:any;
  progress:any;
  days:any=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  constructor(public navCtrl: NavController, public navParams: NavParams, public datePipe:DatePipe ,public modalCtrl:ModalController, public constants:Constants, public http:Http) {
    this.schedules=navParams.get("schedules");
    this.progress = this.modalCtrl.create(ProgressPage);
  }

  ionViewDidLoad() {
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

    this.selectedDateOption=this.dateOptions[0];


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

  onSearchClicked(){
    this.progress.present();
    var config={
      params:{
        date:new Date(this.selectedDate).toISOString().slice(0,10).replace(/-/g,"")
      }
    }
    this.http.get(this.constants.BASE_URL_SCHEDULES,config).timeout(90000).subscribe(data => {
        let json = data.json();
        this.schedules=json.body;
        this.progress.dismiss();
    },
    error => {
      this.progress.dismiss();
    });
  }


}
