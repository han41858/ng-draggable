import { Directive, OnDestroy, OnInit } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';

@Directive({
	selector : '[ngMovableHelper]'
})
export class MovableHelperDirective implements OnInit, OnDestroy {

	private overlayRef : OverlayRef;

	constructor (private overlay : Overlay) {
		console.warn('MovableHelperDirective.constructor()');
	}

	ngOnInit () {
		this.overlayRef = this.overlay.create({
			positionStrategy : new GlobalPositionStrategy()
		});
	}

	ngOnDestroy () {
		this.overlayRef.dispose();
	}

	onDragStart () {
		console.log('onDragStart()');
	}

	onDragMove () {
		console.log('onDragMove()');
	}

	onDragEnd () {
		console.log('onDragEnd()');
	}

}
