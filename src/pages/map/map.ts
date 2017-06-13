import { ViewChild, Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare var google:any;
/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('mymap') mapElement:ElementRef;
  map: any;
  mapData:any;

  //google:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mapData = this.navParams.get("mapdata");

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MapPage');
    //console.log(this.mapElement);
    if(this.mapData.from=="stops"){
      this.loadStops();
    }
    else if(this.mapData.from=="routes"){
      this.generateRoutes();
    }

  }


  loadStops(){



    let latLng = new google.maps.LatLng(this.mapData.data[0].stopLat, this.mapData.data[0].stopLon);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    //console.log(this.mapElement.nativeElement);
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


    for(let stop of this.mapData.data){
      console.log(stop);
      var marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        draggable: true,
        title: stop.stopName
      });



      var infowindow = new google.maps.InfoWindow();

      google.maps.event.addListener(marker, 'click', (function(marker) {
  			return function() {
  				infowindow.setContent(stop.stopName);
  				//infowindow.setOptions({maxWidth: 200});
  				infowindow.open(this.map, marker);
  			}
  		}) (marker));

    }

  }

  generateRoutes(){
    //console.log(this.mapData);
    var walkPolyLines=this.mapData.data.walkPolyLines;
    var route=this.mapData.data.route;
    var startLocation=this.mapData.data.startLocation;
    var endLocation=this.mapData.data.endLocation;

    let latLng = new google.maps.LatLng(startLocation.lat, startLocation.lng);


    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    //console.log(this.mapElement.nativeElement);
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var myLatLngOrig=new google.maps.LatLng(startLocation.lat,startLocation.lng);
    var myLatLngDest=new google.maps.LatLng(endLocation.lat,endLocation.lng);
    
    var originMarker = new google.maps.Marker({
        position: myLatLngOrig,
        map: this.map,
        title: 'You are here'
    });
    var destMarker = new google.maps.Marker({
        position: myLatLngDest,
        map: this.map,
        title: 'Your destination'
    });


    for(let trip of route.trips){
      var locations:Array<string>=[];
      for(let stop of trip.stops){
        locations.push(new google.maps.LatLng(parseFloat(stop.stopLat),parseFloat(stop.stopLon)));
      }
      this.renderRouteBus(locations);
    }

    this.renderRouteWalk(walkPolyLines);
  }

  renderRouteBus(flightPlanCoordinates:any){
    var flightPath = new google.maps.Polyline({
       path: flightPlanCoordinates,
       geodesic: true,
       strokeColor: '#FF0000',
       strokeOpacity: 1.0,
       strokeWeight: 2
     });

     flightPath.setMap(this.map);



  }


  renderRouteWalk(polylines:any){
    for(let polyline of polylines){
      //console.log("sagar "+polyline);
      var flightPath = new google.maps.Polyline({
         path: google.maps.geometry.encoding.decodePath(polyline),
         geodesic: true,
         strokeColor: '#0000FF',
         strokeOpacity: 1.0,
         strokeWeight: 2
       });

       flightPath.setMap(this.map);


      //  var myLatLngOrig=flightPlanCoordinates[0];
      //  var myLatLngDest=flightPlanCoordinates[flightPlanCoordinates.length-1];
      //  var originMarker = new google.maps.Marker({
      //      position: myLatLngOrig,
      //      map: this.map,
      //      title: 'You are here'
      //  });
      //  var destMarker = new google.maps.Marker({
      //      position: myLatLngDest,
      //      map: this.map,
      //      title: 'Your destination'
      //  });
    }

  }

}
