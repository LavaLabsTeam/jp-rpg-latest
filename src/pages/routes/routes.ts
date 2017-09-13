import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ToastController } from 'ionic-angular';
import { PlacesearchPage } from '../placesearch/placesearch';
import { RoutedetailPage } from '../routedetail/routedetail';
import { DatePipe } from '@angular/common';
import { Constants } from '../../services/constants';
import { PreferencemodalPage } from '../preferencemodal/preferencemodal';
import { DatepickerPage } from '../datepicker/datepicker';
import { ProgressPage } from '../progress/progress';
import { Http } from '@angular/http';
declare var google:any;
/**
 * Generated class for the RoutesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-routes',
  templateUrl: 'routes.html',
})
export class RoutesPage {
  name: string;
  startAddress: any;
  startLocation:any;
  endAddress: any;
  endLocation:any;
  result: any;
  routes: any;

  showOptions:any;
  accessOptions:any;
  progress:any;

  private selected: boolean = false;
  selectedDate: any;
  selectedTime: any;
  selectedDateJPApi: any;
  api:string;
  googleDirectionResult:any;
  departureDate:Date;
  showIndex:any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public datePipe:DatePipe, public constants:Constants, public http:Http, private toastCtrl: ToastController) {
    this.accessOptions = this.navParams.get("accessOptions");
    this.showOptions = this.navParams.get("showOptions");
    this.api=this.navParams.get("api");
    this.selectedTime=this.navParams.get("selectedTime");
    this.selectedDate=this.navParams.get("selectedDate");
    this.selectedDateJPApi=this.navParams.get("selectedDateJPApi");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutesPage');
    this.result=this.navParams.get('data').body;
    this.routes=this.result.routes;


    this.startAddress = this.navParams.get("startAddress");
    this.endAddress = this.navParams.get("endAddress");
    this.startLocation = this.navParams.get("startLocation");
    this.endLocation = this.navParams.get("endLocation");

    //console.log(this.startLocation);
    if(this.api=="jpapp"){
      this.calculateRoutesDuration();
      this.optimizeRoutes();
      this.calculateFares();
    }
    else {
      //if google
      this.calculateRoutesTimeGoogle();
      this.googleDirectionResult=this.navParams.get('googleDirectionResult');

    }


    this.progress = this.modalCtrl.create(ProgressPage);

    console.log(this.routes);


  }

  /*
  * Calculates time from google
  * @since 1.0
  * @params none
  * @return none
  */
  calculateRoutesTimeGoogle(){
    var i=0;
    for(let route of this.routes){
      var s=0;
      for(let trip of route.trips){
        s+=trip.totalDurationValue;
      }

      this.routes[i]['name']="Route "+(i+1);
      this.routes[i]['totalDurationValue']=s;
      var duration=this.secondsToTime(s);
      this.routes[i]['totalDuration']=duration;
      // if(duration.h>0)
      //   this.routes[i]['totalDurationText']=duration.h+"hr "+duration.m+"min";
      // else
      //   this.routes[i]['totalDurationText']=duration.m+"min";

      //this.routes[i]['totalDurationText']=route.duration.text;

      var routeLabel="";
      
      if(i==0){
          routeLabel='Fastest Route';
      }
      if(this.routes[i].trips.length<2){
          routeLabel='Direct Route';
      }

      if(this.routes[i].trips.length<2 && i==0){
          routeLabel='Fastest Direct Route';
      }

      //this.routes[i].routeLabel=routeLabel;
      this.routes[i]['routeLabel']=routeLabel;

      i++;
    }
  }

  calculateFares(){
    var error=false;

    var params:Array<any>=[];
    for(let r of this.routes){
      var trip=r.trips[1];
      //console.log(trip);
      params.push({
        routeId:trip.routeId,
        startStopId: r.startStop.stopId,
        endStopId: r.endStop.stopId
      });
    };



    this.http.post(this.constants.BASE_URL_FARES_ROUTES,params).subscribe(data => {
        let fares = data.json();
        //console.log(body);
        if(fares!=null){
          if(fares.length>0){
            error=false;
            var i=0;
            var fr=[0.7,1,2.5,3.0];
            for(let f of fares){
              this.routes[i]['fare']=f.fare;
              //this.routes[i]['fare']=fr[Math.floor((Math.random()*3)+0)].toFixed(2);
              i++;
            }

          }
          else {
            {
              error=true;
            }
          }

        }
        else {
          error=true
        }

    });
  }

  getAddressOnChange(place){
    //console.log(place);
    //this.viewCtrl.dismiss({place:place});
  }



  timeDiff(time1,time2) {
    //console.log(time1+"  "+time2);
    var t1 = new Date();
    var parts = time1.split(":");
    t1.setHours(parts[0],parts[1],parts[2],0);
    var t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0],parts[1],parts[2],0);

    var seconds= Math.abs(t1.getTime()-t2.getTime())/1000;

    return seconds;
  }

  secondsToTime(secs)
  {
      var hours = Math.floor(secs / (60 * 60));

      var divisor_for_minutes = secs % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);

      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);

      var obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
      };
      return obj;
  }


  setStartLocation(){
    let modal = this.modalCtrl.create(PlacesearchPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){
       this.startAddress=data.place.name;
       this.startLocation={lat:data.place.geometry.location.lat(),lng:data.place.geometry.location.lng()};

       console.log(this.startLocation);
       this.planJourney();
       //this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
    });

    modal.present();
  }


  setEndLocation(){
    let modal = this.modalCtrl.create(PlacesearchPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){
       this.endAddress=data.place.name;
       this.endLocation={lat:data.place.geometry.location.lat(),lng:data.place.geometry.location.lng()};
       this.planJourney();
       //console.log(this.startLocation);
      }
    });

    modal.present();
  }

  goBackClicked(){
    this.navCtrl.pop();
  }


  viewRouteDetailsClicked(route){
    this.navCtrl.push(RoutedetailPage,{data:route, startLocation:this.startLocation, endLocation:this.endLocation,startAddress:this.startAddress,endAddress:this.endAddress,api:this.api,googleDirectionResult:this.googleDirectionResult});
  }


  planJourney(){
    var config={
      params:{
        startLan:this.startLocation.lat,
        startLon:this.startLocation.lng,
        endLan:this.endLocation.lat,
        endLon:this.endLocation.lng,
        time:this.selectedTime+":30",
        date:this.selectedDateJPApi
        // hasEscalators:"false",
        // hasStares:"false",
        // leastWalking:"false",
        // lowestTransit:"false"
      }

      // params:{
      //   startLan:"3.2066336",
      //   startLon:"101.58067779999999",
      //   endLan:"3.2197116",
      //   endLon:"101.59704629999999",
      //   time:"12:30:30"
      // }
    }

    // if(this.accessOptions=="hasescal"){
    //   config.params['hasEscalators']="true";
    // }
    // else {
    //   config.params['hasEscalators']="false";
    // }
    //
    // if(this.accessOptions=="hasstairs"){
    //   config.params['hasStares']="true";
    // }
    // else {
    //   config.params['hasStares']="false";
    // }

    if(this.showOptions=="tfr"){
      config.params['filter']="FASTEST_ROUTE";
    }
    else if(this.showOptions=="rwfi"){
      config.params['filter']="LEAST_INTERCHANGES";
    }
    else if(this.showOptions=="cr"){
      config.params['filter']="CHEAPEST_ROUTE";
    }


    // this.startAddress="MRT & KTM Sungai Buloh Drop Off";
    // this.endAddress="Kuarters Integrasi Hospital Sungai Buloh";

    this.startLocation={lat:config.params.startLan,lng:config.params.startLon};
    this.endLocation={lat:config.params.endLan,lng:config.params.endLon};

    var error=false;
    this.progress.present();
    this.http.get(this.constants.BASE_URL_ROUTE_SEARCH,config).subscribe(data => {
        let json = data.json();
        //console.log(body);
        if(json.body!=null){
          if(json.body.routes!=null){
            if(json.body.routes.length>0){
              //this.navCtrl.push(RoutesPage,{data:json,startAddress:this.startAddress,endAddress:this.endAddress, startLocation:this.startLocation, endLocation:this.endLocation});
              this.result=json.body;
              this.routes=this.result.routes;
              this.calculateRoutesDuration();
              this.optimizeRoutes();
              this.api="jpapp";
              this.calculateFares();
              error=false;
            }
            else {
              error=true;
            }

          }
          else {
            error=true;
          }
        }
        else {
          error=true
        }

        if(error){
          this.callGoogle();
        }
        this.progress.dismiss();

    },
    error => {
      this.progress.dismiss();
      // let toast = this.toastCtrl.create({
      //   message: 'Error Occured!',
      //   duration: 3000,
      //   position: 'bottom'
      // });

      //toast.present();
      this.callGoogle();
    });
  }



  dateChanged(date) {
    console.log(date);
		this.selected=true;
    //this.selectedDate=datePipe.transform(date, 'dd/MM/yyyy');
    this.planJourney();
	};


  showPreference(){
    var data;
    // if(this.showOptions!=null && this.accessOptions!=null)
    //   data={accessOptions:this.accessOptions,showOptions:this.showOptions};
    // else {
    //   data=null;
    // }

    if(this.showOptions!=null)
      data={accessOptions:this.accessOptions,showOptions:this.showOptions};
    else {
      data=null;
    }

    let modal = this.modalCtrl.create(PreferencemodalPage,data);

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){
        this.showOptions=data.showOptions;
        this.accessOptions=data.accessOptions;
        this.planJourney();
      }
    });

    modal.present();


  }

  showDatePicker(){
    let modal = this.modalCtrl.create(DatepickerPage,{name:this.name});

    modal.onDidDismiss(data => {
     console.log(data);
     this.selected=false;
     if(data!=undefined){
        this.selected=true;
        this.selectedDate=data.date;
        this.selectedTime=data.hour+":"+data.min;
        this.departureDate=data.departureDate;
        this.selectedDateJPApi=new Date(this.selectedDate).toISOString().slice(0,10).replace(/-/g,"");
        this.planJourney();

     }
    });

    modal.present();
  }




  optimizeRoutes(){
    var tempRoutes=[];

    var r=0;
    for (let route of this.routes) {
      var t=0;
      var tempTrips=[];
      tempTrips.push({
        type:'WALKING',
        instruction:this.startAddress

      });
      var lastTrip=null;
      for(let trip of route.trips){

        if(lastTrip!=null && t<route.trips.length-1){
          if(lastTrip.stops[lastTrip.stops.length-1].stopName!=trip.stops[0].stopName){
            tempTrips.push({
              instruction:"From "+lastTrip.stops[lastTrip.stops.length-1].stopName+" to "+trip.stops[0].stopName,
              type:'WALKING',
              stops:[]
            })
          }
        }

        if(trip.stops.length==1){
          trip['instruction']=trip.stop[0].stopName;
        }
        else {
          trip['instruction']="From "+trip.stops[0].stopName+" to "+trip.stops[trip.stops.length-1].stopName;
        }
        trip['type']='TRANSIT';
        tempTrips.push(trip);
        lastTrip=trip;
        t++;
      }
      tempTrips.push({
        type:'WALKING',
        instruction:this.endAddress

      });

      route['trips']=tempTrips;

      tempRoutes.push(route);

      r++;
    }

    this.routes=tempRoutes;
  }


  calculateRoutesDuration(){
    var i=0;
    for (let route of this.routes) {

      var j=0;
      var sum:number=0;
      for (let trip of route.trips) {
        var duration=this.timeDiff(trip.stops[0].departureTime,trip.stops[route.trips[j].stops.length-1].arrivalTime);
        sum=sum+duration;



        this.routes[i].trips[j].totalDuration=this.secondsToTime(duration);
        this.routes[i].trips[j].totalDurationValue=duration;
        if(this.routes[i].trips[j].totalDuration.h>0)
          this.routes[i].trips[j].totalDurationText=this.routes[i].trips[j].totalDuration.h+"hr"+" "+this.routes[i].trips[j].totalDuration.m+"min";
        else
          this.routes[i].trips[j].totalDurationText=this.routes[i].trips[j].totalDuration.m+"min";          

        j++;
      }



      this.routes[i].totalDurationValue=sum;
      this.routes[i].totalDuration=this.secondsToTime(sum);

      if(this.routes[i].totalDuration.h>0){
        this.routes[i].totalDurationText=this.routes[i].totalDuration.h+"hr"+" "+this.routes[i].totalDuration.m+"min";
      }
      else
      {
        this.routes[i].totalDurationText=this.routes[i].totalDuration.m+"min";          
      }

      var routeLabel="";
      
      if(i==0){
         if(this.showOptions=="cr")
            routeLabel='Cheapest Route';
         else
            routeLabel='Fastest Route';
      }
      
      if(this.routes[i].trips.length<2){
          routeLabel='Direct Route';
      }

      if(this.routes[i].trips.length<2 && i==0){
          //routeLabel='Recommended Fastest Route';
          if(this.showOptions=="cr")
            routeLabel='Cheapest Route';
          else if(this.showOptions=="rwfi")
            routeLabel='Direct Route';
        
      }

      this.routes[i]['routeLabel']=routeLabel;


      i++;

    }
  }


  callGoogle(){
    //var url=this.constants.getDirectionURLPublic(this.startLocation.lat+","+this.startLocation.lng,this.endLocation.lat+","+this.endLocation.lng);
    var error=false;


    var request = {
      origin: new google.maps.LatLng(this.startLocation.lat, this.startLocation.lng),
      destination: new google.maps.LatLng(this.endLocation.lat, this.endLocation.lng),
      travelMode: 'TRANSIT',
      provideRouteAlternatives:true,
      transitOptions:{
        modes: ['SUBWAY', 'BUS','TRAIN', 'RAIL']
      }
    };



    // if(this.showOptions=="rwfc"){
    //   request.transitOptions['routingPreference']='FEWER_TRANSFERS';
    // }
    // else if(this.showOptions=="rwlw"){
    //   request.transitOptions['routingPreference']='LESS_WALKING';
    // }

    request.transitOptions['departureTime']=this.departureDate;




    var p=this.progress;
    var tctrl=this.toastCtrl;
    //p.present();
    var directionsService = new google.maps.DirectionsService();
    console.log(directionsService);
    var obj=this;

    directionsService.route(request, function(rs, status) {
      //console.log("=======");
      //console.log(rs);
      if (status == 'OK') {
        obj.mapResult(rs);
        obj.api="google";
      }
      else {
        //this.progress.dismiss();
        let toast = tctrl.create({
          message: 'No routes Found !',
          duration: 3000,
          position: 'bottom'
        });

        toast.present();
      }

    });
  }


  mapResult(result:any){
    //console.log(result);
    var data={};
    var routes=[];

    var i=0;
    for(let route of result.routes){
      var r={};
      var trips=[];
      for(let trip of route.legs[0].steps){
          var t={};
          t['routeLongName']="";
          if(trip.travel_mode=="TRANSIT"){
              if(trip.transit.headway!=undefined){
                t['routeLongName']+=trip.transit.headway;
              }
              
              if(trip.transit.line.short_name!=undefined){
                t['routeLongName']+=" "+trip.transit.line.short_name;
              }
          }
          else {
              t['routeLongName']="";
          }

        t['totalDurationValue']=trip.duration.value;
        t['totalDurationText']=trip.duration.text;
        t['distanceValue']=trip.distance.value;
        t['distanceText']=trip.distance.text;
        t['instruction']=trip.instructions;
        t['type']=trip.travel_mode;
        t['polyline']=trip.encoded_lat_lngs;
        t['stops']=[];
        trips.push(t);
      }
      
      r['trips']=trips;
      r['totalDurationText']=route.legs[0].duration.text;
      r['arrivalTime']=route.legs[0].arrival_time;
      r['departureTime']=route.legs[0].departure_time;

      routes.push(r);
      i++;

    }
    //data['body']={routes:routes};

    this.result={routes:routes};
    this.routes=this.result.routes;
    this.calculateRoutesTimeGoogle();
    this.googleDirectionResult=result;
    //this.navCtrl.push(RoutesPage,{data:data,startAddress:this.startAddress,endAddress:this.endAddress, startLocation:this.startLocation, endLocation:this.endLocation,api:"google",googleDirectionResult:result});


  }

  expand(index:any){
    this.showIndex=this.showIndex==index?-1:index;
  }


  tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      //console.log(time);
      time[3] = " ";
      time[4] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      //time = time.splice(5,1);
      //time.pop();
      
    }
    return time.join (''); // return adjusted time or original string
  }



}
