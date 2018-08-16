import { AfterContentInit, ContentChildren, Directive, ElementRef, QueryList } from '@angular/core';

import { Subscription } from 'rxjs';

import { MovableDirective } from './movable.directive';

interface Boundaries {
	minX : number;
	maxX : number;
	minY : number;
	maxY : number;
}

@Directive({
	selector : '[ngMovableArea]'
})
export class MovableAreaDirective implements AfterContentInit {

	@ContentChildren(MovableDirective) movables : QueryList<MovableDirective>;

	private subscriptions : Subscription[] = [];
	private boundaries : Boundaries;

	constructor (private ele : ElementRef) {
	}

	ngAfterContentInit () {
		this.movables.changes.subscribe(() => {
			this.subscriptions.forEach(sub => sub.unsubscribe());

			this.subscriptions = [];

			this.movables.forEach(movable => {
				this.subscriptions.push(movable.dragStart.subscribe(() => this.checkBoundaries(movable)));
				this.subscriptions.push(movable.dragMove.subscribe(() => this.restrictBoundaries(movable)));
			});
		});

		this.movables.notifyOnChanges();
	}

	checkBoundaries (movable : MovableDirective) {
		const areaRect : DOMRect = this.ele.nativeElement.getBoundingClientRect();
		const movableRect : DOMRect = movable.ele.nativeElement.getBoundingClientRect();

		this.boundaries = {
			minX : areaRect.left - movableRect.left + movable.position.x,
			maxX : areaRect.right - movableRect.right + movable.position.x,
			minY : areaRect.top - movableRect.top + movable.position.y,
			maxY : areaRect.bottom - movableRect.bottom + movable.position.y
		};
	}

	restrictBoundaries (movable : MovableDirective) {
		if (movable.position.x < this.boundaries.minX) {
			movable.position.x = this.boundaries.minX;
		}

		if (movable.position.x > this.boundaries.maxX) {
			movable.position.x = this.boundaries.maxX;
		}

		if (movable.position.y < this.boundaries.minY) {
			movable.position.y = this.boundaries.minY;
		}

		if (movable.position.y > this.boundaries.maxY) {
			movable.position.y = this.boundaries.maxY;
		}
	}

}
