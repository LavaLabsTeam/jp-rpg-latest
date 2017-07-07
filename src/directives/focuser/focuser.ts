import { Directive, ElementRef, Renderer } from '@angular/core';
import {Keyboard} from 'ionic-native';
import { Platform } from 'ionic-angular';


/**
 * Generated class for the FocuserDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[focuser]' // Attribute selector
})
export class FocuserDirective {
  private _el:any;
  constructor(el: ElementRef, private renderer:Renderer, public plat: Platform) {
    console.log('Hello FocuserDirective Directive');
    this._el = el.nativeElement;
  }


  ngAfterViewInit() {
        const element = this._el;
        // we need to delay our call in order to work with ionic ...
        // if(!this.plat.is('ios')){
        //   setTimeout(() => {
        //       this.renderer.invokeElementMethod(element, 'focus', []);
        //       //Keyboard.show();
        //   }, 0);
        // }

        setTimeout(() => {
            this.renderer.invokeElementMethod(element, 'focus', []);
            Keyboard.show();
        }, 0);
    }

}
