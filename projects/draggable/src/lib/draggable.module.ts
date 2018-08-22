import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { DraggableDirective } from './draggable.directive';
import { MovableDirective } from './movable.directive';
import { MovableAreaDirective } from './movable-area.directive';
import { SortableAreaDirective } from './sortable-area.directive';
import { MovableHelperDirective } from './movable-helper.directive';


@NgModule({
	imports : [OverlayModule],
	declarations : [DraggableDirective, MovableDirective, MovableAreaDirective, SortableAreaDirective, MovableHelperDirective],
	exports : [DraggableDirective, MovableDirective, MovableAreaDirective, SortableAreaDirective, MovableHelperDirective]
})
export class DraggableModule {
}
