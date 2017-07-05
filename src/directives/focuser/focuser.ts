import { Directive, ElementRef, Renderer } from '@angular/core';
import {Keyboard} from 'ionic-native';


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
  constructor(el: ElementRef, private renderer:Renderer) {
    console.log('Hello FocuserDirective Directive');
    this._el = el.nativeElement;
  }


  ngAfterViewInit() {
        const element = this._el;
        // we need to delay our call in order to work with ionic ...
        setTimeout(() => {
            this.renderer.invokeElementMethod(element, 'focus', []);
            Keyboard.show();
        }, 0);
    }

}
