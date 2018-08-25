import { ContentChild, Directive, ElementRef, HostListener, Input } from '@angular/core';

import { DraggableDirective } from './draggable.directive';
import { MovableHelperDirective } from './movable-helper.directive';
import { Boundaries, DragEvent } from './interfaces';


@Directive({
	selector : '[ngMovable]'
})
export class MovableDirective extends DraggableDirective {

	@ContentChild(MovableHelperDirective) helper : MovableHelperDirective;

	@Input() reset : boolean = true;

	private boundaries : Boundaries;

	constructor (ele : ElementRef) {
		super(ele);
	}

	@HostListener('dragStart', ['$event'])
	onDragStart (event : DragEvent) {
		console.warn('onDragStart()', event);

		// if (!!this.helper) {
		// 	this.helper.onDragStart(this);
		// }
	}

	@HostListener('dragMove', ['$event'])
	onDragMove (event : DragEvent) {
		console.warn('onDragMove()', event);

		// if (!!this.helper) {
		// 	this.helper.onDragMove(event, this.boundaries);
		// }
	}

	@HostListener('dragEnd', ['$event'])
	onDragEnd (event : DragEvent) {
		console.warn('onDragEnd()', event);

		// if (this.reset) {
		// 	this.position = {
		// 		x : 0,
		// 		y : 0
		// 	};
		// }

		// if (!!this.helper) {
		// 	this.helper.onDragEnd();
		// }
	}

	setBoundaries (boundaries : Boundaries) {
		this.boundaries = boundaries;
	}

}
