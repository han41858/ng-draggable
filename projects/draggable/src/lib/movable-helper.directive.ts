import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { MovableDirective } from './movable.directive';


@Directive({
	selector : '[ngMovableHelper]'
})
export class MovableHelperDirective implements OnInit, OnDestroy {

	private overlayRef : OverlayRef;

	constructor (private overlay : Overlay, private templateRef : TemplateRef<any>, private viewContainerRef : ViewContainerRef) {
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

			const rootEle = this.overlayRef.overlayElement;

			rootEle.appendChild(movable.nativeElement.cloneNode(true));
		}
	}

	onDragMove () {
		console.log('onDragMove()');
	}

	onDragEnd () {
		console.log('onDragEnd()', this.overlayRef.hasAttached());

		if (this.overlayRef.hasAttached()) {
			this.overlayRef.overlayElement.innerHTML = '';

			this.overlayRef.detach();
		}
	}

}
