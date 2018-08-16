import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { MovableDirective } from './movable.directive';
import { MovableAreaDirective } from './movable-area.directive';

@NgModule({
	imports : [],
	declarations : [DraggableDirective, MovableDirective, MovableAreaDirective],
	exports : [DraggableDirective, MovableDirective, MovableAreaDirective]
})
export class DraggableModule {
}
