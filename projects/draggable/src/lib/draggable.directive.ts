import { Directive, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

import { fromEvent, merge, Observable } from 'rxjs';
import { filter, share, tap, withLatestFrom } from 'rxjs/operators';

import { DragEvent } from './interfaces';

@Directive({
	selector : '[ngDraggable]'
})
export class DraggableDirective implements OnInit {

	// no 'draggable' attribute for DOM

	// draggable switch, binding by attribute
	protected _isDraggable : boolean = true;

	get isDraggable () : boolean {
		return this._isDraggable;
	}

	@Input('ngDraggable') set isDraggable (value : boolean) {
		if (typeof value === 'boolean') {
			this._isDraggable = value;
		}
	}

	@Output() dragStart : EventEmitter<DragEvent> = new EventEmitter();
	@Output() dragMove : EventEmitter<DragEvent> = new EventEmitter();
	@Output() dragEnd : EventEmitter<DragEvent> = new EventEmitter();

	// set css class
	@HostBinding('class.dragging') isDragging : boolean = false;

	constructor (protected ele : ElementRef) {
	}

	ngOnInit () {
		// for desktop
		const mouseDown$ : Observable<MouseEvent> = fromEvent(this.ele.nativeElement, 'mousedown').pipe(share<MouseEvent>());
		const mouseMove$ : Observable<MouseEvent> = fromEvent(document, 'mousemove').pipe(share<MouseEvent>());
		const mouseUp$ : Observable<MouseEvent> = fromEvent(document, 'mouseup').pipe(share<MouseEvent>());

		// for mobile
		const touchStart$ : Observable<TouchEvent> = fromEvent(this.ele.nativeElement, 'touchstart').pipe(share<TouchEvent>());
		const touchMove$ : Observable<TouchEvent> = fromEvent(document, 'touchmove').pipe(share<TouchEvent>());
		const touchEnd$ : Observable<TouchEvent> = fromEvent(document, 'touchend').pipe(share<TouchEvent>());

		merge(mouseMove$, touchMove$)
			.pipe(
				filter(() => this.isDragging),
				withLatestFrom(
					merge(mouseDown$, touchStart$)
						.pipe(
							filter(() => this.isDraggable),
							tap((event : MouseEvent | TouchEvent) => {
								this.isDragging = true;

								event.preventDefault();

								this.dragStart.next(this.createDragEvent(event));
							})
						)
					, (moveEvent, startEvent) => {
						return this.createDragEvent(startEvent, moveEvent);
					})
			)
			.subscribe((event : DragEvent) => {
				this.dragMove.next(event);
			});

		merge(mouseUp$, touchEnd$)
			.pipe(
				filter(() => this.isDragging),
				withLatestFrom(
					merge(mouseDown$, touchStart$),
					(endEvent : MouseEvent | TouchEvent, startEvent : MouseEvent | TouchEvent) : DragEvent => {
						return this.createDragEvent(startEvent, endEvent);
					}
				)
			)
			.subscribe((event : DragEvent) => {
				this.isDragging = false;

				this.dragEnd.next(event);
			});
	}

	private createDragEvent (startEvent : MouseEvent | TouchEvent, currentEvent? : MouseEvent | TouchEvent) : DragEvent {
		let dragEvent : DragEvent;

		if (startEvent instanceof MouseEvent) {
			dragEvent = {
				start : {
					x : startEvent.clientX,
					y : startEvent.clientY
				},
				current : {
					x : startEvent.clientX,
					y : startEvent.clientY
				},
				target : startEvent.target as HTMLElement,
				movement : {
					x : 0,
					y : 0
				}
			};

			if (!!currentEvent) {
				const currentEventAsMouseEvent : MouseEvent = currentEvent as MouseEvent;

				dragEvent.current.x = currentEventAsMouseEvent.clientX;
				dragEvent.current.y = currentEventAsMouseEvent.clientY;

				dragEvent.movement.x = currentEventAsMouseEvent.clientX - startEvent.clientX;
				dragEvent.movement.y = currentEventAsMouseEvent.clientY - startEvent.clientY;
			}
		}
		else {
			const startTouch : Touch = startEvent.touches.item(0);

			dragEvent = {
				start : {
					x : startTouch.clientX,
					y : startTouch.clientY
				},
				current : {
					x : startTouch.clientX,
					y : startTouch.clientY
				},
				target : startTouch.target as HTMLElement,
				movement : {
					x : 0,
					y : 0
				}
			};

			if (!!currentEvent) {
				const currentEventAsTouchEvent : TouchEvent = currentEvent as TouchEvent;
				const currentTouch : Touch = currentEventAsTouchEvent.changedTouches.item(0);

				dragEvent.current.x = currentTouch.clientX;
				dragEvent.current.y = currentTouch.clientY;

				dragEvent.movement.x = currentTouch.clientX - startTouch.clientX;
				dragEvent.movement.y = currentTouch.clientY - startTouch.clientY;
			}
		}

		return dragEvent;
	}

	get clientRect () : DOMRect {
		return this.ele.nativeElement.getBoundingClientRect();
	}

}
