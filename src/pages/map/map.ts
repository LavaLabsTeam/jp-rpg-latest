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
    this.mapData = navParams.get("mapdata");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    //console.log(this.mapElement);
    if(this.mapData.from=="stops"){
      this.loadStops();
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

}
