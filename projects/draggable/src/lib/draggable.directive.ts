import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DragEvent } from './interfaces';

@Directive({
	selector : '[ngDraggable]'
})
export class DraggableDirective {

	// no 'draggable' attribute

	@Output() dragStart : EventEmitter<DragEvent> = new EventEmitter();
	@Output() dragMove : EventEmitter<DragEvent> = new EventEmitter();
	@Output() dragEnd : EventEmitter<DragEvent> = new EventEmitter();

	// set css class
	@HostBinding('class.dragging') isDragging : boolean = false;

	@HostListener('mousedown', ['$event'])
	@HostListener('touchstart', ['$event'])
	onMouseDown (event : MouseEvent | TouchEvent) {
		if (!this.isDragging) {
			event.stopPropagation();

			this.isDragging = true;

			this.dragStart.emit(this.convertEvent(event));
		}
	}

	@HostListener('document:mousemove', ['$event'])
	@HostListener('document:touchmove', ['$event'])
	onMouseMove (event : MouseEvent | TouchEvent) {
		if (this.isDragging) {
			event.stopPropagation();

			this.dragMove.emit(this.convertEvent(event));
		}
	}

	@HostListener('document:mouseup', ['$event'])
	@HostListener('document:touchend', ['$event'])
	onMouseUp (event : MouseEvent | TouchEvent) {
		if (this.isDragging) {
			event.stopPropagation();

			this.isDragging = false;

			this.dragEnd.emit(this.convertEvent(event));
		}
	}

	private convertEvent (event : MouseEvent | TouchEvent) : DragEvent {
		let dragEvent : DragEvent;

		if (event instanceof MouseEvent) {
			dragEvent = {
				clientX : event.clientX,
				clientY : event.clientY
			};
		}
		else {
			const touch : Touch = event.touches.item(0);

			if (!!touch) {
				dragEvent = {
					clientX : touch.clientX,
					clientY : touch.clientY
				};
			}
			else {
				dragEvent = {
					clientX : 0,
					clientY : 0
				};
			}
		}

		return dragEvent;
	}

}
