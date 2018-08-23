import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

import { DraggableDirective } from './draggable.directive';
import { Boundaries, Position } from './interfaces';

@Directive({
	selector : '[ngMovable]'
})
export class MovableDirective extends DraggableDirective {

	@Input() reset : boolean = true;

	private startPosition : Position = { x : 0, y : 0 };
	private position : Position = { x : 0, y : 0 };

	private boundaries : Boundaries;

	constructor (private ele : ElementRef) {
		super();
	}

	@HostBinding('style.transform') get transform () : string {
		return `translate(${this.position.x}px, ${this.position.y}px)`;
	}

	@HostListener('dragStart', ['$event'])
	onDragStart (event : DragEvent) {
		this.startPosition = {
			x : event.clientX - this.position.x,
			y : event.clientY - this.position.y
		};
	}

	@HostListener('dragMove', ['$event'])
	onDragMove (event : DragEvent) {
		const newPosition = {
			x : event.clientX - this.startPosition.x,
			y : event.clientY - this.startPosition.y
		};

		if (!!this.boundaries) {
			// boundaries modification
			if (newPosition.x < this.boundaries.minX) {
				newPosition.x = this.boundaries.minX;
			}

			if (newPosition.x > this.boundaries.maxX) {
				newPosition.x = this.boundaries.maxX;
			}

			if (newPosition.y < this.boundaries.minY) {
				newPosition.y = this.boundaries.minY;
			}

			if (newPosition.y > this.boundaries.maxY) {
				newPosition.y = this.boundaries.maxY;
			}
		}

		this.position = newPosition;
	}

	@HostListener('dragEnd', ['$event'])
	onDragEnd (event : DragEvent) {
		if (this.reset) {
			this.position = {
				x : 0,
				y : 0
			};
		}
	}

	getPosition () : Position {
		return this.position;
	}

	getBoundingClientRect () : DOMRect {
		return this.ele.nativeElement.getBoundingClientRect();
	}

	setBoundaries (boundaries : Boundaries) {
		this.boundaries = boundaries;
	}

}
