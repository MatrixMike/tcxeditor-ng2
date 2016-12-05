import { Input, ElementRef, Directive, OnInit, OnChanges } from '@angular/core';

// Ensure parent compenent is position: relative;

@Directive({
  selector: '[scrollTo]'
})
export class ScrollToDirective implements OnInit, OnChanges {
    @Input('scrollTo') offsetTop; 
    // @Input() scrollTo: string; 

  constructor(private el: ElementRef) { }

  ngOnInit() {
      let off = this.offsetTop || 0;
      // console.log('*************', this.offsetTop);

  }

  ngOnChanges() {
      console.log('***ngOnChanges**********', this.offsetTop);  
      this.el.nativeElement['scrollTop'] = this.offsetTop
  }

  scrollAnimate(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        this.scrollTo(element, to, duration - 10);
    }, 10);
  }
}
