import { AfterContentInit, ContentChild, Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

import { DraggableDirective } from './draggable.directive';
import { Boundaries, Position } from './interfaces';
import { MovableHelperDirective } from './movable-helper.directive';

@Directive({
	selector : '[ngMovable]'
})
export class MovableDirective extends DraggableDirective implements AfterContentInit{

	@Input() reset : boolean = true;

	private startPosition : Position = { x : 0, y : 0 };
	private position : Position = { x : 0, y : 0 };

	private boundaries : Boundaries;

	@ContentChild(MovableHelperDirective) helper : MovableHelperDirective;

	constructor (private ele : ElementRef) {
		super();
		
		setInterval(() => {
			console.warn('this.helper :', this.helper);
		}, 1000);
	}

	ngAfterContentInit(){
		setTimeout(() => {
			console.warn(this.helper);
		})

	}

	@HostBinding('style.transform') get transform () : string {
		return `translate(${this.position.x}px, ${this.position.y}px)`;
	}

	@HostListener('dragStart', ['$event'])
	onDragStart (event : DragEvent) {
		console.warn(this.helper);
		this.startPosition = {
			x : event.clientX - this.position.x,
			y : event.clientY - this.position.y
		};

		if(!!this.helper){
			this.helper.onDragStart();
		}
	}

	@HostListener('dragMove', ['$event'])
	onDragMove (event : DragEvent) {
		console.warn(this.helper);
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

		if(!!this.helper){
			this.helper.onDragMove();
		}
	}

	@HostListener('dragEnd', ['$event'])
	onDragEnd (event : DragEvent) {
		if (this.reset) {
			this.position = {
				x : 0,
				y : 0
			};
		}

		if(!!this.helper){
			this.helper.onDragEnd();
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
