import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { DraggableDirective } from './draggable.directive';

interface Position {
	x : number;
	y : number;
}

@Directive({
	selector : '[ngMovable]'
})
export class MovableDirective extends DraggableDirective {

	@Input() reset : boolean = true;

	private startPosition : Position = { x : 0, y : 0 };
	private position : Position = { x : 0, y : 0 };

	@HostBinding('style.transform') get transform () : string {
		return `translate(${this.position.x}px, ${this.position.y}px)`;
	}

	@HostListener('dragStart', ['$event'])
	onDragStart (event : PointerEvent) {
		this.startPosition = {
			x : event.clientX - this.position.x,
			y : event.clientY - this.position.y
		};
	}

	@HostListener('dragMove', ['$event'])
	onDragMove (event : PointerEvent) {
		this.position = {
			x : event.clientX - this.startPosition.x,
			y : event.clientY - this.startPosition.y
		};
	}

	@HostListener('dragEnd', ['$event'])
	onDragEnd (event : PointerEvent) {
		if (this.reset) {
			this.position = {
				x : 0,
				y : 0
			};
		}
	}

}
