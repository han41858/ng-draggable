import { ContentChild, Directive, ElementRef, HostListener, Input } from '@angular/core';

import { DraggableDirective } from './draggable.directive';
import { MovableHelperDirective } from './movable-helper.directive';
import { Boundaries } from './interfaces';


@Directive({
	selector : '[ngMovable]'
})
export class MovableDirective extends DraggableDirective {

	@ContentChild(MovableHelperDirective) helper : MovableHelperDirective;

	@Input() reset : boolean = true;

	private boundaries : Boundaries;

	constructor (private ele : ElementRef) {
		super();
	}

	@HostListener('dragStart', ['$event'])
	onDragStart (event : DragEvent) {
		console.warn('onDragStart()', event);

		if (!!this.helper) {
			this.helper.onDragStart(this);
		}
	}

	@HostListener('dragMove', ['$event'])
	onDragMove (event : DragEvent) {
		if (!!this.helper) {
			this.helper.onDragMove(event, this.boundaries);
		}
	}

	@HostListener('dragEnd', ['$event'])
	onDragEnd (event : DragEvent) {
		// if (this.reset) {
		// 	this.position = {
		// 		x : 0,
		// 		y : 0
		// 	};
		// }

		if (!!this.helper) {
			this.helper.onDragEnd();
		}
	}

	getBoundingClientRect () : DOMRect {
		return this.ele.nativeElement.getBoundingClientRect();
	}

	setBoundaries (boundaries : Boundaries) {
		this.boundaries = boundaries;
	}

	get nativeElement () : HTMLElement {
		return this.ele.nativeElement;
	}

}
