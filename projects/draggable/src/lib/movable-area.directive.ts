import { AfterContentInit, ContentChildren, Directive, ElementRef, QueryList } from '@angular/core';

import { Subscription } from 'rxjs';

import { MovableDirective } from './movable.directive';


@Directive({
	selector : '[ngMovableArea]'
})
export class MovableAreaDirective implements AfterContentInit {

	@ContentChildren(MovableDirective) movables : QueryList<MovableDirective> | undefined;

	protected subscriptions : Subscription[] = [];


	constructor (protected ele : ElementRef) {
	}

	ngAfterContentInit () {
		this.movables?.changes.subscribe(() => {
			this.subscriptions.forEach(sub => sub.unsubscribe());

			this.subscriptions = [];

			this.movables?.forEach(movable => {
				this.subscriptions.push(
					movable.dragStart.subscribe(() => {
						this.setBoundaries(movable);
					})
				);
			});
		});

		this.movables?.notifyOnChanges();
	}

	setBoundaries (movable : MovableDirective) {
		const areaRect : DOMRect = this.ele.nativeElement.getBoundingClientRect();

		movable.setMovementBoundaries({
			minX : areaRect.left,
			maxX : areaRect.right,
			minY : areaRect.top,
			maxY : areaRect.bottom
		});
	}

}
