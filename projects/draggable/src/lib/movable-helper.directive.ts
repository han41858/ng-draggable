import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { MovableDirective } from './movable.directive';
import { Boundaries, DragEvent, Position } from './interfaces';

@Directive({
	selector : '[ngMovableHelper]'
})
export class MovableHelperDirective implements OnInit, OnDestroy {

	private overlayRef : OverlayRef;
	private rootEle : HTMLElement;

	private startPosition : Position = { x : 0, y : 0 };
	private position : Position = { x : 0, y : 0 };

	constructor (
		private overlay : Overlay,
		private templateRef : TemplateRef<any>,
		private viewContainerRef : ViewContainerRef) {
	}

	ngOnInit () {
		this.overlayRef = this.overlay.create({
			positionStrategy : new GlobalPositionStrategy()
		});
	}

	ngOnDestroy () {
		this.overlayRef.dispose();
	}

	onDragStart (movable : MovableDirective) {
		console.log('onDragStart()');

		if (!this.overlayRef.hasAttached()) {
			this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));

			const overlayContainer : HTMLElement = this.overlayRef.hostElement;

			overlayContainer.style.position = 'absolute';
			overlayContainer.style.left = '0';
			overlayContainer.style.top = '0';

			this.rootEle = this.overlayRef.overlayElement;

			const rectPosition : DOMRect = movable.getBoundingClientRect();

			this.startPosition = {
				x : rectPosition.x,
				y : rectPosition.y
			};

			this.setPosition(this.startPosition);

			const cloneEle : HTMLElement = movable.nativeElement.cloneNode(true) as HTMLElement;

			const classNames : string[] = cloneEle.className.split(' ');
			classNames.push('dragging');
			cloneEle.className = classNames.join(' ');

			this.rootEle.appendChild(cloneEle);
		}
	}

	private setPosition (position : Position) {
		console.warn('setPosition()', position);

		if (!!this.rootEle) {
			this.rootEle.style.transform = `translate(${position.x}px, ${position.y}px)`;
		}
	}

	onDragMove (event : DragEvent, boundaries : Boundaries) {
		console.log('onDragMove()', event, boundaries);

		const newPosition = {
			x : event.movementX - this.startPosition.x,
			y : event.movementY - this.startPosition.y
		};

		if (!!boundaries) {
			// boundaries modification
			if (newPosition.x < boundaries.minX) {
				newPosition.x = boundaries.minX;
			}

			if (newPosition.x > boundaries.maxX) {
				newPosition.x = boundaries.maxX;
			}

			if (newPosition.y < boundaries.minY) {
				newPosition.y = boundaries.minY;
			}

			if (newPosition.y > boundaries.maxY) {
				newPosition.y = boundaries.maxY;
			}
		}

		this.position = newPosition;

		// this.setPosition(this.position);
	}

	onDragEnd () {
		console.log('onDragEnd()');

		if (this.overlayRef.hasAttached()) {
			this.rootEle.innerHTML = '';

			this.overlayRef.detach();
		}
	}

}
