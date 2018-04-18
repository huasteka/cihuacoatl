import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Gesture } from 'ionic-angular';

@Directive({
  selector: '[long-press]'
})
export class LongPressDirective implements OnInit, OnDestroy {
  targetElement: HTMLElement;
  gesture: Gesture;
  @Output('long-press') onPress: EventEmitter<any> = new EventEmitter();
  @Output('long-press-up') onPressUp: EventEmitter<any> = new EventEmitter();

  constructor(targetElement: ElementRef) {
    this.targetElement = targetElement.nativeElement;
  }

  ngOnInit(): void {
    this.gesture = new Gesture(this.targetElement);
    this.gesture.listen();
    this.gesture.on('press', (event) => this.onPress.emit(event));
    this.gesture.on('press-up', (event) => this.onPressUp.emit(event));
  }

  ngOnDestroy(): void {
    this.gesture.destroy();
  }

}
