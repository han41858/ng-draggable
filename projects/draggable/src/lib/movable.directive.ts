import { ContentChild, Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { DraggableDirective } from './draggable.directive';
import { MovableHelperDirective } from './movable-helper.directive';
import { Boundaries, DragEvent, Position } from './interfaces';

@Directive({
	selector : '[ngMovable]'
})
export class MovableDirective extends DraggableDirective {

	@ContentChild(MovableHelperDirective) helper : MovableHelperDirective;

	@Input() reset : boolean = true;

	private position : Position = {
		x : 0,
		y : 0
	};

	private boundaries : Boundaries;

	constructor (ele : ElementRef, private sanitizer : DomSanitizer) {
		super(ele);
	}

	@HostBinding('style.transform')
	get transform () : SafeStyle {
		return this.sanitizer.bypassSecurityTrustStyle(
			`translate(${this.position.x}px, ${this.position.y}px)`
		);
	}

	@HostBinding('class.dragSource') get isDragSource () : boolean {
		return this.isDragging;
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
		console.warn('onDragMove()', event);

		if (!!this.helper) {
			this.helper.onDragMove(event, this.boundaries);
		}
	}

	@HostListener('dragEnd', ['$event'])
	onDragEnd (event : DragEvent) {
		console.warn('onDragEnd()', event);

		if (this.reset === false) {
			this.position.x += event.movement.x;
			this.position.y += event.movement.y;
		}

		if (!!this.helper) {
			this.helper.onDragEnd();
		}
	}

	getPosition () : Position {
		return this.position;
	}

	setBoundaries (boundaries : Boundaries) {
		this.boundaries = boundaries;
	}

}
