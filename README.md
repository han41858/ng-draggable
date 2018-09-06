# NgDraggable

Angular Draggable Module

## demo

## Usage
1. install `ng-draggable-han` npm package.

1. import `DraggableModule` to `NgModule`.
```typescript
import { DraggableModule } from 'ng-draggable-han';

@NgModule({
	imports : [..., DraggableModule]
})

```

1. Add directive to template, for example with `DraggableDirective`:
```html
<div class="box" ngDraggable (dragStart)="onDragStart($event)"></div>
```

1. Declare event handler.
```typescript
class SomeComponent {
	onDragStart (event : DragEvent) {
		// do something
	}
}
```

## Common Interfaces

### Position
```typescript
interface Position {
	x : number;
	y : number;
}
```

### Boundaries
```typescript
interface Boundaries {
	minX : number;
	maxX : number;
	minY : number;
	maxY : number;
}
```

### DragEvent
```typescript
interface DragEvent {
	start : Position;
	current : Position;
	target : HTMLElement;

	movement : Position;
}
```

### SortEvent
```typescript
interface SortEvent {
	currentIndex : number;
	newIndex : number;
}
```

## Directives

### DraggableDirective :`[ngDraggable]`

Add reacting ability to element.

```html
<div ngDraggable>react drag event</div>
```

* properties

	- `isDragging` : flag variable, used to set class name `dragging`

* events

	- `dragStart : DragEvent` : start drag
	
	- `dragMove : DragEvent` : moving drag
	
	- `dragEnd : DragEvent` : end drag
	
* methods

	- `clientRect()` : get DOMRect of element (internally, use `getBoundingClientRect()`)


### MovableDirective : `[ngMovable]`

Add moving ability to element. This need internal `MovableHelper`

```html
<div ngMovable>moving by drag</div>
```

### MovableHelperDirective :`[ngMovableHelper]`

### MovableAreaDirective : `[ngMovableArea]`

### SortableAreaDirective : `[ngSortableArea]`
