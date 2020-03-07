import { ContentChild, Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { DraggableDirective } from './draggable.directive';
import { MovableHelperDirective } from './movable-helper.directive';
import { Boundaries, DragEvent, Position } from './interfaces';

@Directive({
	selector : '[ngMovable]'
})
export class MovableDirective extends DraggableDirective {

	@Input('ngMovable') set isMovable (value : boolean) {
		this.isDraggable = value;
	}

	@ContentChild(MovableHelperDirective, { static : false }) helper : MovableHelperDirective;

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
			`translate(${ this.position.x }px, ${ this.position.y }px)`
		);
	}

	@HostBinding('class.dragSource') get isDragSource () : boolean {
		return this.isDragging;
	}

	@HostListener('dragStart', ['$event'])
	private onDragStart (event : DragEvent) {
		if (!!this.helper) {
			const scrollingEle : HTMLElement = !!document.scrollingElement ?
				document.scrollingElement as HTMLElement :
				document.documentElement;

			const helperStartPosition : Position = {
				x : this.clientRect.x - this.position.x + scrollingEle.scrollLeft,
				y : this.clientRect.y - this.position.y + scrollingEle.scrollTop
			};

			this.helper.onDragStart(this.ele.nativeElement, helperStartPosition);
		}
	}

	@HostListener('dragMove', ['$event'])
	private onDragMove (event : DragEvent) {
		if (!!this.helper) {
			const newPosition : Position = this.restrictMovement({
				x : event.movement.x,
				y : event.movement.y
			});

			this.helper.onDragMove(newPosition);
		}
	}

	@HostListener('dragEnd', ['$event'])
	private onDragEnd (event : DragEvent) {
		if (!!this.helper) {
			this.helper.onDragEnd();
		}

		if (this.reset) {
			this.position = {
				x : 0,
				y : 0
			};
		} else {
			const restrictedMovement : Position = this.restrictMovement({
				x : event.movement.x,
				y : event.movement.y
			});

			this.position = {
				x : this.position.x + restrictedMovement.x,
				y : this.position.y + restrictedMovement.y
			};
		}
	}

	setMovementBoundaries (boundaries : Boundaries) {
		this.boundaries = {
			minX : boundaries.minX - this.clientRect.left,
			maxX : boundaries.maxX - this.clientRect.right,
			minY : boundaries.minY - this.clientRect.top,
			maxY : boundaries.maxY - this.clientRect.bottom
		};
	}

	private restrictMovement (movement : Position) : Position {
		const newMovement : Position = { ...movement };

		if (this.reset === false && !!this.boundaries) {
			// boundaries modification
			newMovement.x = Math.min(newMovement.x, this.boundaries.maxX);
			newMovement.x = Math.max(newMovement.x, this.boundaries.minX);

			newMovement.y = Math.min(newMovement.y, this.boundaries.maxY);
			newMovement.y = Math.max(newMovement.y, this.boundaries.minY);
		}

		return newMovement;
	}

}
