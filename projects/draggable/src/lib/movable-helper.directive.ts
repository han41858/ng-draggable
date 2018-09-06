import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { Position } from './interfaces';

@Directive({
	selector : '[ngMovableHelper]'
})
export class MovableHelperDirective implements OnInit, OnDestroy {

	private overlayRef : OverlayRef;
	private rootEle : HTMLElement;

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

	onDragStart (template : HTMLElement, startPosition : Position) {
		if (!this.overlayRef.hasAttached()) {
			this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));

			const overlayContainer : HTMLElement = this.overlayRef.hostElement;

			overlayContainer.style.position = 'absolute';

			overlayContainer.style.left = `${startPosition.x}px`;
			overlayContainer.style.top = `${startPosition.y}px`;

			this.rootEle = this.overlayRef.overlayElement;
			this.setPosition({ x : 0, y : 0 });

			const cloneEle : HTMLElement = template.cloneNode(true) as HTMLElement;

			const style : CSSStyleDeclaration = getComputedStyle(template);

			if (style['display'] === 'flex') {
				// set fixed size
				cloneEle.style.width = style['width'];
				cloneEle.style.height = style['height'];
			}

			const classNames : string[] = cloneEle.className.split(' ');
			classNames.push('dragging');
			cloneEle.className = classNames.join(' ');

			this.rootEle.appendChild(cloneEle);
		}
	}

	private setPosition (position : Position) {
		if (!!this.rootEle) {
			this.rootEle.style.transform = `translate(${position.x}px, ${position.y}px)`;
		}
	}

	onDragMove (position : Position) {
		this.setPosition(position);
	}

	onDragEnd () {
		if (this.overlayRef.hasAttached()) {
			this.rootEle.innerHTML = '';

			this.overlayRef.detach();
		}
	}

}
