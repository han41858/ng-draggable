import { Directive, ElementRef, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';

import { fromEvent, merge, Observable } from 'rxjs';
import { filter, tap, withLatestFrom } from 'rxjs/operators';

import { DragEvent, DragInfo } from './interfaces';

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

	constructor (private ele : ElementRef) {
	}

	ngOnInit () {
		// for desktop
		const mouseDown$ : Observable<MouseEvent> = fromEvent(this.ele.nativeElement, 'mousedown');
		const mouseMove$ : Observable<MouseEvent> = fromEvent(document, 'mousemove') as Observable<MouseEvent>;
		const mouseUp$ : Observable<MouseEvent> = fromEvent(document, 'mouseup') as Observable<MouseEvent>;

		// for mobile
		const touchStart$ : Observable<TouchEvent> = fromEvent(this.ele.nativeElement, 'touchstart');
		const touchMove$ : Observable<TouchEvent> = fromEvent(document, 'touchmove') as Observable<TouchEvent>;
		const touchEnd$ : Observable<TouchEvent> = fromEvent(document, 'touchend') as Observable<TouchEvent>;

		merge(
			mouseMove$
				.pipe(
					filter(() => this.isDragging),
					withLatestFrom(
						mouseDown$
							.pipe(
								tap((event : MouseEvent) => {
									console.warn('start dragging');

									this.isDragging = true;

									event.stopImmediatePropagation();
								})
							)
						, (move$, down$) : DragInfo => {
							return {
								start : {
									x : down$.clientX,
									y : down$.clientY
								},
								current : {
									x : move$.clientX,
									y : move$.clientY
								},
								target : down$.target as HTMLElement
							};
						})
				),
			touchMove$
				.pipe(
					filter(() => this.isDragging),
					withLatestFrom(
						touchStart$
							.pipe(
								tap((event : TouchEvent) => {
									console.warn('touch start');

									this.isDragging = true;

									event.stopImmediatePropagation();
								})
							)
						, (move$, start$) : DragInfo => {
							const moveTouch : Touch = move$.touches.item(0);
							const startTouch : Touch = start$.touches.item(0);

							return {
								start : {
									x : startTouch.clientX,
									y : startTouch.clientY
								},
								current : {
									x : moveTouch.clientX,
									y : moveTouch.clientY
								},
								target : startTouch.target as HTMLElement
							};
						})
				)
		)
			.subscribe((d : DragInfo) => {
				console.warn('dragging', d.start, d.current);
			});

		merge(mouseUp$, touchEnd$)
			.subscribe((event : MouseEvent | TouchEvent) => {
				console.warn('stop dragging');

				this.isDragging = false;

				event.stopImmediatePropagation();
			});
	}

	get nativeElement () : HTMLElement {
		return this.ele.nativeElement;
	}

	getBoundingClientRect () : DOMRect {
		return this.ele.nativeElement.getBoundingClientRect();
	}

}
