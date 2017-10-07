import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';
import {NgModel} from '@angular/forms';

declare var google:any;

@Directive({
  selector: '[Googleplace]',
  providers: [NgModel],
  host: {
    '(input)' : 'onInputChange()'
  }
})

export class GoogleplaceDirective {

  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  modelValue:any;
  autocomplete:any;
  private _el:any;


  constructor(el: ElementRef,private model:NgModel) {
    this._el = el.nativeElement;
    this.modelValue = this.model;
    var input = this._el;

    var cityBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(101.2722682858,2.5420301197),
      new google.maps.LatLng(102.0970828702,3.4243597099));
      
    this.autocomplete = new google.maps.places.Autocomplete(input, {
      bounds:cityBounds,
      componentRestrictions:{
        country: 'my'
      },
      types: ['geocode']
    });

    //101.2722682858,2.5420301197,102.0970828702,3.4243597099


    google.maps.event.addListener(this.autocomplete, 'place_changed', ()=> {
      var place = this.autocomplete.getPlace();
      this.invokeEvent(place);

    });
  }

  invokeEvent(place:Object) {
    this.setAddress.emit(place);
  }

  onInputChange() {
    console.log(this.model);
  }
}
