import { Directive, ElementRef, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';

import { fromEvent } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { DragEvent, DragInfo, DragSnapshot } from './interfaces';


@Directive({
	selector : '[ngDraggable]'
})
export class DraggableDirective implements OnInit {

	// no 'draggable' attribute

	@Output() dragStart : EventEmitter<DragEvent> = new EventEmitter();
	@Output() dragMove : EventEmitter<DragEvent> = new EventEmitter();
	@Output() dragEnd : EventEmitter<DragEvent> = new EventEmitter();

	// set css class
	@HostBinding('class.dragging') isDragging : boolean = false;

	private dragInfo : DragInfo;

	constructor (private ele : ElementRef) {
	}

	ngOnInit () {
		this.connectMouseEvent(); // for desktop
		this.connectTouchEvent(); // for mobile
	}

	private connectMouseEvent () {
		// divided to set class
		// mouse down
		fromEvent(this.ele.nativeElement, 'mousedown')
			.pipe(
				map<MouseEvent, DragSnapshot>(event => this.convertMouseEventToDragSnapshot(event))
			)
			.subscribe((snapshot : DragSnapshot) => {
				this.isDragging = true;

				this.dragInfo = {
					start : snapshot.position,
					current : snapshot.position,
					target : snapshot.target
				};
			});

		// mouse move
		fromEvent(document, 'mousemove')
			.pipe(
				filter(() => this.isDragging),
				tap((event : MouseEvent) => {
					event.stopImmediatePropagation();
				}),
				map<MouseEvent, DragSnapshot>((event : MouseEvent) => this.convertMouseEventToDragSnapshot(event))
			)
			.subscribe((snapshot : DragSnapshot) => {
				// replace current only
				this.dragInfo.current = snapshot.position;

				console.warn(this.dragInfo.start, this.dragInfo.current);
			});

		// mouse up
		fromEvent(document, 'mouseup')
			.subscribe((event : MouseEvent) => {
				this.isDragging = false;
			});
	}

	private convertMouseEventToDragSnapshot (event : MouseEvent) : DragSnapshot {
		return {
			position : {
				x : event.clientX,
				y : event.clientY
			},
			target : event.target as HTMLElement
		};
	}

	private connectTouchEvent () {
		// divided to set class
		// touch start
		fromEvent(this.ele.nativeElement, 'touchstart')
			.pipe(
				map<TouchEvent, DragSnapshot>(event => this.convertTouchEventToDragSnapshot(event))
			)
			.subscribe((snapshot : DragSnapshot) => {
				this.isDragging = true;

				this.dragInfo = {
					start : snapshot.position,
					current : snapshot.position,
					target : snapshot.target
				};
			});

		// touch move
		fromEvent(this.ele.nativeElement, 'touchmove')
			.pipe(
				filter(() => this.isDragging),
				tap((event : TouchEvent) => {
					event.stopImmediatePropagation();
				}),
				map<TouchEvent, DragSnapshot>((event : TouchEvent) => this.convertTouchEventToDragSnapshot(event))
			)
			.subscribe((snapshot : DragSnapshot) => {
				// replace current only
				this.dragInfo.current = snapshot.position;

				console.warn(this.dragInfo.start, this.dragInfo.current);
			});

		// touch end
		fromEvent(this.ele.nativeElement, 'touchend')
			.subscribe((event : TouchEvent) => {
				this.isDragging = false;
			});
	}

	private convertTouchEventToDragSnapshot (event : TouchEvent) : DragSnapshot {
		const touch : Touch = event.touches.item(0);

		return {
			position : {
				x : touch.clientX,
				y : touch.clientY
			},
			target : event.target as HTMLElement
		};
	}

	get nativeElement () : HTMLElement {
		return this.ele.nativeElement;
	}

	getBoundingClientRect () : DOMRect {
		return this.ele.nativeElement.getBoundingClientRect();
	}

}
