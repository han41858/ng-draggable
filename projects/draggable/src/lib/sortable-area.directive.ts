import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

import { MovableAreaDirective } from './movable-area.directive';
import { MovableDirective } from './movable.directive';
import { SortEvent } from './interfaces';

@Directive({
	selector : '[ngSortableArea]'
})
export class SortableAreaDirective extends MovableAreaDirective {

	@Output() sort : EventEmitter<SortEvent> = new EventEmitter<SortEvent>();

	constructor (ele : ElementRef) {
		super(ele);
	}

	ngAfterContentInit () {
		this.movables.changes.subscribe(() => {
			this.subscriptions.forEach(sub => sub.unsubscribe());

			this.subscriptions = [];

			this.movables.forEach(movable => {
				this.subscriptions.push(movable.dragStart.subscribe(() => this.setBoundaries(movable)));
				this.subscriptions.push(movable.dragMove.subscribe((event) => this.checkSort(event, movable)));
			});
		});

		this.movables.notifyOnChanges();
	}

	checkSort (event : PointerEvent, targetMovable : MovableDirective) {
		// const replaceTarget : MovableDirective = this.movables.find((movable, i) => {
		// 	if (movable === targetMovable) {
		// 		return false;
		// 	}
		//
		// 	const otherRect : DOMRect = movable.getBoundingClientRect();
		//
		// 	return otherRect.x < event.clientX && otherRect.x + otherRect.width > event.clientX
		// 		&& otherRect.y < event.clientY && otherRect.y + otherRect.height > event.clientY;
		// });
		//
		// if (!!replaceTarget) {
		// 	const movables : MovableDirective[] = this.movables.toArray();
		//
		// 	this.sort.emit({
		// 		currentIndex : movables.indexOf(targetMovable),
		// 		newIndex : movables.indexOf(replaceTarget)
		// 	});
		// }
	}

}
