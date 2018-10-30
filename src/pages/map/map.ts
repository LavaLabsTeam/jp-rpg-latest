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
  travelType: any;
  @ViewChild('mymap') mapElement:ElementRef;
  map: any;
  mapData:any;
  googleDirectionResult:any;
  colorCounter : number = 0;
  transitColors : any = ['#FF0000', '#FF00E0'];

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
    else if(this.mapData.from=="routes" && this.mapData.api=="jpapp"){
      this.generateRoutes();
    }
    else if(this.mapData.from=="routes" && this.mapData.api=="google"){
      this.googleDirectionResult=this.navParams.get('googleDirectionResult');
      this.generateRoutesGoogle();
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

  generateRoutesGoogle(){
    let latLng = new google.maps.LatLng(this.mapData.data.startLocation.lat, this.mapData.data.startLocation.lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    //console.log(this.mapElement.nativeElement);
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);
    console.log(this.mapData.data.googleDirectionResult);
    directionsDisplay.setDirections(this.mapData.data.googleDirectionResult);

  }

  generateRoutes(){
    console.log(this.mapData);
    var walkPolyLines=this.mapData.data.walkPolyLines;
    var route=this.mapData.data.route;
    var startLocation=this.mapData.data.startLocation;
    var endLocation=this.mapData.data.endLocation;

    var startPathFromOriginToFirstWalkPoint=[];
    var endPathFromLastWalkPointToDest=[];
    var startPathFromFirstWalkPointToFirstTripFirstPoint=[];
    var endPathFromLastTripPointToFirstPointOfLastWalk=[];

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
      if(trip.type=="TRANSIT") {
        for(let poly of trip.polyline){
          locations.push(new google.maps.LatLng(parseFloat(poly.shapePtLat),parseFloat(poly.shapePtLon)));
        }
        this.travelType = trip.type;
        this.renderRouteBus(locations);
      } else {
          if(trip.polyline){
            for(let poly of trip.polyline){
              locations.push(new google.maps.LatLng(parseFloat(poly.shapePtLat),parseFloat(poly.shapePtLon)));
            }
            this.travelType = trip.type;
            if(this.travelType == 'WALKING')
              this.renderRouteWalk(locations, 'WALKING');
            else
              this.renderRouteWalk(locations, 'FERRY');
          }
        }
    }
    //console.log(walkPolyLines);

    // var startWalkPoints=google.maps.geometry.encoding.decodePath(walkPolyLines[0]);
    // var endWalkWalkPoints=google.maps.geometry.encoding.decodePath(walkPolyLines[walkPolyLines.length-1]);

    //------origin to first point of first walk path
    // startPathFromOriginToFirstWalkPoint.push(myLatLngOrig);
    // startPathFromOriginToFirstWalkPoint.push(startWalkPoints[0]);

    // //now make all joining paths complete
    // var sflightPath = new google.maps.Polyline({
    //   path: startPathFromOriginToFirstWalkPoint,
    //   geodesic: true,
    //   strokeColor: '#0000FF',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2
    // });

    // sflightPath.setMap(this.map);
    // //--end of origin to first point of first walk path


    // //--first walk path last point to first point of First trip
    // startPathFromFirstWalkPointToFirstTripFirstPoint.push(startWalkPoints[startWalkPoints.length-1]);
    // startPathFromFirstWalkPointToFirstTripFirstPoint.push(new google.maps.LatLng(parseFloat(route.trips[1].polyline[0].shapePtLat),parseFloat(route.trips[1].polyline[0].shapePtLon)));

  
    // var startPathFromFirstWalkPointToFirstTripFirstPointPath = new google.maps.Polyline({
    //   path: startPathFromFirstWalkPointToFirstTripFirstPoint,
    //   geodesic: true,
    //   strokeColor: '#0000FF',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2
    // });

    // startPathFromFirstWalkPointToFirstTripFirstPointPath.setMap(this.map);
    //--end of first walk path last point to first point of First trip

    //------trip last point to first point of last walk
    // endPathFromLastTripPointToFirstPointOfLastWalk.push(new google.maps.LatLng(parseFloat(route.trips[route.trips.length-2].polyline[route.trips[route.trips.length-2].polyline.length-1].shapePtLat), parseFloat(route.trips[route.trips.length-2].polyline[route.trips[route.trips.length-2].polyline.length-1].shapePtLon)));
    // endPathFromLastTripPointToFirstPointOfLastWalk.push(endWalkWalkPoints[0]);

    //console.log("====_____=======");
    // var epfltfplw = new google.maps.Polyline({
    //   path: endPathFromLastTripPointToFirstPointOfLastWalk,
    //   geodesic: true,
    //   strokeColor: '#0000FF',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2
    // });

    // epfltfplw.setMap(this.map);
    //------------end of trip last point to first point of last walk



    //--last walk last point to destination
    // endPathFromLastWalkPointToDest.push(endWalkWalkPoints[endWalkWalkPoints.length-1]);
    // endPathFromLastWalkPointToDest.push(myLatLngDest);

    // var eflightPath = new google.maps.Polyline({
    //   path: endPathFromLastWalkPointToDest,
    //   geodesic: true,
    //   strokeColor: '#0000FF',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2
    // });

    // eflightPath.setMap(this.map);
    //--end of last walk last point to destination

    // this.renderRouteWalk(walkPolyLines);


    //Working Code
    // var walkingLocations:Array<string>=[];
    // if(walkPolyLines.length > 0){
    //   for(let poly of walkPolyLines){
    //     walkingLocations.push(new google.maps.LatLng(parseFloat(poly.lat),parseFloat(poly.lng)));
    //   }
    // }
    // var eflightPath = new google.maps.Polyline({
    //    path: walkingLocations,
    //    geodesic: true,
    //    strokeColor: '#0000FF',
    //    strokeOpacity: 1.0,
    //    strokeWeight: 2
    //  });

    //  eflightPath.setMap(this.map);
    
  }

  renderRouteBus(flightPlanCoordinates:any){
    if(this.travelType == 'TRANSIT' && flightPlanCoordinates.length > 0){
      if(this.colorCounter == 0){
        this.colorCounter = 1;
        var selectedColor = this.transitColors[this.colorCounter];
      } else {
        this.colorCounter = 0;
        var selectedColor = this.transitColors[this.colorCounter];
      }
    }
    var flightPath = new google.maps.Polyline({
       path: flightPlanCoordinates,
       geodesic: true,
       strokeColor: selectedColor,
       strokeOpacity: 1.0,
       strokeWeight: 2
     });

     flightPath.setMap(this.map);

  }

  renderRouteWalk(polylines:any, type:string){
    if(type=="WALKING")
      var lineColor = '#0000FF';
    else if(type=='FERRY')
      var lineColor = '#00DDD1';
    var flightPath = new google.maps.Polyline({
      path: polylines,
      geodesic: true,
      strokeColor: lineColor,
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(this.map);
  }


  renderRouteWalk2(polylines:any){
    var i=0;
    for(let polyline of polylines){
      //console.log("sagar "+polyline);
      var paths=google.maps.geometry.encoding.decodePath(polyline);

      var flightPath = new google.maps.Polyline({
         path:paths ,
         geodesic: true,
         strokeColor: '#0000FF',
         strokeOpacity: 1.0,
         strokeWeight: 2
       });

       flightPath.setMap(this.map);
       i++;

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
