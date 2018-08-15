import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
	selector : '[ngDraggable]'
})
export class DraggableDirective {

	// no 'draggable' attribute

	// set css class
	@HostBinding('class.dragging') isDragging : boolean = false;

	constructor () {
	}

	@HostListener('pointerdown')
	onPointerDown () {
		console.log('draggable.onPointerDown()');
		this.isDragging = true;
	}

	@HostListener('document:pointermove')
	onPointerMove () {
		if (this.isDragging) {
			console.log('draggable.onPointerMove()');
		}
	}

	@HostListener('document:pointerup')
	onPointerUp () {
		if (this.isDragging) {
			console.log('draggable.onPointerUp()');

			this.isDragging = false;
		}
	}

}
