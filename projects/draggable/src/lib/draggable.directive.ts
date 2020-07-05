import { Directive, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

import { fromEvent, merge, Observable } from 'rxjs';
import { filter, tap, withLatestFrom } from 'rxjs/operators';

import { DragEvent } from './interfaces';


@Directive({
	selector : '[ngDraggable]'
})
export class DraggableDirective implements OnInit {

	// no 'draggable' attribute for DOM

	protected _isDraggable : boolean = true;

	// draggable switch, binding by attribute
	// usage: <div ngDraggable>/<div [ngDraggable]="true">/<div [ngDraggable]="false">
	@Input('ngDraggable') set isDraggable (value : boolean | string | undefined) {
		this._isDraggable = !(value !== '' && value !== undefined);
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
		const mouseDown$ : Observable<MouseEvent> = fromEvent<MouseEvent>(this.ele.nativeElement, 'mousedown');
		const mouseMove$ : Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mousemove');
		const mouseUp$ : Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mouseup');

		// for mobile
		const touchStart$ : Observable<TouchEvent> = fromEvent<TouchEvent>(this.ele.nativeElement, 'touchstart');
		const touchMove$ : Observable<TouchEvent> = fromEvent<TouchEvent>(document, 'touchmove');
		const touchEnd$ : Observable<TouchEvent> = fromEvent<TouchEvent>(document, 'touchend');

		merge(mouseMove$, touchMove$)
			.pipe(
				filter(() => this.isDragging),
				withLatestFrom(
					merge(mouseDown$, touchStart$)
						.pipe(
							filter(() => this._isDraggable),
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
				target : this.ele.nativeElement, // not startEvent.target, this points DraggableDirective's element node
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
		} else {
			const startTouch : Touch = startEvent.touches.item(0) as Touch;

			dragEvent = {
				start : {
					x : startTouch.clientX,
					y : startTouch.clientY
				},
				current : {
					x : startTouch.clientX,
					y : startTouch.clientY
				},
				target : this.ele.nativeElement, // not startEvent.target, this points DraggableDirective's element node
				movement : {
					x : 0,
					y : 0
				}
			};

			if (!!currentEvent) {
				const currentEventAsTouchEvent : TouchEvent = currentEvent as TouchEvent;
				const currentTouch : Touch = currentEventAsTouchEvent.changedTouches.item(0) as Touch;

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
