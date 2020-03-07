import { AfterContentInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';

import { MovableAreaDirective } from './movable-area.directive';
import { MovableDirective } from './movable.directive';
import { DragEvent, SortEvent } from './interfaces';

@Directive({
	selector : '[ngSortableArea]'
})
export class SortableAreaDirective extends MovableAreaDirective implements AfterContentInit {

	@Output() sort : EventEmitter<SortEvent> = new EventEmitter<SortEvent>();

	constructor (ele : ElementRef) {
		super(ele);
	}

	ngAfterContentInit () {
		this.movables.changes.subscribe(() => {
			this.subscriptions.forEach(sub => sub.unsubscribe());

			this.subscriptions = [];

			this.movables.forEach((movable : MovableDirective) => {
				this.subscriptions.push(movable.dragStart.subscribe(() => this.setBoundaries(movable)));
				this.subscriptions.push(movable.dragMove.subscribe((event : DragEvent) => this.checkSort(event, movable)));
			});
		});

		this.movables.notifyOnChanges();
	}

	private checkSort (event : DragEvent, targetMovable : MovableDirective) {
		const replaceTarget : MovableDirective = this.movables.find((movable, i) => {
			if (movable === targetMovable) {
				return false;
			}

			return movable.clientRect.x < event.current.x && movable.clientRect.x + movable.clientRect.width > event.current.x
				&& movable.clientRect.y < event.current.y && movable.clientRect.y + movable.clientRect.height > event.current.y;
		});

		if (!!replaceTarget) {
			const movables : MovableDirective[] = this.movables.toArray();

			this.sort.emit({
				currentIndex : movables.indexOf(targetMovable),
				newIndex : movables.indexOf(replaceTarget)
			});
		}
	}

}
