import { AfterContentInit, ContentChild, ContentChildren, Directive, ElementRef, QueryList } from '@angular/core';

import { Subscription } from 'rxjs';

import { MovableDirective } from './movable.directive';
import { MovableHelperDirective } from './movable-helper.directive';
import { Position } from './interfaces';

@Directive({
	selector : '[ngMovableArea]'
})
export class MovableAreaDirective implements AfterContentInit {

	@ContentChildren(MovableDirective) movables : QueryList<MovableDirective>;

	@ContentChild(MovableHelperDirective) helper : MovableHelperDirective;

	protected subscriptions : Subscription[] = [];

	constructor (protected ele : ElementRef) {
	}

	ngAfterContentInit () {
		this.movables.changes.subscribe(() => {
			this.subscriptions.forEach(sub => sub.unsubscribe());

			this.subscriptions = [];

			this.movables.forEach(movable => {
				this.subscriptions.push(
					movable.dragStart.subscribe(() => {
						this.setBoundaries(movable);

						if (!!this.helper) {
							this.helper.onDragStart(movable);
						}
					}),
					movable.dragEnd.subscribe(() => {
						if (!!this.helper) {
							this.helper.onDragEnd();
						}
					})
				);
			});
		});

		this.movables.notifyOnChanges();
	}

	setBoundaries (movable : MovableDirective) {
		const areaRect : DOMRect = this.ele.nativeElement.getBoundingClientRect();

		const movableRect : DOMRect = movable.getBoundingClientRect();
		const movablePosition : Position = movable.getPosition();

		movable.setBoundaries({
			minX : areaRect.left - movableRect.left + movablePosition.x,
			maxX : areaRect.right - movableRect.right + movablePosition.x,
			minY : areaRect.top - movableRect.top + movablePosition.y,
			maxY : areaRect.bottom - movableRect.bottom + movablePosition.y
		});
	}

}
