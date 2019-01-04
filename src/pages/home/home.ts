import { StopsautocompletePage } from './../stopsautocomplete/stopsautocomplete';
import {Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { PlacesearchPage } from '../placesearch/placesearch';
import { RoutesPage } from '../routes/routes';
import { StopsnearmePage } from '../stopsnearme/stopsnearme';
import { GeneralinfoPage } from '../generalinfo/generalinfo';
import { PreferencemodalPage } from '../preferencemodal/preferencemodal';
import { DatepickerPage } from '../datepicker/datepicker';
import { ProgressPage } from '../progress/progress';
import { Geolocation } from '@ionic-native/geolocation';
import { Constants } from '../../services/constants';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { RoutesautocompletePage } from "../routesautocomplete/routesautocomplete";
import { UtilProvider } from '../../providers/util/util';

declare var google:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  stopSearchData: any;
  etaSearchData: any;
  registered: boolean;
  name: string;
  startAddress: any;
  startLocation:any;
  endAddress: any;
  endLocation:any;
  whatTime:any;
  stopName:any;
  routeName:any;

  currentLocation:any;

  private selected: boolean = false;
  selectedDate: any;
  selectedDateJPApi: any;
  selectedTime: any;
  departureDate:Date;
  progress:any;

  private watch:any;
  showOptions:any;
  accessOptions:any;
  temp:any;
  leaveNowChecked:boolean;
  searchTerm:any;
  @ViewChild('datePicker') datePicker; //inject element
  @ViewChild('leavenow') chkleaveNow; //inject element

 //sample places to see route
 //MRT & KTM Sungai Buloh Drop Off and Kuarters Integrasi Hospital Sungai Buloh and time 12:24 to 12:55
 // Start: Bus Terminal Komtar
 // End: Masjid Jamek Al-munauwar

  constructor(
      public navCtrl: NavController
    , public modalCtrl: ModalController
    , private geolocation: Geolocation
    , private http:Http
    , private constants:Constants
    , private toastCtrl: ToastController
    , public plt: Platform
    , public events: Events
    , private network: Network
    , private utilService : UtilProvider
  ) {
    this.whatTime = Observable.interval(1000).map(x => new Date()).share();
    //console.log(constants);
    this.departureDate=new Date();
    var curDate=new Date();
    var h,m;
    if(curDate.getHours()<10){
      h="0"+curDate.getHours();
    }
    else {
      h=""+curDate.getHours();
    }

    if(curDate.getMinutes()<10){
      m="0"+curDate.getMinutes();
    }
    else {
      m=curDate.getMinutes();
    }

    this.selectedTime=h+":"+m;
    this.selectedDateJPApi=curDate.toISOString().slice(0,10).replace(/-/g,"");

    //console.log(h+" "+m);

    // second page (listen for the user created event)
    this.events.subscribe('stop:tapped', (data) => {
      // userEventData is an array of parameters, so grab our first and only arg
      //console.log(data);
      if(data.type=="start"){
        this.startAddress=data.address;
        this.startLocation=data.location;
      }
      else
      {
        this.endAddress=data.address;
        this.endLocation=data.location;
      }
    });

    //perform network resolve

    this.resolveLocation();

    this.plt.ready().then((readySource) => {
      this.watch = this.geolocation.watchPosition();
      this.watch.subscribe((data) => {
       // data can be a set of coordinates, or an error (if an error occurred).
       // data.coords.latitude
       // data.coords.longitude
       
       if(data.coords!=undefined){
         this.currentLocation={lat:data.coords.latitude,lng:data.coords.longitude};
       }

       console.log(data);
       //this.getGeoCodeReverse(data.coords.latitude,data.coords.longitude);
      });
    });

    // i

    // let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    //   //console.log('network was disconnected :-(');
    //   if(networkToast!=undefined) networkToast.dismiss();

    //   networkToast = this.toastCtrl.create({
    //     message: 'Network Connection Lost !',
    //     position: 'bottom'
    //   });

    //   if(plt.is("ios") || plt.is("ipad")){
    //     networkToast = this.toastCtrl.create({
    //       message: 'Network Connection Lost !',
    //       position: 'bottom',
    //       duration: 3000
    //     });
    //   }
    //   else
    //   {
    //     networkToast = this.toastCtrl.create({
    //       message: 'Network Connection Lost !',
    //       position: 'bottom'
    //     });
    //   }
      
    //   networkToast.present();
    // });

    // let connectSubscription = this.network.onConnect().subscribe(() => {
    //   networkToast.dismiss();
    //   this.resolveLocation();
    // });


    this.showOptions=="tfr";

  }

  sayMyName() {
    console.log('My name is sagar')
    this.registered=!this.registered;
    this.name="sagar";
  }


  resolveLocation(){
    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      // Platform now ready, execute any required native code
      this.geolocation.getCurrentPosition().then((resp) => {
       //console.log('sssssssss');
       // resp.coords.latitude
       // resp.coords.longitude
      //  this.startLocation={lat:resp.coords.latitude,lng:resp.coords.longitude};
       this.currentLocation={lat:resp.coords.latitude,lng:resp.coords.longitude};
      //  this.getGeoCodeReverse(resp.coords.latitude,resp.coords.longitude);
       this.getWeatherInfo(this.currentLocation.lat,this.currentLocation.lng);
       //console.log(resp);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });

    

  }


  leaveNowClicked(){
    this.chkleaveNow.checked=!this.chkleaveNow.checked;

    if(this.chkleaveNow.checked){
      var curDate=new Date();
      var h,m;
      if(curDate.getHours()<10){
        h="0"+curDate.getHours();
      }
      else {
        h=""+curDate.getHours();
      }

      if(curDate.getMinutes()<10){
        m="0"+curDate.getMinutes();
      }
      else {
        m=curDate.getMinutes();
      }

      this.selectedTime=h+":"+m;
      this.selectedDateJPApi=curDate.toISOString().slice(0,10).replace(/-/g,"");
      console.log(this.selectedTime);
    }

  }
  
  // async getGoogleGeocode(data){
  //   return new Promise((resolve, reject) => {
  //     var geocoder = new google.maps.Geocoder();
  //     var origin=data.place.place_id;
  //     geocoder.geocode({ 'placeId': origin }, function (results, status) {
  //       console.log(results);
  //       if (status == google.maps.GeocoderStatus.OK) {
  //           var result = {
  //             lat : results[0].geometry.location.lat(),
  //             lng : results[0].geometry.location.lng()
  //           }
  //           resolve(result);
  //       } else{
  //           alert('Could not find the place');
  //           reject("Async Error");
  //       }
  //     });
  //   });
  // }
  

  setStartLocation(){
    let modal = this.modalCtrl.create(PlacesearchPage,{name:"start"});

    modal.onDidDismiss(data => {
     //console.log(data);
     if(data!=undefined){
      this.startAddress=data.place.poiName;
      // if(data.place.place_id){
      //   this.utilService.getGoogleGeocode(data).then((result) => {
      //     this.startLocation = result;
      //     sessionStorage.setItem('is_rpg_start_stop', 'false');
      //   })
      // }
      // else{
        this.startLocation={lat:data.place.poiLat,lng:data.place.poiLon,stopId:data.place.id};
        sessionStorage.setItem('is_rpg_start_stop', 'true');
      // }
      console.log(this.startLocation);
      }
    });

    modal.present();
  }



  setEndLocation(){
    let modal = this.modalCtrl.create(PlacesearchPage,{name:"end"});

    modal.onDidDismiss(data => {
     console.log(data);
     if(data!=undefined){
      this.endAddress=data.place.poiName;
      // if(data.place.place_id){
      //   this.utilService.getGoogleGeocode(data).then((result) => {          
      //     this.endLocation = result;
      //     sessionStorage.setItem('is_rpg_end_stop', 'false');
      //   })
      // }
      // else{
        this.endLocation={lat:data.place.poiLat,lng:data.place.poiLon,stopId:data.place.id};
        sessionStorage.setItem('is_rpg_end_stop', 'true');
      // }
       console.log(this.endLocation);
      }
    });

    modal.present();
  }


  planJourneyClicked(){
    if((!this.startAddress || this.startAddress=="") || (!this.endAddress || this.endAddress=="")){
      let toast = this.toastCtrl.create({
        message: 'Please select start and destination locations !',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
      return false;
    }
    var selectedTime;
    if(this.chkleaveNow.checked){
      var curDate=new Date();
      var h,m;
      if(curDate.getHours()<10){
        h="0"+curDate.getHours();
      }
      else {
        h=""+curDate.getHours();
      }

      if(curDate.getMinutes()<10){
        m="0"+curDate.getMinutes();
      }
      else {
        m=curDate.getMinutes();
      }

      selectedTime=h+":"+m;
    } else {
      selectedTime = this.selectedTime;
    }
    var config={
      params:{
        startLan:this.startLocation.lat,
        startLon:this.startLocation.lng,
        endLan:this.endLocation.lat,
        endLon:this.endLocation.lng,
        time:selectedTime+":30",
        date:this.selectedDateJPApi,
        hasEscalators:"false",
        hasStares:"false",
        leastWalking:"false",
        lowestTransit:"null",
        filter:'FASTEST_ROUTE',
        startStopId: this.startLocation.stopId,
        endStopId : this.endLocation.stopId
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


    // this.startAddress="MRT & KTM Sungai Buloh Drop Off";
    // this.endAddress="Kuarters Integrasi Hospital Sungai Buloh";

    if(this.showOptions=="tfr"){
      config.params['filter']="FASTEST_ROUTE";
    }
    else if(this.showOptions=="rwfi"){
      config.params['filter']="LEAST_INTERCHANGES";
    }
    else if(this.showOptions=="cr"){
      config.params['filter']="CHEAPEST_ROUTE";
    }

    // this.startLocation={lat:config.params.startLan,lng:config.params.startLon};
    // this.endLocation={lat:config.params.endLan,lng:config.params.endLon};

    var error=false;
    this.progress.present();
    this.http.get(this.constants.BASE_URL_ROUTE_SEARCH,config).timeout(30000).subscribe(data => {
        let json = data.json();
        //console.log(body);
        if(json.body!=null){
          if(json.body.routes!=null){
            if(json.body.routes.length>0){
              this.navCtrl.push(RoutesPage,{data:json,startAddress:this.startAddress,endAddress:this.endAddress, startLocation:this.startLocation, endLocation:this.endLocation,api:"jpapp",selectedTime:this.selectedTime,selectedDate:this.selectedDate,selectedDateJPApi:this.selectedDateJPApi, showOptions: this.showOptions});
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
          let toast = this.toastCtrl.create({
            message: 'No routes found!',
            duration: 3000,
            position: 'bottom'
          });
  
          toast.present();
          // this.callGoogle();
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
      //
      // toast.present();

      // this.callGoogle();
    });
  }

  callGoogle(){
    //var url=this.constants.getDirectionURLPublic(this.startLocation.lat+","+this.startLocation.lng,this.endLocation.lat+","+this.endLocation.lng);

    var request = {
      origin: new google.maps.LatLng(this.startLocation.lat, this.startLocation.lng),
      destination: new google.maps.LatLng(this.endLocation.lat, this.endLocation.lng),
      travelMode: 'TRANSIT',
      provideRouteAlternatives:true,
      transitOptions:{
        modes: ['SUBWAY', 'BUS','TRAIN', 'RAIL']
      }
    };

    // {
    //   arrivalTime: Date,
    //   departureTime: Date,
    //   modes[]: TransitMode,
    //   routingPreference: TransitRoutePreference
    // }



    if(this.showOptions=="rwfi"){
      request.transitOptions['routingPreference']='LEAST_INTERCHANGES';
    }
    else if(this.showOptions=="tfr"){
      request.transitOptions['routingPreference']='LEAST_WALKING';
    }



    request.transitOptions['departureTime']=this.departureDate;

    //console.log(request);

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
      }
      else {
        //this.progress.dismiss();
        let toast = tctrl.create({
          message: 'No routes found!',
          duration: 3000,
          position: 'bottom'
        });

        toast.present();
      }

    });
  }


  mapResult(result:any){
    console.log(result);
    var data={};
    var routes=[];

    for(let route of result.routes){

      var trips=[];
      var counter=0;
      for(let trip of route.legs[0].steps){
        var t={};
        t['routeLongName']="";
        if(trip.travel_mode=="TRANSIT"){
            if(trip.transit.headway!=undefined){
              t['routeLongName']+=trip.transit.headway;
            }

            if(trip.transit.headway!=undefined){
              t['headway']=trip.transit.headway;
            }
            
            if(trip.transit.line.short_name!=undefined){
              t['routeLongName']+=" "+trip.transit.line.short_name;
            }

            if(trip.transit.line.name!=undefined){
              t['lineName']=" "+trip.transit.line.name;
            }

            //t['departureInfo']="Departure time- "+trip.transit_details.departure_time.text;
            //console.log(trip);
            //console.log("========++++++++===========");

            if(trip.transit!=undefined){
              t['departureInfo']="Departure time- "+trip.transit.departure_time.text;
              t['instruction']="Get down at "+trip.transit.arrival_stop.name;

              if(counter>0)
                t['instructionRide']="Ride at "+trip.transit.departure_stop.name+" "+trip.instructions;
              else
                t['instructionRide']=this.startAddress;

            } 
            counter++;

            

            
        }
        else {
            t['routeLongName']="";
            t['instruction']=trip.instructions;
        }

        t['totalDurationValue']=trip.duration.value;
        t['totalDurationText']=trip.duration.text;
        t['distanceValue']=trip.distance.value;
        t['distanceText']=trip.distance.text;
        t['type']=trip.travel_mode;
        t['polyline']=trip.encoded_lat_lngs;
        t['stops']=[];
        trips.push(t);
        
      }
      routes.push({trips:trips,totalDurationText:route.legs[0].duration.text,arrivalTime:route.legs[0].arrival_time,departureTime:route.legs[0].departure_time});
    }

    data['body']={routes:routes};
    this.navCtrl.push(RoutesPage,{data:data,startAddress:this.startAddress,endAddress:this.endAddress, startLocation:this.startLocation, endLocation:this.endLocation,api:"google",googleDirectionResult:result,selectedDate:this.selectedDate,selectedTime:this.selectedTime,selectedDateJPApi:this.selectedDateJPApi, showOptions: this.showOptions});

  }

  changeTime(){
    alert(this.name);
  }

  viewETAClicked(){
    //this.navCtrl.push(EtaresultPage,{data:"sagar"})
    this.progress.present();
    var config={};
    //console.log(Number(this.stopName));
    var etaSearchType;
    if(this.stopName!=undefined && this.stopName!="") {
      if(isNaN(this.stopName)){
        config={
          params:{
            stopName:this.stopName
          }
        }
      }
      else{
        config={
          params:{
            stopId:this.stopName
          }
        }
      }

      etaSearchType="stop";
      this.searchTerm=this.stopName;
    }
    else {
      config={
        params:{
          routeId:this.etaSearchData.routeId,
          lineId:this.etaSearchData.lingId
        }
      }
      etaSearchType="route";
      this.searchTerm=this.etaSearchData.routeNm+"<br>"+this.etaSearchData.lingNm;
    }

    console.log(config);

    var error=false;
    this.http.get(this.constants.BASE_URL_ROUTE_SEARCH_ETA_DATA,config).timeout(30000).subscribe(data => {
        let json = data.json();
        this.progress.dismiss();
        //console.log(body);
        if(json.body!=null){
          if(json.body.length>0){
            error=false;
            this.navCtrl.push(StopsnearmePage,{data:json.body,searchtype:etaSearchType,searchTerm:this.searchTerm});
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

        if(error){
          this.progress.dismiss();
          let toast = this.toastCtrl.create({
            message: 'No Stops Found!',
            duration: 3000,
            position: 'bottom'
          });

          toast.present();
        }

    });


  }

  viewStopsNearMeClicked(){
    this.progress.present();
    if(this.currentLocation==null){
      let toast = this.toastCtrl.create({
        message: 'Current location not resolved !',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
      return false;
    }

    // var config={
    //   params:{
    //     lat:this.currentLocation.lat=3.206381,
    //     lon:this.currentLocation.lng=101.580754
    //   }
    // }
    var config={
      params:{
        lat:this.currentLocation.lat,
        lon:this.currentLocation.lng
      }
    }

    var error=false;
    this.http.get(this.constants.BASE_URL_ROUTE_SEARCH_ETA_DATA,config).subscribe(data => {
        let json = data.json();
        //console.log(body);
        this.progress.dismiss();
        if(json.body!=null){
          if(json.body.length>0){
            error=false;
            this.navCtrl.push(StopsnearmePage,{data:json.body, searchtype:"stopsnearme"});
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

        if(error){
          this.progress.dismiss();
          let toast = this.toastCtrl.create({
            message: 'No Stops Found!',
            duration: 3000,
            position: 'bottom'
          });

          toast.present();
        }

    });


  }



  onGeneralInfoClicked(){
    this.navCtrl.push(GeneralinfoPage,{data:"sagar"})
  }




	dateChanged(date) {
    console.log(date);
		this.selected=true;
    //this.selectedDate=datePipe.transform(date, 'dd/MM/yyyy');
	};



  ionViewDidLoad() {
    
    this.progress = this.modalCtrl.create(ProgressPage);

  }

  ionViewDidEnter() {
    //console.log();
  }

  ionViewWillUnload() {
    this.watch.unsubscribe();
  }

  getGeoCodeReverse(lat:any, lng: any){
    this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true').subscribe(data => {
        let body = data.json();
        if(body.results[0])
          this.startAddress = body.results[0].formatted_address;

    });
  }

  getWeatherInfo(lat:any,lng:any){
    this.http.get(this.constants.getWeatherAPI(lat,lng)).subscribe(data => {
        let body = data.json();
        console.log(body.currently.temperature);
        this.temp=body.currently.temperature;

    });
  }


  showPreference(){
    var data;
    if(this.showOptions!=null && this.accessOptions!=null)
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
        this.selectedDateJPApi=new Date(this.selectedDate).toISOString().slice(0,10).replace(/-/g,"");

        this.selectedTime=data.hour+":"+data.min;
        this.departureDate=data.departureDate;
        this.chkleaveNow.checked=false;
     }
    });

    modal.present();
  }


  clearSearch(){
    this.startAddress="";
    this.endAddress="";
    this.routeName="";
    this.stopName="";

  }

  routesEtaFieldClicked(){
    let modal = this.modalCtrl.create(RoutesautocompletePage,{name:"start"});

    modal.onDidDismiss(data => {
     //console.log(data);
     if(data!=undefined){
       //console.log(data.routeId);
       this.etaSearchData=data.item;
       this.routeName=data.item.routeNm+":"+data.item.lingNm;
       this.stopName="";
       
      }
    });

    modal.present();
  }

  stopNameFieldClicked(){
    let modal = this.modalCtrl.create(StopsautocompletePage,{name:"start"});
    
        modal.onDidDismiss(data => {
         //console.log(data);
         if(data!=undefined){
           //console.log(data.routeId);
           this.stopSearchData=data.item;
           this.stopName=data.item.stopNm;
           this.routeName="";
          }
        });
    
        modal.present();
  }


  onPickLocation(){
    if(this.currentLocation!=undefined){
      this.startLocation=this.currentLocation;
      this.getGeoCodeReverse(this.currentLocation.lat,this.currentLocation.lng);
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Location is not resolved, Wait.. !',
        duration: 3000,
        position: 'bottom'
      });

      toast.present(); 
    }
    
  }

}
