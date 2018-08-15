import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
	selector : '[ngDraggable]'
})
export class DraggableDirective {

	// no 'draggable' attribute

	@Output() dragStart : EventEmitter<PointerEvent> = new EventEmitter();
	@Output() dragMove : EventEmitter<PointerEvent> = new EventEmitter();
	@Output() dragEnd : EventEmitter<PointerEvent> = new EventEmitter();

	// set css class
	@HostBinding('class.dragging') isDragging : boolean = false;

	@HostListener('pointerdown', ['$event'])
	onPointerDown (event : PointerEvent) {
		this.isDragging = true;

		event.stopPropagation();
		this.dragStart.emit(event);
	}

	@HostListener('document:pointermove', ['$event'])
	onPointerMove (event : PointerEvent) {
		if (this.isDragging) {
			this.dragMove.emit(event);
		}
	}

	@HostListener('document:pointerup', ['$event'])
	onPointerUp (event : PointerEvent) {
		if (this.isDragging) {
			this.isDragging = false;

			this.dragEnd.emit(event);
		}
	}

}
