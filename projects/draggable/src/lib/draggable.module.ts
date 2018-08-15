import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { MovableDirective } from './movable.directive';

@NgModule({
	imports : [],
	declarations : [DraggableDirective, MovableDirective],
	exports : [DraggableDirective, MovableDirective]
})
export class DraggableModule {
}
